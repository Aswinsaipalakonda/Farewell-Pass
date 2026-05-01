import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AppShell } from '@/components/layout/AppShell';
import { AuthGuard } from '@/guards/AuthGuard';
import { Login } from '@/pages/Login';
import { Dashboard } from '@/pages/Dashboard';
import { Scan } from '@/pages/Scan';
import { Students } from '@/pages/Students';
import { GenerateQR } from '@/pages/GenerateQR';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" theme="dark" />
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route element={<AuthGuard />}>
          <Route element={<AppShell />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/scan" element={<Scan />} />
            <Route path="/students" element={<Students />} />
            <Route path="/generate" element={<GenerateQR />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Route>
        
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
