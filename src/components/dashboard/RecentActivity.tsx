import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { QrCode } from "lucide-react";
import { Student } from "@/types";

interface RecentActivityProps {
  students: Student[];
}

export function RecentActivity({ students }: RecentActivityProps) {
  // Extract all scan events (checkins and food) and sort by time
  const events: { type: 'checkin' | 'food'; student: Student; time: Date }[] = [];
  
  students.forEach(s => {
    if (s.checkedIn && s.checkInTime) {
      events.push({ type: 'checkin', student: s, time: new Date(s.checkInTime) });
    }
    if (s.foodCollected && s.foodTime) {
      events.push({ type: 'food', student: s, time: new Date(s.foodTime) });
    }
  });

  // Sort descending
  events.sort((a, b) => b.time.getTime() - a.time.getTime());
  
  // Take top 10
  const recentEvents = events.slice(0, 10);

  const formatRelativeTime = (date: Date) => {
    const diffInSeconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (diffInSeconds < 60) return `${diffInSeconds} secs ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} mins ago`;
    return `${Math.floor(diffInSeconds / 3600)} hrs ago`;
  };

  return (
    <Card className="glass-card mt-6">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-syne">Recent Scans</CardTitle>
        <Badge variant="outline" className="border-border-glass">
          {recentEvents.length} Events
        </Badge>
      </CardHeader>
      <CardContent>
        {recentEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center text-text-muted">
            <div className="w-16 h-16 rounded-full bg-bg-surface flex items-center justify-center mb-4">
              <QrCode className="w-8 h-8 opacity-50" />
            </div>
            <p>No scans yet.</p>
          </div>
        ) : (
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {recentEvents.map((event, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-bg-surface/50 border border-border-glass/50 hover:bg-bg-surface transition-colors animate-fade-in-up" style={{ animationDelay: `${idx * 50}ms` }}>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10 border border-border-glass">
                      <AvatarFallback className="bg-bg-surface text-xs">
                        {event.student.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{event.student.name}</p>
                      <p className="text-xs text-text-muted">{event.student.studentId}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {event.type === 'checkin' ? (
                      <Badge className="bg-accent-teal/20 text-accent-teal hover:bg-accent-teal/30 border-none">Check-in</Badge>
                    ) : (
                      <Badge className="bg-accent-amber/20 text-accent-amber hover:bg-accent-amber/30 border-none">Food</Badge>
                    )}
                    <span className="text-[10px] text-text-muted">{formatRelativeTime(event.time)}</span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
