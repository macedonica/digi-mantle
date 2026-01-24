import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { Lock } from 'lucide-react';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 60000; // 1 minute

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);
  const { signIn, user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { toast } = useToast();

  // Redirect if already logged in as admin
  useEffect(() => {
    if (user && isAdmin) {
      navigate('/admin-dashboard');
    }
  }, [user, isAdmin, navigate]);

  // Check lockout timer
  useEffect(() => {
    if (!lockoutUntil) return;
    
    const interval = setInterval(() => {
      if (Date.now() >= lockoutUntil) {
        setLockoutUntil(null);
        setAttempts(0);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [lockoutUntil]);

  const getRemainingLockoutSeconds = () => {
    if (!lockoutUntil) return 0;
    return Math.max(0, Math.ceil((lockoutUntil - Date.now()) / 1000));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if locked out
    if (lockoutUntil && Date.now() < lockoutUntil) {
      const secondsLeft = getRemainingLockoutSeconds();
      toast({
        title: t('Премногу обиди', 'Too many attempts'),
        description: t(
          `Обидете се повторно за ${secondsLeft} секунди.`,
          `Try again in ${secondsLeft} seconds.`
        ),
        variant: 'destructive'
      });
      return;
    }
    
    setLoading(true);

    // Validate input
    const validation = loginSchema.safeParse({ email, password });
    if (!validation.success) {
      toast({
        title: t('Грешка при Валидација', 'Validation Error'),
        description: validation.error.errors[0].message,
        variant: 'destructive'
      });
      setLoading(false);
      return;
    }

    // Attempt login
    const { error } = await signIn(email, password);

    if (error) {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      
      // Check if we should lock out
      if (newAttempts >= MAX_ATTEMPTS) {
        setLockoutUntil(Date.now() + LOCKOUT_DURATION_MS);
        toast({
          title: t('Заклучено', 'Account Locked'),
          description: t(
            'Премногу неуспешни обиди. Обидете се повторно за 1 минута.',
            'Too many failed attempts. Try again in 1 minute.'
          ),
          variant: 'destructive'
        });
      } else {
        const remainingAttempts = MAX_ATTEMPTS - newAttempts;
        toast({
          title: t('Неуспешна Најава', 'Login Failed'),
          description: t(
            `Погрешни податоци. Преостанати обиди: ${remainingAttempts}`,
            `Invalid credentials. Remaining attempts: ${remainingAttempts}`
          ),
          variant: 'destructive'
        });
      }
      setLoading(false);
      return;
    }

    // Success - reset attempts and auth context will handle redirect
    setAttempts(0);
    toast({
      title: t('Добредојдовте назад!', 'Welcome back!'),
      description: t('Пренасочување...', 'Redirecting to admin dashboard...')
    });
  };

  const isLockedOut = lockoutUntil && Date.now() < lockoutUntil;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center py-16">
        <div className="w-full max-w-md px-4">
          <div className="card-elevated p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Lock className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-2xl font-bold">
                {t('Најава за Администратори', 'Administrator Login')}
              </h1>
              <p className="text-muted-foreground">
                {t(
                  'Најавете се за да управувате со содржината на архивот',
                  'Sign in to manage the archive content'
                )}
              </p>
            </div>

            {isLockedOut && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-center">
                <p className="text-destructive font-medium">
                  {t(
                    `Заклучено. Обидете се повторно за ${getRemainingLockoutSeconds()} секунди.`,
                    `Locked. Try again in ${getRemainingLockoutSeconds()} seconds.`
                  )}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">
                  {t('Е-пошта', 'Email')}
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('admin@example.com', 'admin@example.com')}
                  required
                  disabled={loading || isLockedOut}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">
                  {t('Лозинка', 'Password')}
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={loading || isLockedOut}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                variant="hero"
                size="lg"
                disabled={loading || isLockedOut}
              >
                {loading ? t('Најавување...', 'Logging in...') : t('Најава', 'Sign In')}
              </Button>
            </form>

            <div className="text-center text-sm text-muted-foreground">
              {t(
                'Оваа страница е достапна само за администратори на архивот.',
                'This page is accessible only to archive administrators.'
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminLogin;
