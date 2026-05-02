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
  const { logout, role } = useAuth();
  const { pathname } = useLocation();

  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, to: '/dashboard' },
    { label: 'Scan QR', icon: ScanLine, to: '/scan' },
    { label: 'Students', icon: Users, to: '/students' },
    { label: 'Generate QR', icon: QrCode, to: '/generate', adminOnly: true },
    { label: 'Activity Logs', icon: History, to: '/logs' },
  ];

  const filteredItems = menuItems.filter(item => !item.adminOnly || role === 'admin');

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 border-r border-border-glass bg-bg-surface z-40">
      <div className="p-6">
        <h1 className="font-syne text-2xl font-bold gradient-text flex items-center gap-2">
          <span className="text-accent-violet">✦</span> FarewellPass
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {filteredItems.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group",
              pathname === link.to
                ? "bg-accent-purple/10 text-accent-purple shadow-[0_0_15px_rgba(147,51,234,0.1)]"
                : "text-text-muted hover:text-text-primary hover:bg-bg-glass"
            )}
          >
            <link.icon className={cn(
              "w-5 h-5 transition-transform duration-300 group-hover:scale-110",
              pathname === link.to ? "text-accent-purple" : "text-text-muted group-hover:text-text-primary"
            )} />
            <span className="font-medium font-syne">{link.label}</span>
          </Link>
        ))}
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
