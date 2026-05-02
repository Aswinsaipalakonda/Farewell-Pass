import { useStats } from '@/hooks/useStats';
import { useStudents } from '@/hooks/useStudents';
import { StatCard } from '@/components/dashboard/StatCard';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { Users, UserCheck, Utensils, Clock, LogOut } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { getGreeting, cn } from '@/lib/utils';

export function Dashboard() {
  const { stats, loading: statsLoading } = useStats();
  const { students, loading: studentsLoading } = useStudents();
  const { logout, role, user } = useAuth();

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto w-full space-y-8 animate-fade-in-up">
      <header className="flex flex-col gap-4">
        <div className="flex items-start justify-between w-full">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-syne text-2xl lg:text-3xl font-bold">
                {getGreeting()}, {user?.name?.replace(' Account', '') || role.toUpperCase()} 👋
              </h1>
              <Badge 
                variant="outline" 
                className={cn(
                  "px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase",
                  role === 'admin' 
                    ? "bg-accent-purple/10 text-accent-purple border-accent-purple/20" 
                    : "bg-bg-surface/50 text-text-muted border-border-glass"
                )}
              >
                {role}
              </Badge>
            </div>
            <p className="text-text-muted mt-1">{today}</p>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden text-text-muted hover:text-accent-red hover:bg-accent-red/10 rounded-xl">
                <LogOut className="w-5 h-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-card border-border-glass">
              <DialogHeader>
                <DialogTitle className="font-syne text-xl">Confirm Logout</DialogTitle>
                <DialogDescription className="text-text-muted">
                  Are you sure you want to log out? You will need to sign in again to access the dashboard.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="flex flex-row gap-3 sm:justify-end mt-4">
                <DialogClose asChild>
                  <Button variant="ghost" className="flex-1 sm:flex-none rounded-xl">Cancel</Button>
                </DialogClose>
                <Button 
                  variant="destructive" 
                  onClick={logout}
                  className="flex-1 sm:flex-none bg-accent-red hover:bg-accent-red/80 rounded-xl"
                >
                  Logout
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
