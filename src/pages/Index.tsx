import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FeaturedCarousel } from '@/components/FeaturedCarousel';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Search, BookOpen, Map, Feather, Users, Globe } from 'lucide-react';
import heroImage from '@/assets/hero-archive.jpg';

const Index = () => {
  const navigate = useNavigate();
  const { language, t } = useLanguage();

  const navigateToLibrary = (category?: string) => {
    const path = language === 'mk' ? '/библиотека' : '/library';
    navigate(path, { state: { category } });
  };

  const thematicCategories = [
    {
      icon: BookOpen,
      title: { mk: 'Историја', en: 'History' },
      category: 'history'
    },
    {
      icon: Globe,
      title: { mk: 'Култура', en: 'Culture' },
      category: 'culture'
    },
    {
      icon: Feather,
      title: { mk: 'Поезија', en: 'Poetry' },
      category: 'poetry'
    },
    {
      icon: Users,
      title: { mk: 'Личности', en: 'Personalities' },
      category: 'personalities'
    }
  ];


  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src={heroImage} 
              alt="Digital Archive" 
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/50 to-background"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center space-y-8">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                {t(
                  'Чувајте ја Историјата, Споделете го Наследството',
                  'Preserve History, Share Heritage'
                )}
              </h1>
              <p className="text-xl text-muted-foreground">
                {t(
                  'Ова е местото каде што се чува историјата и културата на нашата нација.',
                  'This is the place where the history and culture of our nation are preserved.'
                )}
              </p>
              <Button 
                variant="hero" 
                size="lg"
                className="text-lg px-8 py-6"
                onClick={() => navigateToLibrary()}
              >
                <Search className="mr-2 h-5 w-5" />
                {t('Пребарај ја Библиотеката', 'Search the Library')}
              </Button>
            </div>
          </div>
        </section>

        {/* Featured Carousel */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">
              {t('Истакнати Ставки', 'Featured Items')}
            </h2>
            <FeaturedCarousel />
          </div>
        </section>


        {/* Thematic Categories */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              {t('Истражувајте по Теми', 'Explore by Themes')}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {thematicCategories.map((category, index) => {
                const Icon = category.icon;
                return (
                  <button
                    key={index}
                    onClick={() => navigateToLibrary(category.category)}
                    className="card-elevated p-8 space-y-4 text-center hover:bg-primary/5 transition-all"
                  >
                    <Icon className="h-12 w-12 mx-auto text-primary" />
                    <h3 className="font-bold">
                      {category.title[language]}
                    </h3>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20">
          <div className="container mx-auto px-4 text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              {t(
                'Истражете Илјадници Документи од Нашето Минато',
                'Explore Thousands of Documents from Our Past'
              )}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t(
                'Нашата дигитална колекција расте секој ден со нови историски материјали.',
                'Our digital collection grows every day with new historical materials.'
              )}
            </p>
            <Button 
              variant="hero" 
              size="lg"
              onClick={() => navigateToLibrary()}
            >
              {t('Истражи ја Колекцијата', 'Explore the Collection')}
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
