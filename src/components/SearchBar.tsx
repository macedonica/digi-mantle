import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('Пребарајте книги, автори, клучни зборови...', 'Search books, authors, keywords...')}
          className="w-full pl-12 pr-4 py-6 text-lg rounded-lg border-2 border-border focus:border-primary transition-colors"
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Button 
          type="submit" 
          className="absolute right-2 top-1/2 -translate-y-1/2"
          size="sm"
        >
          {t('Пребарај', 'Search')}
        </Button>
      </div>
    </form>
  );
};
