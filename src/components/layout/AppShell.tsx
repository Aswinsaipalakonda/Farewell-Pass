import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';

export function AppShell() {
  return (
    <div className="min-h-screen bg-bg-base text-text-primary overflow-x-hidden">
      <Sidebar />
      <main className="lg:pl-64 pb-16 lg:pb-0 min-h-screen flex flex-col">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
