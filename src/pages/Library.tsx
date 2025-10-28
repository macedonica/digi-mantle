import { useState, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
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
import { SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';

const ITEMS_PER_PAGE = 12;

interface FilterState {
  yearFrom: string;
  yearTo: string;
  language: string;
  author: string;
  categories: string[];
}

const Library = () => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(() => {
    const pageParam = searchParams.get('page');
    return pageParam ? parseInt(pageParam, 10) : 1;
  });
  const [activeType, setActiveType] = useState<'book' | 'image'>('book');
  const [filters, setFilters] = useState<FilterState>({
    yearFrom: '',
    yearTo: '',
    language: 'all',
    author: '',
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
        authorEn: item.author_en,
        year: item.year,
        yearMk: item.year_mk,
        yearEn: item.year_en,
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
    // Type filter (from toggle)
    if (item.type !== activeType) return false;

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
    const itemYear = typeof item.year === 'string' ? parseInt(item.year) : item.year;
    if (filters.yearFrom && !isNaN(itemYear) && itemYear < parseInt(filters.yearFrom)) return false;
    if (filters.yearTo && !isNaN(itemYear) && itemYear > parseInt(filters.yearTo)) return false;

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

    // Category filter
    if (filters.categories.length > 0 && 
        !filters.categories.some(cat => item.category.includes(cat))) {
      return false;
    }

    return true;
  });

  // Sync page number from URL params
  useEffect(() => {
    const pageParam = searchParams.get('page');
    const pageNumber = pageParam ? parseInt(pageParam, 10) : 1;
    if (pageNumber !== currentPage) {
      setCurrentPage(pageNumber);
    }
  }, [searchParams]);


  // Clamp page if out of range when results change (skip while loading)
  useEffect(() => {
    if (loading) return;
    const total = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
    if (total === 0) {
      if (currentPage !== 1) {
        setCurrentPage(1);
        setSearchParams({ page: '1' });
      }
      return;
    }
    if (currentPage > total) {
      setCurrentPage(total);
      setSearchParams({ page: total.toString() });
    }
  }, [loading, filteredItems.length, currentPage]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedItems = filteredItems.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSearchParams({ page: page.toString() });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Mobile Search - Sticky */}
        <section className="md:hidden sticky top-[var(--header-height)] z-40 py-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
          <div className="container mx-auto px-4">
            <SearchBar onSearch={(q) => { setSearchQuery(q); setCurrentPage(1); setSearchParams({ page: '1' }); }} />
          </div>
        </section>

        {/* Desktop Search - Sticky */}
        <section className="hidden md:block sticky top-[var(--header-height)] z-40 py-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
          <div className="container mx-auto px-4">
            <SearchBar onSearch={(q) => { setSearchQuery(q); setCurrentPage(1); setSearchParams({ page: '1' }); }} />
          </div>
        </section>

        {/* Mobile Type Toggle & Filters - Scrollable */}
        <section className="md:hidden py-4 border-b border-border">
          <div className="container mx-auto px-4 space-y-3">
            {/* Type Toggle */}
            <div className="flex justify-center">
              <div className="inline-flex rounded-lg border border-border bg-muted p-1">
                <button
                  onClick={() => { setActiveType('book'); setCurrentPage(1); setSearchParams({ page: '1' }); }}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    activeType === 'book' 
                      ? 'bg-primary text-primary-foreground shadow-sm' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {t('Книги', 'Books')}
                </button>
                <button
                  onClick={() => { setActiveType('image'); setCurrentPage(1); setSearchParams({ page: '1' }); }}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    activeType === 'image' 
                      ? 'bg-primary text-primary-foreground shadow-sm' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {t('Сведоштва', 'Testimonials')}
                </button>
              </div>
            </div>
            
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
                    <LibraryFilters filters={filters} onFilterChange={(f) => { setFilters(f); setCurrentPage(1); setSearchParams({ page: '1' }); }} />
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

        {/* Desktop Type Toggle - Scrollable */}
        <section className="hidden md:block py-6 border-b border-border">
          <div className="container mx-auto px-4">
            <div className="flex justify-center">
              <div className="inline-flex rounded-lg border border-border bg-muted p-1">
                <button
                  onClick={() => { setActiveType('book'); setCurrentPage(1); setSearchParams({ page: '1' }); }}
                  className={`px-6 py-2.5 rounded-md text-sm font-medium transition-all ${
                    activeType === 'book' 
                      ? 'bg-primary text-primary-foreground shadow-sm' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {t('Книги', 'Books')}
                </button>
                <button
                  onClick={() => { setActiveType('image'); setCurrentPage(1); setSearchParams({ page: '1' }); }}
                  className={`px-6 py-2.5 rounded-md text-sm font-medium transition-all ${
                    activeType === 'image' 
                      ? 'bg-primary text-primary-foreground shadow-sm' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {t('Сведоштва', 'Testimonials')}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Results Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Filters Sidebar - Hidden on mobile */}
              <aside className="hidden md:block lg:w-64 flex-shrink-0">
                <LibraryFilters filters={filters} onFilterChange={(f) => { setFilters(f); setCurrentPage(1); setSearchParams({ page: '1' }); }} />
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
                <LibraryGrid items={paginatedItems} />
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      {t('Претходна', 'Previous')}
                    </Button>
                    
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                        // Show first page, last page, current page, and pages around current
                        const showPage = 
                          page === 1 || 
                          page === totalPages || 
                          (page >= currentPage - 1 && page <= currentPage + 1);
                        
                        const showEllipsis = 
                          (page === currentPage - 2 && currentPage > 3) ||
                          (page === currentPage + 2 && currentPage < totalPages - 2);

                        if (showEllipsis) {
                          return <span key={page} className="px-2">...</span>;
                        }

                        if (!showPage) return null;

                        return (
                          <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(page)}
                            className="min-w-[40px]"
                          >
                            {page}
                          </Button>
                        );
                      })}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      {t('Следна', 'Next')}
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                )}
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
