import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FeaturedCarousel } from "@/components/FeaturedCarousel";
import { Button } from "@/components/ui/button";
import { SEOHead, getOrganizationSchema } from "@/components/SEOHead";
import { useLanguage } from "@/contexts/LanguageContext";
import { Search, BookOpen, FileText, Image as ImageIcon } from "lucide-react";
import heroImage from "@/assets/hero-archive.jpg";
import koleBannerMk from "@/assets/kole-banner-mk-large.jpg";
import koleBannerEn from "@/assets/kole-banner-en-large.jpg";
const Index = () => {
  const navigate = useNavigate();
  const { language, t } = useLanguage();

  const navigateToLibrary = (type?: string) => {
    if (type) {
      navigate(`/library?type=${type}`);
    } else {
      navigate("/library");
    }
  };

  const typeCategories = [
    {
      icon: BookOpen,
      title: { mk: "Книги", en: "Books" },
      type: "book",
    },
    {
      icon: FileText,
      title: { mk: "Периодика", en: "Periodicals" },
      type: "periodical",
    },
    {
      icon: ImageIcon,
      title: { mk: "Слики", en: "Images" },
      type: "image",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title={language === 'mk' 
          ? "Дигитален Архив - Македонско Културно Наследство" 
          : "Digital Archive - Macedonian Cultural Heritage"}
        description={language === 'mk'
          ? "Истражувајте го македонското културно наследство преку дигитализирани книги, ракописи, слики и историски документи. Илинден, ВМРО, Гоце Делчев и многу повеќе."
          : "Explore Macedonian cultural heritage through digitized books, manuscripts, images and historical documents. Ilinden, VMRO, Goce Delchev and much more."}
        keywords="дигитален архив, digital archive, македонија, macedonia, илинден, ilinden, ВМРО, VMRO, гоце делчев, goce delchev, македонска историја, macedonian history, културно наследство, cultural heritage"
        canonicalPath="/"
        structuredData={getOrganizationSchema()}
      />
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img src={heroImage} alt="Digital Archive" className="w-full h-full object-cover opacity-50" />
            <div className="absolute inset-0 bg-gradient-to-b from-background/50 to-background"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center space-y-8">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                {t("Чувајте ја Историјата, Споделете го Наследството", "Preserve History, Share Heritage")}
              </h1>
              <p className="text-xl text-muted-foreground">
                {t(
                  "Ова е место каде што се чува историјата и културата на нашата нација.",
                  "This is the place where the history and culture of our nation are preserved.",
                )}
              </p>
              <Button variant="hero" size="lg" className="text-lg px-8 py-6" onClick={() => navigateToLibrary()}>
                <Search className="mr-2 h-5 w-5" />
                {t("Пребарај ја Библиотеката", "Search the Library")}
              </Button>
            </div>
          </div>
        </section>

        {/* Featured Carousel */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">{t("Истакнати Ставки", "Featured Items")}</h2>
            <FeaturedCarousel />
          </div>
        </section>

        {/* Type Categories */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">{t("Истражувајте по Тип", "Explore by Type")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {typeCategories.map((category, index) => {
                const Icon = category.icon;
                return (
                  <button
                    key={index}
                    onClick={() => navigateToLibrary(category.type)}
                    className="card-elevated p-8 space-y-4 text-center hover:bg-primary/5 transition-all"
                  >
                    <Icon className="h-12 w-12 mx-auto text-primary" />
                    <h3 className="font-bold text-lg">{category.title[language]}</h3>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Kole Mangov Archive Banner */}
        <section className="py-12">
          <div className="container mx-auto px-4 flex justify-center">
            <button
              onClick={() => navigate("/kole")}
              className="block max-w-md w-full hover:scale-105 transition-transform duration-300"
            >
              <img 
                src={language === 'mk' ? koleBannerMk : koleBannerEn} 
                alt={language === 'mk' ? 'Архивата на Коле Мангов' : 'Kole Mangov Archive'}
                className="w-full h-auto rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
              />
            </button>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20">
          <div className="container mx-auto px-4 text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              {t("Истражете Илјадници Документи од Нашето Минато", "Explore Thousands of Documents from Our Past")}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t(
                "Нашата дигитална колекција расте секој ден со нови историски материјали.",
                "Our digital collection grows every day with new historical materials.",
              )}
            </p>
            <Button variant="hero" size="lg" onClick={() => navigateToLibrary()}>
              {t("Истражи ја Колекцијата", "Explore the Collection")}
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
