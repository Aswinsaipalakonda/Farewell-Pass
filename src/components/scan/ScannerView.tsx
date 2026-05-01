import { useEffect, useRef } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { playBeep } from '@/lib/utils';

interface ScannerViewProps {
  onScanSuccess: (decodedText: string) => void;
  paused: boolean;
}

export function ScannerView({ onScanSuccess, paused }: ScannerViewProps) {
  const qrRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    // 1. Setup scanner
    const html5QrCode = new Html5Qrcode("qr-reader", {
      verbose: false,
      formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE]
    });
    qrRef.current = html5QrCode;

    // 2. Start scanning if not paused
    if (!paused) {
      const config = { 
        fps: 20, // Faster detection
        qrbox: { width: 280, height: 280 },
        aspectRatio: 1.0,
        experimentalFeatures: {
          useBarCodeDetectorIfSupported: true
        }
      };

      html5QrCode.start(
        { facingMode: "environment" }, 
        config,
        (decodedText) => {
          // Play sound immediately on detection
          playBeep(); 
          
          // Stop scanning and trigger success
          html5QrCode.stop().then(() => {
            onScanSuccess(decodedText);
          }).catch(console.error);
        },
        () => { /* Ignore errors */ }
      ).catch((err) => {
        console.error("Camera start failed:", err);
      });
    }

    return () => {
      if (qrRef.current && qrRef.current.isScanning) {
        qrRef.current.stop().catch(console.error);
      }
    };
  }, [paused, onScanSuccess]);

  return (

    <div className="relative w-full max-w-[320px] mx-auto aspect-square overflow-hidden rounded-2xl bg-black border border-border-glass">
      {/* Custom brackets */}
      <div className="scanner-bracket scanner-bracket-tl"></div>
      <div className="scanner-bracket scanner-bracket-tr"></div>
      <div className="scanner-bracket scanner-bracket-bl"></div>
      <div className="scanner-bracket scanner-bracket-br"></div>
      
      {/* Scanning Line Animation */}
      {!paused && (
        <div className="absolute top-0 left-0 w-full h-[2px] bg-accent-purple shadow-[0_0_8px_2px_rgba(124,58,237,0.5)] z-30 animate-scan-line"></div>
      )}

      {/* html5-qrcode container */}
      <div id="qr-reader" className="w-full h-full [&>div]:!border-none [&_video]:!object-cover [&_video]:!w-full [&_video]:!h-full [&_#qr-reader__scan_region]:!min-h-[320px]"></div>

      {paused && (
        <div className="absolute inset-0 bg-black/60 z-20 flex items-center justify-center backdrop-blur-sm">
          <p className="text-white font-medium">Processing...</p>
        </div>
      )}
    </div>
  );
}
