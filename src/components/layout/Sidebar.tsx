import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ScanLine, Users, QrCode, LogOut, History } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
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

export function Sidebar() {
  const { pathname } = useLocation();
  const { logout } = useAuth();

  const links = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/scan', icon: ScanLine, label: 'Scan QR' },
    { to: '/students', icon: Users, label: 'Students' },
    { to: '/generate', icon: QrCode, label: 'Generate QR' },
    { to: '/logs', icon: History, label: 'Activity Logs' },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 border-r border-border-glass bg-bg-surface z-40">
      <div className="p-6">
        <h1 className="font-syne text-2xl font-bold gradient-text flex items-center gap-2">
          <span className="text-accent-violet">✦</span> FarewellPass
        </h1>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {links.map((link) => {
          const isActive = pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium",
                isActive 
                  ? "bg-accent-purple text-white shadow-[0_0_20px_rgba(124,58,237,0.3)]" 
                  : "text-text-muted hover:text-text-primary hover:bg-bg-glass"
              )}
            >
              <link.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-text-muted")} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border-glass">
        <Dialog>
          <DialogTrigger asChild>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-text-muted hover:text-accent-red hover:bg-accent-red/10 rounded-xl"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Log Out
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
    </aside>
  );
}
