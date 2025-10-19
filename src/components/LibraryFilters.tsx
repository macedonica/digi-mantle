import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useLanguage } from '@/contexts/LanguageContext';

interface FilterState {
  yearFrom: string;
  yearTo: string;
  language: string;
  author: string;
  categories: string[];
}

interface LibraryFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

export const LibraryFilters = ({ filters, onFilterChange }: LibraryFiltersProps) => {
  const { t, language } = useLanguage();

  const updateFilter = (key: keyof FilterState, value: string) => {
    onFilterChange({ ...filters, [key]: value });
  };

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
              <SelectItem value="macedonian">{t('Македонски', 'Macedonian')}</SelectItem>
              <SelectItem value="english">{t('Англиски', 'English')}</SelectItem>
              <SelectItem value="other">{t('Други', 'Other')}</SelectItem>
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

        {/* Categories */}
        <div className="space-y-2">
          <Label>{t('Категории', 'Categories')}</Label>
          <div className="grid grid-cols-1 gap-2">
            {[
              { value: 'history', mk: 'Историја', en: 'History' },
              { value: 'archaeology', mk: 'Археологија', en: 'Archaeology' },
              { value: 'literature', mk: 'Книжевност', en: 'Literature' },
              { value: 'ethnology', mk: 'Етнологија', en: 'Ethnology' },
              { value: 'folklore', mk: 'Фолклор', en: 'Folklore' },
            ].map((cat) => (
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
                  {language === 'mk' ? cat.mk : cat.en}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
