import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Globe, LogOut, LayoutDashboard } from 'lucide-react';
import logo from '@/assets/logo.png';
import { useEffect, useRef } from 'react';

export const Header = () => {
  const { language, toggleLanguage, t } = useLanguage();
  const { user, isAdmin, signOut } = useAuth();
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const updateHeaderHeight = () => {
      if (headerRef.current) {
        const height = headerRef.current.offsetHeight;
        document.documentElement.style.setProperty('--header-height', `${height}px`);
      }
    };

    updateHeaderHeight();
    const observer = new ResizeObserver(updateHeaderHeight);
    if (headerRef.current) {
      observer.observe(headerRef.current);
    }

    return () => observer.disconnect();
  }, [user, isAdmin, language]);

  return (
    <header ref={headerRef} className="border-b border-border bg-background sticky top-0 z-50 backdrop-blur-sm bg-background/95">
      <div className="container mx-auto px-4 py-3 lg:py-4">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img src={logo} alt="Bibliotheca Macedonica" className="h-12 lg:h-16 w-auto" />
          </Link>
          
          <nav className="hidden md:flex items-center gap-4 lg:gap-6">
            <Link 
              to="/" 
              className="text-sm lg:text-base text-foreground hover:text-primary transition-colors"
            >
              {t('Почетна', 'Home')}
            </Link>
            <Link 
              to="/about"
              className="text-sm lg:text-base text-foreground hover:text-primary transition-colors"
            >
              {t('За нас', 'About')}
            </Link>
            <Link 
              to="/library"
              className="text-sm lg:text-base text-foreground hover:text-primary transition-colors"
            >
              {t('Библиотека', 'Library')}
            </Link>
          </nav>

          <div className="flex items-center gap-1.5 lg:gap-2">
            {user && isAdmin && (
              <>
                <Badge variant="secondary" className="hidden lg:inline-flex text-xs">
                  {t('Админ', 'Admin')}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.href = '/admin-dashboard'}
                  className="hidden lg:inline-flex"
                >
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  {t('Контролна Табла', 'Dashboard')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.href = '/admin-dashboard'}
                  className="lg:hidden"
                  title={t('Контролна Табла', 'Dashboard')}
                >
                  <LayoutDashboard className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => signOut()}
                  className="hidden sm:inline-flex"
                >
                  <LogOut className="h-4 w-4 lg:mr-2" />
                  <span className="hidden lg:inline">{t('Одјави се', 'Logout')}</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => signOut()}
                  className="sm:hidden"
                  title={t('Одјави се', 'Logout')}
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleLanguage}
              className="flex items-center gap-1.5"
            >
              <Globe className="h-4 w-4" />
              <span className="text-sm font-medium">{language === 'mk' ? 'EN' : 'МК'}</span>
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
            to="/about"
            className="text-sm text-foreground hover:text-primary transition-colors"
          >
            {t('За нас', 'About')}
          </Link>
          <Link 
            to="/library"
            className="text-sm text-foreground hover:text-primary transition-colors"
          >
            {t('Библиотека', 'Library')}
          </Link>
        </nav>
      </div>
    </header>
  );
};
