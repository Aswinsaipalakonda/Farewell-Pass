import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Loader2, ArrowRight } from 'lucide-react';

export function Login() {
  const { user, login } = useAuth();
  const [email, setEmail] = useState('admin@farewellpass.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await login(email, password);
    } catch (err: any) {
      let message = err.message || 'Failed to sign in';
      if (message === 'Failed to fetch' || message.includes('fetch')) {
        message = 'Connection Failed: Please check your Internet or Appwrite CORS settings.';
      }
      setError(message);
      setLoading(false);
    }

  };

  return (
    <div className="min-h-screen bg-bg-base flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[600px] max-h-[600px] bg-accent-purple/20 rounded-full blur-[100px] animate-pulse-glow pointer-events-none"></div>

      <Card className="w-full max-w-[400px] glass-card shadow-2xl relative z-10 animate-fade-in-up">
        <CardHeader className="text-center pt-8 pb-6">
          <div className="mx-auto w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center mb-4 shadow-lg shadow-purple-500/30">
            <span className="text-white text-2xl font-bold">✦</span>
          </div>
          <h1 className="font-syne text-3xl font-bold gradient-text">FarewellPass</h1>
          <p className="text-text-muted text-sm mt-2">MVGR College of Engineering · 2026</p>
        </CardHeader>
        
        <Separator className="bg-border-glass mb-6" />

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-text-primary">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-bg-surface/50 border-border-glass text-text-primary focus:border-accent-purple h-12"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-text-primary">Password</Label>
              <Input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-bg-surface/50 border-border-glass text-text-primary focus:border-accent-purple h-12"
                required
              />
            </div>

            {error && (
              <Alert variant="destructive" className="bg-accent-red/10 border-accent-red/20 text-accent-red">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-700 hover:to-purple-800 text-white h-12 text-base font-medium shadow-lg shadow-purple-500/20"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
