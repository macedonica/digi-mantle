import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import type { LibraryItem } from '@/data/mockLibraryItems';

export const FeaturedCarousel = () => {
  const [featuredItems, setFeaturedItems] = useState<LibraryItem[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef(0);
  const navigate = useNavigate();
  const { language } = useLanguage();

  useEffect(() => {
    const fetchFeaturedItems = async () => {
      // Use the public view that excludes uploaded_by field for security
      const { data, error } = await supabase
        .from('public_library_items')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching featured items:', error);
        return;
      }

      const transformedItems: LibraryItem[] = (data || []).map(item => ({
        id: item.id,
        type: item.type as 'book' | 'image',
        title: { mk: item.title_mk, en: item.title_en },
        author: item.author,
        authorEn: item.author_en,
        year: item.year,
        yearMk: item.year_mk,
        yearEn: item.year_en,
        language: item.language || [],
        keywords: item.keywords || [],
        description: { mk: item.description_mk || '', en: item.description_en || '' },
        thumbnail: item.thumbnail_url,
        pdfUrl: item.pdf_url || undefined,
        imageUrl: item.image_url || undefined,
        category: item.category,
        publicationCity: item.publication_city,
        publicationCityEn: item.publication_city_en,
        publisher: item.publisher,
        publisherEn: item.publisher_en,
        additionalImages: item.additional_images || [],
        issueNumberMk: item.issue_number_mk,
        issueNumberEn: item.issue_number_en,
        watermarkUrl: (item as any).watermark_url
      }));

      setFeaturedItems(transformedItems);
    };

    fetchFeaturedItems();

    // Set up realtime subscription for updates
    const channel = supabase
      .channel('library-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'library_items'
        },
        () => {
          fetchFeaturedItems();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    if (!scrollRef.current || isPaused || featuredItems.length === 0) return;

    const scrollContainer = scrollRef.current;
    positionRef.current = scrollContainer.scrollLeft;
    let animationFrameId: number;
    
    const tick = () => {
      // Increment by a small fixed amount each frame (slower than original)
      positionRef.current += 0.3;

      // Loop when passing half-width (since we duplicate items)
      const max = scrollContainer.scrollWidth / 2;
      if (positionRef.current >= max) {
        positionRef.current = 0;
      }

      scrollContainer.scrollLeft = positionRef.current;
      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isPaused, featuredItems.length]);

  const handleItemClick = (id: string) => {
    navigate(`/item/${id}`);
  };

  if (featuredItems.length === 0) {
    return null;
  }

  // Duplicate items for infinite scroll effect
  const duplicatedItems = [...featuredItems, ...featuredItems];

  return (
    <div 
      className="relative w-full overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div 
        ref={scrollRef}
        className="flex gap-6 overflow-x-hidden"
        style={{ scrollBehavior: 'auto' }}
      >
        {duplicatedItems.map((item, index) => (
          <div
            key={`${item.id}-${index}`}
            className="flex-shrink-0 cursor-pointer group"
            style={{ width: '200px' }}
            onClick={() => handleItemClick(item.id)}
          >
            <div className="aspect-[3/4] rounded-lg overflow-hidden shadow-elegant bg-muted">
              <img
                src={item.thumbnail}
                alt={item.title[language]}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="mt-3 space-y-1">
              <h3 className="text-sm font-bold line-clamp-2 min-h-[2.5rem]">
                {item.title[language]}
              </h3>
              <p className="text-xs text-muted-foreground">
                {language === 'mk' ? item.author : (item.authorEn || item.author)}
              </p>
              {item.type === 'periodical' && (language === 'mk' ? item.issueNumberMk : item.issueNumberEn) && (
                <p className="text-xs text-muted-foreground">
                  {language === 'mk' ? 'Број на весник: ' : 'Newspaper number: '}
                  {language === 'mk' ? item.issueNumberMk : item.issueNumberEn}
                </p>
              )}
              {(language === 'mk' ? item.yearMk : item.yearEn) && (
                <p className="text-xs text-muted-foreground">
                  {language === 'mk' ? 'Година: ' : 'Year: '}
                  {language === 'mk' ? item.yearMk : item.yearEn}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
