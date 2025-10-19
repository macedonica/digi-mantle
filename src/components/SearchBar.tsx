import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export const SearchBar = ({ onSearch }: SearchBarProps) => {
  const { t } = useLanguage();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <Input
          type="text"
          onChange={handleChange}
          placeholder={t('Пребарајте книги, автори, клучни зборови...', 'Search books, authors, keywords...')}
          className="w-full pl-12 pr-4 py-6 text-lg rounded-lg border-2 border-border focus:border-primary transition-colors"
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
      </div>
    </div>
  );
};
