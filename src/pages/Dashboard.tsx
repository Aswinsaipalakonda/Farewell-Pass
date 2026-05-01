import { useStats } from '@/hooks/useStats';
import { useStudents } from '@/hooks/useStudents';
import { StatCard } from '@/components/dashboard/StatCard';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { Users, UserCheck, Utensils, Clock } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export function Dashboard() {
  const { stats, loading: statsLoading } = useStats();
  const { students, loading: studentsLoading } = useStudents();

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto w-full space-y-8 animate-fade-in-up">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-syne text-2xl lg:text-3xl font-bold">Good morning, CR 👋</h1>
          <p className="text-text-muted mt-1">{today}</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-teal/10 border border-accent-teal/20 w-fit">
          <span className="w-2 h-2 rounded-full bg-accent-teal animate-pulse"></span>
          <span className="text-sm font-medium text-accent-teal">Event Live</span>
        </div>
      </header>

      {statsLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-xl bg-bg-surface/50" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <StatCard 
            title="Total Registered" 
            value={stats.totalRegistered} 
            icon={Users}
            colorClass="text-accent-purple"
            bgClass="bg-accent-purple/20"
          />
          <StatCard 
            title="Checked In" 
            value={stats.checkedIn} 
            total={stats.totalRegistered}
            icon={UserCheck}
            colorClass="text-accent-teal"
            bgClass="bg-accent-teal/20"
          />
          <StatCard 
            title="Food Collected" 
            value={stats.foodCollected} 
            total={stats.checkedIn}
            icon={Utensils}
            colorClass="text-accent-amber"
            bgClass="bg-accent-amber/20"
          />
          <StatCard 
            title="Pending" 
            value={stats.pending} 
            total={stats.totalRegistered}
            icon={Clock}
            colorClass="text-text-muted"
            bgClass="bg-text-muted/20"
          />
        </div>
      )}

      {studentsLoading ? (
        <Skeleton className="h-[400px] rounded-xl bg-bg-surface/50 mt-6" />
      ) : (
        <RecentActivity students={students} />
      )}
    </div>
  );
}
