import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { useLanguage } from "@/contexts/LanguageContext";
import { BookOpen, Globe, Users, Archive } from "lucide-react";
const About = () => {
  const { t } = useLanguage();

  const values = [
    {
      icon: Archive,
      title: { mk: "Зачувување", en: "Preservation" },
      description: {
        mk: "Ги зачувуваме историските документи за идните генерации.",
        en: "We preserve historical documents for future generations.",
      },
    },
    {
      icon: Globe,
      title: { mk: "Пристапност", en: "Accessibility" },
      description: {
        mk: "Ги правиме достапни културните богатства за сите.",
        en: "We make cultural treasures accessible to everyone.",
      },
    },
    {
      icon: Users,
      title: { mk: "Заедница", en: "Community" },
      description: {
        mk: "Изградуваме заедница околу нашето споделено наследство.",
        en: "We build community around our shared heritage.",
      },
    },
    {
      icon: BookOpen,
      title: { mk: "Образование", en: "Education" },
      description: {
        mk: "Обезбедуваме образовни ресурси за истражување и учење.",
        en: "We provide educational resources for research and learning.",
      },
    },
  ];

  const { language } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title={language === 'mk' 
          ? "За Нас - Дигитален Архив | Македонско Културно Наследство" 
          : "About Us - Digital Archive | Macedonian Cultural Heritage"}
        description={language === 'mk'
          ? "Дознајте повеќе за нашата мисија за зачувување на македонското културно наследство. Основан во 2020, нашиот архив содржи над 5000 дигитализирани ставки."
          : "Learn about our mission to preserve Macedonian cultural heritage. Founded in 2020, our archive contains over 5,000 digitized items."}
        keywords="за нас, about us, дигитален архив, digital archive, мисија, mission, македонско наследство, macedonian heritage"
        canonicalPath="/about"
      />
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold">{t("За Нас", "About Us")}</h1>
              <p className="text-xl text-muted-foreground">
                {t(
                  "Дигиталниот архив е посветен на зачувување и споделување на македонското културно наследство.",
                  "The Digital Archive is dedicated to preserving and sharing Macedonian cultural heritage.",
                )}
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-8">
              <h2 className="text-3xl font-bold">{t("Нашата Мисија", "Our Mission")}</h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {t(
                    "Нашата мисија е да го зачуваме богатото културно и историско наследство на македонскиот народ преку дигитализација на книги, ракописи, слики и документи. Ги правиме овие материјали достапни за истражувачи, студенти и сите оние што се заинтересирани за нашата историја и култура.",
                    "Our mission is to preserve the rich cultural and historical heritage of the Macedonian people through digitization of books, manuscripts, images and documents. We make these materials accessible to researchers, students and all those interested in our history and culture.",
                  )}
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed mt-4">
                  {t(
                    "Веруваме дека знаењето треба да биде отворено и достапно за сите. Преку овој дигитален архив, овозможуваме луѓето од целиот свет да ги истражат и да ги проучат нашите историски богатства.",
                    "We believe that knowledge should be open and accessible to all. Through this digital archive, we enable people from all over the world to explore and study our historical treasures.",
                  )}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">{t("Наши Вредности", "Our Values")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <div key={index} className="card-elevated p-6 text-center space-y-4">
                    <Icon className="h-12 w-12 mx-auto text-primary" />
                    <h3 className="text-xl font-bold">{value.title[language]}</h3>
                    <p className="text-muted-foreground">{value.description[language]}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* History Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-8">
              <h2 className="text-3xl font-bold">{t("Наша Историја", "Our History")}</h2>
              <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                <p>
                  {t(
                    "Дигиталниот архив беше основан во 2020 година (КОВИД пандемијата) со цел да се зачува и дигитализира македонското културно наследство. Од тогаш, нашата колекција порасна на над 5000 дигитализирани ставки, кои систематски ќе бидат поставени на нашата страница.",
                    "The Digital Archive was founded in 2020 (COVID Pandemic) with the goal of preserving and digitizing Macedonian cultural heritage. Since then, our collection has grown to over 5,000 digitized items, which will be uploaded on the website.",
                  )}
                </p>
                <p>
                  {t(
                    "Работиме во соработка со библиотеки, музеи и приватни колекционери за да обезбедиме пристап до редки и вредни материјали. Нашиот тим се грижи за квалитетот и точноста на секоја дигитализирана ставка.",
                    "We work in collaboration with libraries, museums and private collectors to provide access to rare and valuable materials. Our team ensures the quality and accuracy of each digitized item.",
                  )}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
