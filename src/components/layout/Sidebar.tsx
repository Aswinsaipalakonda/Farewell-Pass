import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ScanLine, Users, QrCode, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const { pathname } = useLocation();
  const { logout } = useAuth();

  const links = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/scan', icon: ScanLine, label: 'Scan QR' },
    { to: '/students', icon: Users, label: 'Students' },
    { to: '/generate', icon: QrCode, label: 'Generate QR' },
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
        <Button 
          variant="ghost" 
          className="w-full justify-start text-text-muted hover:text-accent-red hover:bg-accent-red/10"
          onClick={logout}
        >
          <LogOut className="w-5 h-5 mr-3" />
          Log Out
        </Button>
      </div>
    </aside>
  );
}
