import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from './ui/button';
import { supabase } from '@/integrations/supabase/client';
import type { LibraryItem } from '@/data/mockLibraryItems';

export const FeaturedCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [featuredItems, setFeaturedItems] = useState<LibraryItem[]>([]);
  const navigate = useNavigate();
  const { language } = useLanguage();

  useEffect(() => {
    const fetchFeaturedItems = async () => {
      const { data, error } = await supabase
        .from('library_items')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(4);

      if (error) {
        console.error('Error fetching featured items:', error);
        return;
      }

      const transformedItems: LibraryItem[] = (data || []).map(item => ({
        id: item.id,
        type: item.type as 'book' | 'image',
        title: { mk: item.title_mk, en: item.title_en },
        author: item.author,
        year: item.year,
        language: item.language,
        keywords: item.keywords || [],
        description: { mk: item.description_mk || '', en: item.description_en || '' },
        thumbnail: item.thumbnail_url,
        pdfUrl: item.pdf_url || undefined,
        imageUrl: item.image_url || undefined,
        category: item.category
      }));

      setFeaturedItems(transformedItems);
    };

    fetchFeaturedItems();
  }, []);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredItems.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused, featuredItems.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? featuredItems.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredItems.length);
  };

  const handleItemClick = (id: string) => {
    const path = language === 'mk' ? `/објект/${id}` : `/item/${id}`;
    navigate(path);
  };

  if (featuredItems.length === 0) {
    return null;
  }

  return (
    <div 
      className="relative w-full max-w-5xl mx-auto"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="overflow-hidden rounded-lg shadow-elegant">
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {featuredItems.map((item) => (
            <div
              key={item.id}
              className="min-w-full cursor-pointer"
              onClick={() => handleItemClick(item.id)}
            >
              <div className="relative aspect-[16/9] bg-muted">
                <img
                  src={item.thumbnail}
                  alt={item.title[language]}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                  <h3 className="text-white text-2xl font-bold mb-2">
                    {item.title[language]}
                  </h3>
                  <p className="text-white/90 text-sm">
                    {item.author} • {item.year}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-black rounded-full shadow-lg"
        onClick={goToPrevious}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-black rounded-full shadow-lg"
        onClick={goToNext}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Indicators */}
      <div className="flex justify-center gap-2 mt-4">
        {featuredItems.map((_, index) => (
          <button
            key={index}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'w-8 bg-primary' 
                : 'w-2 bg-muted-foreground/30'
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};
