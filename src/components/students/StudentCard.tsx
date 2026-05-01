import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { Student } from "@/types";
import { cn } from "@/lib/utils";

interface StudentCardProps {
  student: Student;
}

export function StudentCard({ student }: StudentCardProps) {
  const isPending = !student.checkedIn;
  const isCheckinOnly = student.checkedIn && !student.foodCollected;
  const isCompleted = student.checkedIn && student.foodCollected;

  return (
    <div className={cn(
      "relative flex items-center p-4 rounded-xl glass-card transition-all overflow-hidden",
      "hover:bg-bg-surface/80"
    )}>
      {/* Left colored border strip */}
      <div className={cn(
        "absolute left-0 top-0 bottom-0 w-1",
        isPending ? "bg-text-muted" :
        isCheckinOnly ? "bg-accent-teal" :
        "bg-gradient-to-b from-accent-teal to-accent-amber"
      )} />

      <Avatar className="h-12 w-12 border border-border-glass ml-2">
        <AvatarFallback className="bg-bg-surface text-sm font-medium">
          {student.name.substring(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className="ml-4 flex-1 min-w-0">
        <h3 className="text-base font-bold font-syne truncate">{student.name}</h3>
        <p className="text-sm text-text-muted truncate">{student.studentId}</p>
      </div>

      <div className="ml-4 flex flex-col items-end gap-1 shrink-0">
        <Badge 
          className={cn(
            "text-[10px] px-2 py-0.5",
            student.checkedIn 
              ? "bg-accent-teal/10 text-accent-teal hover:bg-accent-teal/20" 
              : "bg-bg-glass text-text-muted hover:bg-bg-glass"
          )}
        >
          {student.checkedIn ? 'Check-in ✓' : 'Check-in'}
        </Badge>
        <Badge 
          className={cn(
            "text-[10px] px-2 py-0.5",
            student.foodCollected 
              ? "bg-accent-amber/10 text-accent-amber hover:bg-accent-amber/20" 
              : "bg-bg-glass text-text-muted hover:bg-bg-glass"
          )}
        >
          {student.foodCollected ? 'Food ✓' : 'Food'}
        </Badge>
      </div>
    </div>
  );
}
