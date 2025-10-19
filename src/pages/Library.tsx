import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SearchBar } from '@/components/SearchBar';
import { LibraryFilters } from '@/components/LibraryFilters';
import { LibraryGrid } from '@/components/LibraryGrid';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import type { LibraryItem } from '@/data/mockLibraryItems';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from '@/components/ui/drawer';
import { SlidersHorizontal } from 'lucide-react';

interface FilterState {
  yearFrom: string;
  yearTo: string;
  language: string;
  author: string;
  itemType: string;
  categories: string[];
}

const Library = () => {
  const location = useLocation();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    yearFrom: '',
    yearTo: '',
    language: 'all',
    author: '',
    itemType: 'all',
    categories: []
  });

  // Fetch library items from Supabase
  useEffect(() => {
    const fetchItems = async () => {
      // Use the public view that excludes uploaded_by field for security
      const { data, error } = await supabase
        .from('public_library_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching library items:', error);
        setLoading(false);
        return;
      }

      // Transform database format to LibraryItem format
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
        category: item.category,
        additionalImages: item.additional_images || []
      }));

      setItems(transformedItems);
      setLoading(false);
    };

    fetchItems();

    // Set up realtime subscription for updates
    const channel = supabase
      .channel('library-list-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'library_items'
        },
        () => {
          fetchItems();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Handle category from navigation state
  useEffect(() => {
    if (location.state?.category) {
      setFilters(prev => ({...prev, categories: [location.state.category]}));
    }
  }, [location.state]);

  const filteredItems = items.filter(item => {
    // Search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        item.title.mk.toLowerCase().includes(query) ||
        item.title.en.toLowerCase().includes(query) ||
        item.author.toLowerCase().includes(query) ||
        item.keywords.some(kw => kw.toLowerCase().includes(query)) ||
        item.description.mk.toLowerCase().includes(query) ||
        item.description.en.toLowerCase().includes(query);
      
      if (!matchesSearch) return false;
    }

    // Year range filter
    if (filters.yearFrom && item.year < parseInt(filters.yearFrom)) return false;
    if (filters.yearTo && item.year > parseInt(filters.yearTo)) return false;

    // Language filter
    if (filters.language !== 'all' && 
        !item.language.some(lang => lang.toLowerCase().includes(filters.language.toLowerCase()))) {
      return false;
    }

    // Author filter
    if (filters.author && 
        !item.author.toLowerCase().includes(filters.author.toLowerCase())) {
      return false;
    }

    // Item type filter
    if (filters.itemType !== 'all' && item.type !== filters.itemType) {
      return false;
    }

    // Category filter
    if (filters.categories.length > 0 && 
        !filters.categories.some(cat => item.category.includes(cat))) {
      return false;
    }

    return true;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Mobile Search & Filters - Sticky */}
        <section className="md:hidden sticky top-[var(--header-height)] z-40 py-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
          <div className="container mx-auto px-4 space-y-3">
            <SearchBar onSearch={setSearchQuery} />
            <div className="flex justify-end">
              <Drawer>
                <DrawerTrigger asChild>
                  <Button variant="outline" size="sm">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    {t('Филтри', 'Filters')}
                  </Button>
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle>{t('Филтри', 'Filters')}</DrawerTitle>
                  </DrawerHeader>
                  <div className="p-4 pb-6">
                    <LibraryFilters filters={filters} onFilterChange={setFilters} />
                    <div className="mt-6 flex justify-end">
                      <DrawerClose asChild>
                        <Button>{t('Готово', 'Done')}</Button>
                      </DrawerClose>
                    </div>
                  </div>
                </DrawerContent>
              </Drawer>
            </div>
          </div>
        </section>

        {/* Desktop Search - Sticky */}
        <section className="hidden md:block sticky top-[var(--header-height)] z-40 py-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
          <div className="container mx-auto px-4">
            <SearchBar onSearch={setSearchQuery} />
          </div>
        </section>

        {/* Results Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Filters Sidebar - Hidden on mobile */}
              <aside className="hidden md:block lg:w-64 flex-shrink-0">
                <LibraryFilters filters={filters} onFilterChange={setFilters} />
              </aside>

              {/* Results Grid */}
              <div className="flex-1">
                <div className="mb-6">
                  <p className="text-muted-foreground">
                    {loading ? t('Се вчитува...', 'Loading...') : t(
                      `Пронајдени ${filteredItems.length} резултати`,
                      `Found ${filteredItems.length} results`
                    )}
                  </p>
                </div>
                <LibraryGrid items={filteredItems} />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Library;
