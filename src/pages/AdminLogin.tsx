import { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import { Lock } from 'lucide-react';

const AdminLogin = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // This is a placeholder - actual authentication would be implemented with backend
    toast.info(
      t(
        'Функцијата за најава не е целосно имплементирана. Ова е само приказ.',
        'Login functionality is not fully implemented. This is a demonstration only.'
      )
    );
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
                />
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                variant="hero"
                size="lg"
              >
                {t('Најава', 'Sign In')}
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
