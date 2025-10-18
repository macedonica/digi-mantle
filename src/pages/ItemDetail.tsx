import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { mockLibraryItems } from '@/data/mockLibraryItems';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowLeft, Download, ExternalLink, Book as BookIcon, Image as ImageIcon } from 'lucide-react';

const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language, t } = useLanguage();

  const item = mockLibraryItems.find(i => i.id === id);

  if (!item) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold">
              {t('Ставката не е пронајдена', 'Item not found')}
            </h1>
            <Button onClick={() => navigate(-1)}>
              {t('Назад', 'Go Back')}
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleOpenPDF = () => {
    if (item.pdfUrl) {
      window.open(item.pdfUrl, '_blank');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Back Button */}
        <section className="py-6 border-b border-border">
          <div className="container mx-auto px-4">
            <Button variant="ghost" onClick={() => navigate(-1)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('Назад', 'Back')}
            </Button>
          </div>
        </section>

        {/* Item Detail */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
              {/* Image Column */}
              <div className="space-y-6">
                <div className="aspect-square rounded-lg overflow-hidden shadow-elegant">
                  <img
                    src={item.thumbnail}
                    alt={item.title[language]}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Action Buttons */}
                {item.type === 'book' && item.pdfUrl && (
                  <Button 
                    variant="hero" 
                    className="w-full" 
                    size="lg"
                    onClick={handleOpenPDF}
                  >
                    <ExternalLink className="mr-2 h-5 w-5" />
                    {t('Отвори PDF', 'Open PDF')}
                  </Button>
                )}
                
                {item.type === 'image' && item.imageUrl && (
                  <a 
                    href={item.imageUrl} 
                    download
                    className="block"
                  >
                    <Button variant="outline" className="w-full" size="lg">
                      <Download className="mr-2 h-5 w-5" />
                      {t('Превземи Слика', 'Download Image')}
                    </Button>
                  </a>
                )}
              </div>

              {/* Details Column */}
              <div className="space-y-8">
                {/* Type Badge */}
                <div className="flex items-center gap-2">
                  {item.type === 'book' ? (
                    <BookIcon className="h-5 w-5 text-primary" />
                  ) : (
                    <ImageIcon className="h-5 w-5 text-primary" />
                  )}
                  <span className="text-sm font-medium text-primary">
                    {item.type === 'book' 
                      ? t('Книга', 'Book') 
                      : t('Слика', 'Image')}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-4xl font-bold">
                  {item.title[language]}
                </h1>

                {/* Metadata */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">
                        {t('Автор', 'Author')}
                      </dt>
                      <dd className="mt-1 text-lg">{item.author}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">
                        {t('Година', 'Year')}
                      </dt>
                      <dd className="mt-1 text-lg">{item.year}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">
                        {t('Јазик', 'Language')}
                      </dt>
                      <dd className="mt-1 text-lg">{item.language}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">
                        {t('Тип', 'Type')}
                      </dt>
                      <dd className="mt-1 text-lg">
                        {item.type === 'book' 
                          ? t('Книга', 'Book') 
                          : t('Слика', 'Image')}
                      </dd>
                    </div>
                  </div>

                  {/* Keywords */}
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground mb-2">
                      {t('Клучни Зборови', 'Keywords')}
                    </dt>
                    <dd className="flex flex-wrap gap-2">
                      {item.keywords.map((keyword, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-muted rounded-full text-sm"
                        >
                          {keyword}
                        </span>
                      ))}
                    </dd>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h2 className="text-2xl font-bold mb-4">
                    {item.type === 'book' 
                      ? t('Опис', 'Description')
                      : t('Описание', 'Description')}
                  </h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {item.description[language]}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ItemDetail;
