import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FeaturedCarousel } from '@/components/FeaturedCarousel';
import { SearchBar } from '@/components/SearchBar';
import { LibraryFilters } from '@/components/LibraryFilters';
import { LibraryGrid } from '@/components/LibraryGrid';
import { mockLibraryItems } from '@/data/mockLibraryItems';
import { useLanguage } from '@/contexts/LanguageContext';

interface FilterState {
  yearFrom: string;
  yearTo: string;
  language: string;
  author: string;
  itemType: string;
  category: string;
}

const Library = () => {
  const location = useLocation();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    yearFrom: '',
    yearTo: '',
    language: 'all',
    author: '',
    itemType: 'all',
    category: 'all'
  });

  // Handle category from navigation state
  useEffect(() => {
    if (location.state?.category) {
      setFilters(prev => ({...prev, category: location.state.category}));
    }
  }, [location.state]);

  const filteredItems = mockLibraryItems.filter(item => {
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
        !item.language.toLowerCase().includes(filters.language.toLowerCase())) {
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
    if (filters.category !== 'all' && item.category !== filters.category) {
      return false;
    }

    return true;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Featured Carousel */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <FeaturedCarousel />
          </div>
        </section>

        {/* Search Section */}
        <section className="py-12 border-b border-border">
          <div className="container mx-auto px-4">
            <SearchBar onSearch={setSearchQuery} />
          </div>
        </section>

        {/* Results Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Filters Sidebar */}
              <aside className="lg:w-64 flex-shrink-0">
                <LibraryFilters filters={filters} onFilterChange={setFilters} />
              </aside>

              {/* Results Grid */}
              <div className="flex-1">
                <div className="mb-6">
                  <p className="text-muted-foreground">
                    {t(
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
