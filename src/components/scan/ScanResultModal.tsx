import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UserCheck, Utensils, CheckCircle2 } from "lucide-react";
import type { Student } from "@/types";

interface ScanResultModalProps {
  open: boolean;
  student: Student | null;
  onClose: () => void;
  onAction: (action: 'checkin' | 'food', studentId: string) => Promise<void>;
  loading: boolean;
}

export function ScanResultModal({ open, student, onClose, onAction, loading }: ScanResultModalProps) {
  if (!student) return null;

  const isCheckinPending = !student.checkedIn;
  const isFoodPending = student.checkedIn && !student.foodCollected;
  const isCompleted = student.checkedIn && student.foodCollected;

  return (
    <Dialog open={open} onOpenChange={(val) => {
      // Prevent closing by clicking outside if an action is required, unless completed
      if (!val && isCompleted) onClose();
    }}>
      <DialogContent className="sm:max-w-md bg-bg-surface border-border-glass text-text-primary p-6 gap-6 outline-none shadow-2xl animate-fade-in-up">
        <div className="flex flex-col items-center text-center">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
            isCheckinPending ? 'bg-accent-teal/20 text-accent-teal' :
            isFoodPending ? 'bg-accent-amber/20 text-accent-amber' :
            'bg-accent-red/20 text-accent-red'
          }`}>
            {isCheckinPending && <UserCheck className="w-8 h-8" />}
            {isFoodPending && <Utensils className="w-8 h-8" />}
            {isCompleted && <CheckCircle2 className="w-8 h-8" />}
          </div>
          
          <h2 className="text-2xl font-syne font-bold">{student.name || student.studentId}</h2>
          <p className="text-text-muted mt-1">{student.studentId}</p>
          {student.branch && <p className="text-sm text-text-subtle">{student.branch}</p>}
        </div>

        <Separator className="bg-border-glass" />

        <div className="flex justify-center gap-4">
          <Badge className={student.checkedIn ? "bg-accent-teal/20 text-accent-teal hover:bg-accent-teal/20" : "bg-bg-glass text-text-muted hover:bg-bg-glass"}>
            {student.checkedIn ? 'Check-in ✓' : 'Check-in Pending'}
          </Badge>
          <Badge className={student.foodCollected ? "bg-accent-amber/20 text-accent-amber hover:bg-accent-amber/20" : "bg-bg-glass text-text-muted hover:bg-bg-glass"}>
            {student.foodCollected ? 'Food ✓' : 'Food Pending'}
          </Badge>
        </div>

        <div className="flex flex-col gap-3 mt-2">
          {isCheckinPending && (
            <Button 
              className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white border-none h-12 text-lg"
              onClick={() => onAction('checkin', student.$id)}
              disabled={loading}
            >
              Mark Check-in ✓
            </Button>
          )}

          {isFoodPending && (
            <>
              <Button 
                variant="outline" 
                className="w-full bg-transparent border-accent-teal/50 text-accent-teal opacity-50 cursor-not-allowed h-12"
                disabled
              >
                Check-in Done ✓
              </Button>
              <Button 
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white border-none h-12 text-lg"
                onClick={() => onAction('food', student.$id)}
                disabled={loading}
              >
                Mark Food Collected 🍽
              </Button>
            </>
          )}

          {isCompleted && (
            <Alert variant="destructive" className="bg-accent-red/10 border-accent-red/20 text-accent-red">
              <AlertDescription className="text-center font-medium">
                This student has already completed both check-in and food collection.
              </AlertDescription>
            </Alert>
          )}

          <Button 
            variant="ghost" 
            className="w-full text-text-muted hover:text-white hover:bg-bg-glass h-12"
            onClick={onClose}
            disabled={loading}
          >
            {isCompleted ? "Close" : "Cancel"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
