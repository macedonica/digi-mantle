import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';

export const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-border bg-background mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2025 {t('Дигитален Архив. Сите права задржани.', 'Digital Archive. All rights reserved.')}
          </p>
          <div className="flex gap-4">
            <Link 
              to="/terms" 
              className="text-sm text-primary hover:underline"
            >
              {t('Услови за користење', 'Terms of Use')}
            </Link>
            <a 
              href="mailto:b.macedonica@gmail.com" 
              className="text-sm text-primary hover:underline"
            >
              {t('Контакт', 'Contact')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
