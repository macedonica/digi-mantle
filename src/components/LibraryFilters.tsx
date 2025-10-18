import { useLanguage } from '@/contexts/LanguageContext';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FilterState {
  yearFrom: string;
  yearTo: string;
  language: string;
  author: string;
  itemType: string;
  category: string;
}

interface LibraryFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

export const LibraryFilters = ({ filters, onFilterChange }: LibraryFiltersProps) => {
  const { t } = useLanguage();

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

        {/* Item Type */}
        <div className="space-y-2">
          <Label>{t('Тип', 'Type')}</Label>
          <Select value={filters.itemType} onValueChange={(value) => updateFilter('itemType', value)}>
            <SelectTrigger>
              <SelectValue placeholder={t('Сите типови', 'All types')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('Сите типови', 'All types')}</SelectItem>
              <SelectItem value="book">{t('Книга', 'Book')}</SelectItem>
              <SelectItem value="image">{t('Слика', 'Image')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label>{t('Категорија', 'Category')}</Label>
          <Select value={filters.category} onValueChange={(value) => updateFilter('category', value)}>
            <SelectTrigger>
              <SelectValue placeholder={t('Сите категории', 'All categories')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('Сите категории', 'All categories')}</SelectItem>
              <SelectItem value="history">{t('Историја', 'History')}</SelectItem>
              <SelectItem value="culture">{t('Култура', 'Culture')}</SelectItem>
              <SelectItem value="poetry">{t('Поезија', 'Poetry')}</SelectItem>
              <SelectItem value="personalities">{t('Личности', 'Personalities')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
