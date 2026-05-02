import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ScanLine, Users, QrCode, History } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

export function BottomNav() {
  const { pathname } = useLocation();
  const { role } = useAuth();

  const links = [
    { to: '/dashboard', icon: LayoutDashboard },
    { to: '/students', icon: Users },
    { to: '/scan', icon: ScanLine, isPrimary: true },
    { to: '/generate', icon: QrCode, adminOnly: true },
    { to: '/logs', icon: History },
  ];

  const filteredLinks = links.filter(link => !link.adminOnly || role === 'admin');

  return (
    <div className="fixed bottom-0 left-0 w-full lg:hidden bg-bg-surface/90 backdrop-blur-2xl border-t border-border-glass z-50 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
      <div 
        className="grid items-center h-16 relative"
        style={{ gridTemplateColumns: `repeat(${filteredLinks.length}, minmax(0, 1fr))` }}
      >
        {filteredLinks.map((link, index) => {
          if (link.isPrimary) {
            const isActive = pathname === link.to;
            return (
              <div key="scan" className="flex justify-center items-center h-full w-full">
                <Link
                  to={link.to!}
                  className="absolute -top-6 flex flex-col items-center justify-center"
                >
                  <div className={cn(
                    "w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform duration-200",
                    isActive 
                      ? "bg-accent-purple shadow-[0_0_20px_rgba(124,58,237,0.6)] text-white scale-110" 
                      : "bg-bg-base border-2 border-accent-purple text-accent-violet hover:bg-accent-purple/20"
                  )}>
                    <link.icon className="w-7 h-7" />
                  </div>
                </Link>
              </div>
            );
          }

          const isActive = pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to!}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full transition-all duration-200 relative active:scale-95",
                isActive 
                  ? "text-accent-purple -translate-y-1" 
                  : "text-text-muted hover:text-white"
              )}
            >
              <link.icon className="w-5 h-5" />
              {isActive && <span className="w-1 h-1 bg-accent-purple rounded-full absolute bottom-2" />}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
