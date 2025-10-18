import { useNavigate } from 'react-router-dom';
import { LibraryItem } from '@/data/mockLibraryItems';
import { useLanguage } from '@/contexts/LanguageContext';
import { Book, Image as ImageIcon } from 'lucide-react';

interface LibraryGridProps {
  items: LibraryItem[];
}

export const LibraryGrid = ({ items }: LibraryGridProps) => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const handleItemClick = (id: string) => {
    const path = language === 'mk' ? `/објект/${id}` : `/item/${id}`;
    navigate(path);
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          {language === 'mk' 
            ? 'Не се пронајдени резултати.' 
            : 'No results found.'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {items.map((item) => (
        <div
          key={item.id}
          onClick={() => handleItemClick(item.id)}
          className="card-elevated p-0 overflow-hidden cursor-pointer group"
        >
          <div className="aspect-[3/4] relative overflow-hidden bg-muted">
            <img
              src={item.thumbnail}
              alt={item.title[language]}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full p-2">
              {item.type === 'book' ? (
                <Book className="h-4 w-4 text-primary" />
              ) : (
                <ImageIcon className="h-4 w-4 text-primary" />
              )}
            </div>
          </div>
          <div className="p-4 space-y-2">
            <h3 className="font-bold text-sm line-clamp-2 min-h-[2.5rem]">
              {item.title[language]}
            </h3>
            <p className="text-sm text-muted-foreground">
              {language === 'mk' ? item.author : (item.authorEn || item.author)}
            </p>
            <p className="text-sm text-muted-foreground">{item.year}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
