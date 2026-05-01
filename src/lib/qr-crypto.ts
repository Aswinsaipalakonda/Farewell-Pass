const SECRET_KEY = import.meta.env.VITE_QR_SECRET || "MVGR_FAREWELL_2026_SECRET";
const EVENT_KEY = import.meta.env.VITE_EVENT_KEY || "FAREWELL2026";

async function importKey(secret: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary_string = atob(base64);
  const len = binary_string.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
}

export async function generateQRPayload(studentId: string): Promise<string> {
  const key = await importKey(SECRET_KEY);
  const dataToSign = `${studentId}:${EVENT_KEY}`;
  const enc = new TextEncoder();
  
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    enc.encode(dataToSign)
  );

  const sig = arrayBufferToBase64(signature);
  // Return a compact string format instead of JSON to keep QR density low
  return `v1:${studentId}:${sig}`;
}

export async function verifyQRPayload(rawString: string): Promise<{ valid: boolean, studentId?: string }> {
  try {
    // Check for compact format
    if (!rawString.startsWith('v1:')) {
      return { valid: false };
    }

    const parts = rawString.split(':');
    if (parts.length !== 3) return { valid: false };

    const [, studentId, sig] = parts;

    const key = await importKey(SECRET_KEY);
    const dataToVerify = `${studentId}:${EVENT_KEY}`;
    const enc = new TextEncoder();

    const signatureBuffer = base64ToArrayBuffer(sig);

    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBuffer,
      enc.encode(dataToVerify)
    );

    if (isValid) {
      return { valid: true, studentId };
    }
    
    return { valid: false };
  } catch (error) {
    return { valid: false };
  }
}

