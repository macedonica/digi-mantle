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

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      toast({
        title: t('Неуспешна Најава', 'Login Failed'),
        description: error.message || t('Погрешни податоци', 'Invalid credentials'),
        variant: 'destructive'
      });
      setLoading(false);
      return;
    }

    // Success - auth context will handle redirect
    toast({
      title: t('Добредојдовте назад!', 'Welcome back!'),
      description: t('Пренасочување...', 'Redirecting to admin dashboard...')
    });
  };

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
                  disabled={loading}
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
                  disabled={loading}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                variant="hero"
                size="lg"
                disabled={loading}
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
