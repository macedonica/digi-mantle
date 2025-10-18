import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowLeft, ZoomIn, ExternalLink, Book as BookIcon, Image as ImageIcon } from 'lucide-react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { supabase } from '@/integrations/supabase/client';
import type { LibraryItem } from '@/data/mockLibraryItems';

const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const [item, setItem] = useState<LibraryItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      const { data, error } = await supabase
        .from('library_items')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching item:', error);
        setLoading(false);
        return;
      }

      if (data) {
        const transformedItem: LibraryItem = {
          id: data.id,
          type: data.type as 'book' | 'image',
          title: { mk: data.title_mk, en: data.title_en },
          author: data.author,
          year: data.year,
          language: data.language,
          keywords: data.keywords || [],
          description: { mk: data.description_mk || '', en: data.description_en || '' },
          thumbnail: data.thumbnail_url,
          pdfUrl: data.pdf_url || undefined,
          imageUrl: data.image_url || undefined,
          category: data.category
        };
        setItem(transformedItem);
      }
      
      setLoading(false);
    };

    fetchItem();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">{t('Се вчитува...', 'Loading...')}</p>
        </main>
        <Footer />
      </div>
    );
  }

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
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full" size="lg">
                        <ZoomIn className="mr-2 h-5 w-5" />
                        {t('Зумирај Слика', 'Zoom Image')}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-5xl w-full h-[90vh] p-0">
                      <TransformWrapper
                        initialScale={1}
                        minScale={0.5}
                        maxScale={4}
                      >
                        <TransformComponent wrapperClass="w-full h-full flex items-center justify-center">
                          <img
                            src={item.imageUrl}
                            alt={item.title[language]}
                            className="max-w-full max-h-full object-contain"
                          />
                        </TransformComponent>
                      </TransformWrapper>
                    </DialogContent>
                  </Dialog>
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
