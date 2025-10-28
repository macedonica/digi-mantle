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
  activeType: 'book' | 'image';
}

export const LibraryFilters = ({ filters, onFilterChange, activeType }: LibraryFiltersProps) => {
  const { t, language } = useLanguage();

  const updateFilter = (key: keyof FilterState, value: string) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const availableLanguages = [
    { value: 'Macedonian', mk: 'Македонски', en: 'Macedonian' },
    { value: 'English', mk: 'Англиски', en: 'English' },
    { value: 'German', mk: 'Германски', en: 'German' },
    { value: 'French', mk: 'Француски', en: 'French' },
    { value: 'Russian', mk: 'Руски', en: 'Russian' },
    { value: 'Serbian', mk: 'Српски', en: 'Serbian' },
    { value: 'Bulgarian', mk: 'Бугарски', en: 'Bulgarian' },
    { value: 'Greek', mk: 'Грчки', en: 'Greek' },
    { value: 'Turkish', mk: 'Турски', en: 'Turkish' },
    { value: 'Albanian', mk: 'Албански', en: 'Albanian' },
    { value: 'Church Slavonic', mk: 'Црковнословенски', en: 'Church Slavonic' },
    { value: 'Old Church Slavonic', mk: 'Старословенски', en: 'Old Church Slavonic' },
    { value: 'Glagolitic Script', mk: 'Глаголица', en: 'Glagolitic Script' },
  ];

  const bookCategories = [
    { value: 'history', mk: 'Историја', en: 'History' },
    { value: 'archaeology', mk: 'Археологија', en: 'Archaeology' },
    { value: 'literature', mk: 'Книжевност', en: 'Literature' },
    { value: 'ethnology', mk: 'Етнологија', en: 'Ethnology' },
    { value: 'folklore', mk: 'Фолклор', en: 'Folklore' },
  ];

  const testimonialCategories = [
    { value: 'newspaper', mk: 'Весник', en: 'Newspaper' },
    { value: 'document', mk: 'Документ', en: 'Document' },
    { value: 'map', mk: 'Карта', en: 'Map' },
    { value: 'artefact', mk: 'Артефакт', en: 'Artefact' },
    { value: 'manuscript', mk: 'Ракопис', en: 'Manuscript' },
    { value: 'book', mk: 'Книга', en: 'Book' },
    { value: 'photo', mk: 'Слика', en: 'Photo' },
  ];

  const availableCategories = activeType === 'book' ? bookCategories : testimonialCategories;

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
              {availableLanguages.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {language === 'mk' ? lang.mk : lang.en}
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

        {/* Categories */}
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
