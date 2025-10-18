import { useLanguage } from '@/contexts/LanguageContext';

export const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-border bg-background mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2025 {t('Дигитален Архив. Сите права задржани.', 'Digital Archive. All rights reserved.')}
          </p>
          <a 
            href="mailto:contact@digitalarchive.mk" 
            className="text-sm text-primary hover:underline"
          >
            {t('Контакт', 'Contact')}
          </a>
        </div>
      </div>
    </footer>
  );
};
