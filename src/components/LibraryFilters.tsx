import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLibraryLanguages, useLibraryCategories, useLibraryNewspapers } from '@/hooks/useLibraryOptions';
import { Loader2 } from 'lucide-react';

interface FilterState {
  yearFrom: string;
  yearTo: string;
  language: string;
  author: string;
  categories: string[];
  newspaper: string;
}

interface LibraryFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  activeType: 'book' | 'image' | 'periodical';
}

export const LibraryFilters = ({ filters, onFilterChange, activeType }: LibraryFiltersProps) => {
  const { t, language } = useLanguage();

  const { data: languages = [], isLoading: languagesLoading } = useLibraryLanguages();
  const { data: bookCategories = [], isLoading: bookCategoriesLoading } = useLibraryCategories('book');
  const { data: imageCategories = [], isLoading: imageCategoriesLoading } = useLibraryCategories('image');
  const { data: periodicalCategories = [], isLoading: periodicalCategoriesLoading } = useLibraryCategories('periodical');
  const { data: newspapers = [], isLoading: newspapersLoading } = useLibraryNewspapers();

  const updateFilter = (key: keyof FilterState, value: string) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const availableCategories = activeType === 'book' ? bookCategories : activeType === 'periodical' ? periodicalCategories : imageCategories;

  if (languagesLoading || bookCategoriesLoading || imageCategoriesLoading || periodicalCategoriesLoading || newspapersLoading) {
    return <div className="flex justify-center p-4"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-6">
      <h3 className="text-lg font-semibold">{t('Филтри', 'Filters')}</h3>

      <div className="space-y-4">
        {/* Year Range */}
        <div className="space-y-2">
          <Label>{t('Година', 'Year')}</Label>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder={t('Од', 'From')}
              value={filters.yearFrom}
              onChange={(e) => updateFilter('yearFrom', e.target.value)}
              className="flex-1"
            />
            <Input
              type="number"
              placeholder={t('До', 'To')}
              value={filters.yearTo}
              onChange={(e) => updateFilter('yearTo', e.target.value)}
              className="flex-1"
            />
          </div>
        </div>

        {/* Language */}
        <div className="space-y-2">
          <Label>{t('Јазик', 'Language')}</Label>
          <Select value={filters.language} onValueChange={(value) => updateFilter('language', value)}>
            <SelectTrigger>
              <SelectValue placeholder={t('Сите јазици', 'All languages')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('Сите јазици', 'All languages')}</SelectItem>
              {languages.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {language === 'mk' ? lang.name_mk : lang.name_en}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Author */}
        <div className="space-y-2">
          <Label>{t('Автор', 'Author')}</Label>
          <Input
            type="text"
            placeholder={t('Име на автор', 'Author name')}
            value={filters.author}
            onChange={(e) => updateFilter('author', e.target.value)}
          />
        </div>

        {/* Categories or Newspaper based on activeType */}
        {activeType === 'periodical' ? (
          <div className="space-y-2">
            <Label>{t('Весник', 'Newspaper')}</Label>
            <Select value={filters.newspaper} onValueChange={(value) => updateFilter('newspaper', value)}>
              <SelectTrigger>
                <SelectValue placeholder={t('Сите весници', 'All newspapers')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('Сите весници', 'All newspapers')}</SelectItem>
                {newspapers.map((newspaper) => (
                  <SelectItem key={newspaper.value} value={newspaper.value}>
                    {language === 'mk' ? newspaper.name_mk : newspaper.name_en}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : (
          <div className="space-y-2">
            <Label>{t('Категории', 'Categories')}</Label>
            <div className="grid grid-cols-1 gap-2">
              {availableCategories.map((cat) => (
                <div key={cat.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`filter-cat-${cat.value}`}
                    checked={filters.categories.includes(cat.value)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        onFilterChange({ ...filters, categories: [...filters.categories, cat.value] });
                      } else {
                        onFilterChange({ ...filters, categories: filters.categories.filter(c => c !== cat.value) });
                      }
                    }}
                  />
                  <label 
                    htmlFor={`filter-cat-${cat.value}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {language === 'mk' ? cat.name_mk : cat.name_en}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
