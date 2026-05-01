import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { generateQRPayload } from '@/lib/qr-crypto';
import QRCode from 'qrcode';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Download, Printer, CheckCircle2, QrCode } from 'lucide-react';
import { toast } from 'sonner';

interface QRItem {
  id: string;
  dataUrl: string;
}

export function GenerateQR() {
  const [inputIds, setInputIds] = useState('');
  const [qrItems, setQrItems] = useState<QRItem[]>([]);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const printRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async () => {
    const ids = inputIds.split('\n').map(s => s.trim()).filter(s => s.length > 0);
    
    if (ids.length === 0) {
      toast.error('Please enter at least one Student ID');
      return;
    }

    setGenerating(true);
    setProgress(0);
    const newItems: QRItem[] = [];

    try {
      for (let i = 0; i < ids.length; i++) {
        const id = ids[i];
        const payload = await generateQRPayload(id);
        const dataUrl = await QRCode.toDataURL(payload, {
          width: 300,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#ffffff',
          },
        });
        
        newItems.push({ id, dataUrl });
        setProgress(((i + 1) / ids.length) * 100);
      }
      
      setQrItems(newItems);
      toast.success(`Generated ${newItems.length} QR codes`);
    } catch (error) {
      console.error(error);
      toast.error('Failed to generate some QR codes');
    } finally {
      setGenerating(false);
    }
  };

  const handleDownloadZip = async () => {
    if (qrItems.length === 0) return;
    
    const zip = new JSZip();
    
    qrItems.forEach(item => {
      // Remove data:image/png;base64,
      const base64Data = item.dataUrl.replace(/^data:image\/(png|jpg);base64,/, "");
      zip.file(`${item.id}.png`, base64Data, { base64: true });
    });

    try {
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "Farewell_QRs.zip");
      toast.success('ZIP download started');
    } catch (error) {
      toast.error('Failed to create ZIP file');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto w-full space-y-8 animate-fade-in-up">
      <header>
        <h1 className="font-syne text-2xl lg:text-3xl font-bold mb-2">Generate QR Codes</h1>
        <p className="text-text-muted">Create cryptographically signed QR codes for students.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-1 space-y-4">
          <Card className="glass-card">
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Student IDs</label>
                <Textarea 
                  placeholder="Paste student IDs, one per line&#10;23331A4203&#10;23331A4205..."
                  className="min-h-[300px] bg-bg-surface/50 border-border-glass font-mono text-sm resize-none"
                  value={inputIds}
                  onChange={(e) => setInputIds(e.target.value)}
                  disabled={generating}
                />
                <div className="text-xs text-text-muted text-right">
                  {inputIds.split('\n').filter(s => s.trim().length > 0).length} IDs detected
                </div>
              </div>

              {generating ? (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Generating...</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              ) : (
                <Button 
                  className="w-full bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-700 hover:to-purple-800 text-white"
                  onClick={handleGenerate}
                >
                  Generate {inputIds.split('\n').filter(s => s.trim().length > 0).length || ''} QR Codes
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-4">
          {qrItems.length > 0 ? (
            <>
              <div className="flex flex-wrap gap-4 items-center justify-between bg-bg-surface/30 p-4 rounded-xl border border-border-glass print:hidden">
                <div className="flex items-center gap-2 text-accent-teal">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-medium">{qrItems.length} QRs Ready</span>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" className="border-border-glass bg-bg-surface hover:bg-bg-glass" onClick={handlePrint}>
                    <Printer className="w-4 h-4 mr-2" />
                    Print
                  </Button>
                  <Button className="bg-white text-black hover:bg-gray-200" onClick={handleDownloadZip}>
                    <Download className="w-4 h-4 mr-2" />
                    Download ZIP
                  </Button>
                </div>
              </div>

              {/* Grid for web viewing */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 h-[500px] overflow-y-auto pr-2 print:hidden">
                {qrItems.map(item => (
                  <Card key={item.id} className="bg-white border-none overflow-hidden aspect-[3/4] flex flex-col">
                    <div className="p-4 flex-1 flex flex-col items-center justify-center gap-2">
                      <img src={item.dataUrl} alt={`QR for ${item.id}`} className="w-full aspect-square" />
                      <p className="text-black font-mono font-bold text-center text-sm sm:text-base mt-2">
                        {item.id}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Print-only layout */}
              <div className="hidden print:grid print:grid-cols-3 print:gap-4 print:bg-white print:text-black">
                {qrItems.map(item => (
                  <div key={item.id} className="flex flex-col items-center p-4 border border-gray-200 break-inside-avoid">
                    <img src={item.dataUrl} alt={`QR for ${item.id}`} className="w-40 h-40" />
                    <p className="font-mono font-bold mt-2">{item.id}</p>
                    <p className="text-xs text-gray-500">Farewell 2026</p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center border border-dashed border-border-glass rounded-xl text-text-muted glass-card">
              <QrCode className="w-16 h-16 opacity-20 mb-4" />
              <p>Generated QR codes will appear here</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
