import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Student } from "@/types";
import { CheckCircle2, Clock } from "lucide-react";

interface StudentTableProps {
  students: Student[];
}

export function StudentTable({ students }: StudentTableProps) {
  const formatTime = (isoString?: string) => {
    if (!isoString) return "-";
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="rounded-xl border border-border-glass overflow-hidden glass-card">
      <Table>
        <TableHeader className="bg-bg-surface/50">
          <TableRow className="border-border-glass hover:bg-transparent">
            <TableHead className="text-text-muted">Student</TableHead>
            <TableHead className="text-text-muted">ID</TableHead>
            <TableHead className="text-text-muted">Branch</TableHead>
            <TableHead className="text-text-muted">Check-in</TableHead>
            <TableHead className="text-text-muted">Food</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => (
            <TableRow key={student.$id} className="border-border-glass hover:bg-bg-surface/50 transition-colors">
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8 border border-border-glass">
                    <AvatarFallback className="bg-bg-surface text-xs text-text-primary">
                      {(student.name || student.studentId).substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{student.name || student.studentId}</span>
                </div>
              </TableCell>
              <TableCell className="text-text-muted">{student.studentId}</TableCell>
              <TableCell className="text-text-muted">{student.branch || '-'}</TableCell>
              <TableCell>
                {student.checkedIn ? (
                  <Badge className="bg-accent-teal/10 text-accent-teal border border-accent-teal/20 hover:bg-accent-teal/20">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Done · {formatTime(student.checkInTime)}
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-text-muted border-border-glass">
                    <Clock className="w-3 h-3 mr-1" /> Pending
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                {student.foodCollected ? (
                  <Badge className="bg-accent-amber/10 text-accent-amber border border-accent-amber/20 hover:bg-accent-amber/20">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Done · {formatTime(student.foodTime)}
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-text-muted border-border-glass">
                    <Clock className="w-3 h-3 mr-1" /> Pending
                  </Badge>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
