import { useState, useCallback } from 'react';
import { ScannerView } from '@/components/scan/ScannerView';
import { ScanResultModal } from '@/components/scan/ScanResultModal';
import { verifyQRPayload } from '@/lib/qr-crypto';
import { databases, DB_ID, STUDENTS_COLLECTION_ID } from '@/lib/appwrite';
import { Query } from 'appwrite';
import { Student } from '@/types';
import { toast } from 'sonner';

export function Scan() {
  const [scannedStudent, setScannedStudent] = useState<Student | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Pauses the scanner when modal is open
  const paused = isModalOpen || loading;

  const handleScanSuccess = useCallback(async (decodedText: string) => {
    if (paused) return;
    setLoading(true);

    try {
      const { valid, studentId } = await verifyQRPayload(decodedText);
      
      if (!valid || !studentId) {
        toast.error('✗ Invalid or unrecognized QR code');
        setLoading(false);
        return;
      }

      // Flash green effect can be added here if needed

      const response = await databases.listDocuments(DB_ID, STUDENTS_COLLECTION_ID, [
        Query.equal('studentId', studentId)
      ]);

      if (response.documents.length === 0) {
        toast.error(`Student ID ${studentId} not found in database.`);
        setLoading(false);
        return;
      }

      const doc = response.documents[0];
      setScannedStudent({
        $id: doc.$id,
        studentId: doc.studentId,
        name: doc.name,
        branch: doc.branch,
        checkedIn: doc.checkedIn,
        foodCollected: doc.foodCollected,
        checkInTime: doc.checkInTime,
        foodTime: doc.foodTime,
      });
      setIsModalOpen(true);
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [paused]);

  const handleAction = async (action: 'checkin' | 'food', documentId: string) => {
    setLoading(true);
    try {
      const updateData: any = {};
      const now = new Date().toISOString();

      if (action === 'checkin') {
        updateData.checkedIn = true;
        updateData.checkInTime = now;
      } else {
        updateData.foodCollected = true;
        updateData.foodTime = now;
      }

      await databases.updateDocument(DB_ID, STUDENTS_COLLECTION_ID, documentId, updateData);
      
      if (action === 'checkin') {
        toast.success(`✓ ${scannedStudent?.name} checked in successfully`);
      } else {
        toast.success(`🍽 Food marked for ${scannedStudent?.name}`);
      }

      setIsModalOpen(false);
      setScannedStudent(null);
    } catch (error) {
      toast.error('Failed to update record. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Add small delay to prevent immediate rescan
    setTimeout(() => {
      setScannedStudent(null);
    }, 500);
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] lg:min-h-screen bg-bg-base items-center justify-center p-4">
      <div className="w-full max-w-md flex flex-col items-center">
        
        <div className="text-center mb-8 animate-fade-in-up">
          <h1 className="text-3xl font-syne font-bold mb-2">Scan QR Code</h1>
          <p className="text-text-muted">Point camera at student's QR code</p>
          
          <div className="mt-4 flex items-center justify-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${paused ? 'bg-accent-amber animate-pulse' : 'bg-accent-teal'}`}></span>
            <span className="text-sm font-medium text-text-muted">
              {paused ? 'Processing...' : 'Ready to scan'}
            </span>
          </div>
        </div>

        <ScannerView onScanSuccess={handleScanSuccess} paused={paused} />

        <div className="mt-8 text-center text-text-muted text-sm">
          <p>Scanning is automatic.</p>
          <p>Hold the device steady.</p>
        </div>

      </div>

      <ScanResultModal 
        open={isModalOpen}
        student={scannedStudent}
        onClose={handleCloseModal}
        onAction={handleAction}
        loading={loading}
      />
    </div>
  );
}
