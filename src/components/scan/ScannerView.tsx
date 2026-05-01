import { useEffect, useRef } from 'react';
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { Button } from '@/components/ui/button';
import { Flashlight, RefreshCcw } from 'lucide-react';

interface ScannerViewProps {
  onScanSuccess: (decodedText: string) => void;
  paused: boolean;
}

export function ScannerView({ onScanSuccess, paused }: ScannerViewProps) {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    // Only initialize if not paused and element exists
    if (paused) {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
        scannerRef.current = null;
      }
      return;
    }

    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { 
        fps: 10, 
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1,
        formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
      },
      false
    );

    scanner.render(
      (text) => {
        // Automatically pause on success
        if (scannerRef.current) {
          scannerRef.current.clear().catch(console.error);
          scannerRef.current = null;
        }
        onScanSuccess(text);
      },
      (error) => {
        // Ignored, continuously checks
      }
    );

    scannerRef.current = scanner;

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
        scannerRef.current = null;
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
