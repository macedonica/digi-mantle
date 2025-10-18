import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Globe, LogOut, LayoutDashboard } from 'lucide-react';

export const Header = () => {
  const { language, toggleLanguage, t } = useLanguage();
  const { user, isAdmin, signOut } = useAuth();

  return (
    <header className="border-b border-border bg-background sticky top-0 z-50 backdrop-blur-sm bg-background/95">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-primary">
              {t('Дигитален Архив', 'Digital Archive')}
            </h1>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              to="/" 
              className="text-foreground hover:text-primary transition-colors"
            >
              {t('Почетна', 'Home')}
            </Link>
            <Link 
              to={language === 'mk' ? '/за-нас' : '/about'}
              className="text-foreground hover:text-primary transition-colors"
            >
              {t('За нас', 'About')}
            </Link>
            <Link 
              to={language === 'mk' ? '/библиотека' : '/library'}
              className="text-foreground hover:text-primary transition-colors"
            >
              {t('Библиотека', 'Library')}
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            {user && isAdmin && (
              <>
                <Badge variant="secondary" className="hidden sm:inline-flex">
                  {t('Админ', 'Admin')}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.href = '/admin-dashboard'}
                  className="hidden md:inline-flex"
                >
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  {t('Контролна Табла', 'Dashboard')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => signOut()}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">{t('Одјави се', 'Logout')}</span>
                </Button>
              </>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleLanguage}
              className="flex items-center gap-2"
            >
              <Globe className="h-4 w-4" />
              <span className="font-medium">{language === 'mk' ? 'EN' : 'МК'}</span>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden flex items-center gap-4 mt-4 border-t border-border pt-4">
          <Link 
            to="/" 
            className="text-sm text-foreground hover:text-primary transition-colors"
          >
            {t('Почетна', 'Home')}
          </Link>
          <Link 
            to={language === 'mk' ? '/за-нас' : '/about'}
            className="text-sm text-foreground hover:text-primary transition-colors"
          >
            {t('За нас', 'About')}
          </Link>
          <Link 
            to={language === 'mk' ? '/библиотека' : '/library'}
            className="text-sm text-foreground hover:text-primary transition-colors"
          >
            {t('Библиотека', 'Library')}
          </Link>
        </nav>
      </div>
    </header>
  );
};
