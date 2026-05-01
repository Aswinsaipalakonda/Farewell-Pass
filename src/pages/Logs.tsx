import { useStudents } from '@/hooks/useStudents';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { History, Search, Filter, Download, UserCheck, Utensils } from "lucide-react";
import { Student } from "@/types";
import { Skeleton } from '@/components/ui/skeleton';
import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function Logs() {
  const { students, loading } = useStudents();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'checkin' | 'food'>('all');

  // Extract all events
  const allEvents = useMemo(() => {
    const events: { id: string; type: 'checkin' | 'food'; student: Student; time: Date }[] = [];
    
    students.forEach(s => {
      if (s.checkedIn && s.checkInTime) {
        events.push({ id: `${s.$id}-checkin`, type: 'checkin', student: s, time: new Date(s.checkInTime) });
      }
      if (s.foodCollected && s.foodTime) {
        events.push({ id: `${s.$id}-food`, type: 'food', student: s, time: new Date(s.foodTime) });
      }
    });

    // Sort descending by time
    return events.sort((a, b) => b.time.getTime() - a.time.getTime());
  }, [students]);

  // Filter events
  const filteredEvents = useMemo(() => {
    return allEvents.filter(event => {
      const matchesSearch = 
        event.student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        event.student.studentId.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFilter = filterType === 'all' || event.type === filterType;
      
      return matchesSearch && matchesFilter;
    });
  }, [allEvents, searchQuery, filterType]);

  const formatDate = (date: Date) => {
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const exportLogs = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Time,Student Name,Student ID,Type\n"
      + filteredEvents.map(e => `${formatDate(e.time)},${e.student.name},${e.student.studentId},${e.type}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `farewell_logs_${new Date().toISOString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto w-full space-y-8 animate-fade-in">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-syne text-2xl lg:text-3xl font-bold flex items-center gap-3">
            <div className="p-2 rounded-xl bg-accent-purple/20 text-accent-purple">
              <History className="w-6 h-6 lg:w-8 lg:h-8" />
            </div>
            Activity Logs
          </h1>
          <p className="text-text-muted mt-1">Real-time tracking of every record</p>
        </div>
        <Button 
          onClick={exportLogs}
          className="bg-bg-surface hover:bg-bg-glass text-text-primary border border-border-glass rounded-xl gap-2 h-11"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <aside className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg font-syne flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <Input 
                  placeholder="Search student..." 
                  className="pl-10 bg-bg-surface/50 border-border-glass rounded-xl h-11 focus:ring-accent-purple/50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Event Type</p>
                <div className="flex flex-col gap-2">
                  <button 
                    onClick={() => setFilterType('all')}
                    className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm transition-all ${filterType === 'all' ? 'bg-accent-purple text-white' : 'bg-bg-surface/50 text-text-muted hover:bg-bg-surface hover:text-text-primary'}`}
                  >
                    All Events
                    <Badge variant="outline" className={filterType === 'all' ? 'border-white/50 text-white' : 'border-border-glass'}>{allEvents.length}</Badge>
                  </button>
                  <button 
                    onClick={() => setFilterType('checkin')}
                    className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm transition-all ${filterType === 'checkin' ? 'bg-accent-teal text-white' : 'bg-bg-surface/50 text-text-muted hover:bg-bg-surface hover:text-text-primary'}`}
                  >
                    Check-ins
                    <UserCheck className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setFilterType('food')}
                    className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm transition-all ${filterType === 'food' ? 'bg-accent-amber text-white' : 'bg-bg-surface/50 text-text-muted hover:bg-bg-surface hover:text-text-primary'}`}
                  >
                    Food Collection
                    <Utensils className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card bg-accent-purple/5 border-accent-purple/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-accent-purple/20 text-accent-purple">
                  <History className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-text-muted">Total Records</p>
                  <p className="text-2xl font-bold font-syne">{filteredEvents.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>

        <div className="lg:col-span-3">
          <Card className="glass-card h-full min-h-[600px] flex flex-col">
            <CardHeader className="border-b border-border-glass/50">
              <CardTitle className="text-xl font-syne">Activity Timeline</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-0">
              {loading ? (
                <div className="p-6 space-y-4">
                  {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-20 rounded-xl bg-bg-surface/50" />)}
                </div>
              ) : filteredEvents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center text-text-muted">
                  <div className="w-20 h-20 rounded-full bg-bg-surface flex items-center justify-center mb-4">
                    <History className="w-10 h-10 opacity-20" />
                  </div>
                  <h3 className="text-lg font-medium text-text-primary">No logs found</h3>
                  <p className="max-w-xs mx-auto mt-2">Adjust your filters or search query to find what you're looking for.</p>
                </div>
              ) : (
                <ScrollArea className="h-[calc(100vh-20rem)] lg:h-[700px]">
                  <div className="p-6 space-y-4">
                    {filteredEvents.map((event, idx) => (
                      <div 
                        key={event.id} 
                        className="group flex items-center justify-between p-4 rounded-2xl bg-bg-surface/30 border border-border-glass/50 hover:bg-bg-surface/60 hover:border-accent-purple/30 transition-all duration-300 animate-fade-in-up shadow-sm hover:shadow-lg"
                        style={{ animationDelay: `${idx * 20}ms` }}
                      >
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <Avatar className="h-12 w-12 border-2 border-border-glass transition-transform group-hover:scale-105">
                              <AvatarFallback className="bg-bg-surface text-sm font-bold text-accent-purple">
                                {event.student.name.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-bg-base flex items-center justify-center ${event.type === 'checkin' ? 'bg-accent-teal' : 'bg-accent-amber'}`}>
                              {event.type === 'checkin' ? <UserCheck className="w-2.5 h-2.5 text-white" /> : <Utensils className="w-2.5 h-2.5 text-white" />}
                            </div>
                          </div>
                          <div>
                            <p className="font-bold text-text-primary group-hover:text-accent-purple transition-colors">{event.student.name}</p>
                            <p className="text-xs text-text-muted font-medium">{event.student.studentId} • {event.student.branch}</p>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end gap-2">
                          <div className="flex items-center gap-2">
                            {event.type === 'checkin' ? (
                              <Badge className="bg-accent-teal/10 text-accent-teal border border-accent-teal/20 px-3">Checked In</Badge>
                            ) : (
                              <Badge className="bg-accent-amber/10 text-accent-amber border border-accent-amber/20 px-3">Food Collected</Badge>
                            )}
                          </div>
                          <span className="text-xs text-text-muted font-mono">{formatDate(event.time)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
