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
import DOMPurify from 'dompurify';

const languageNames: Record<string, { mk: string; en: string }> = {
  'Macedonian': { mk: 'Македонски', en: 'Macedonian' },
  'English': { mk: 'Англиски', en: 'English' },
  'German': { mk: 'Германски', en: 'German' },
  'French': { mk: 'Француски', en: 'French' },
  'Russian': { mk: 'Руски', en: 'Russian' },
  'Serbian': { mk: 'Српски', en: 'Serbian' },
  'Bulgarian': { mk: 'Бугарски', en: 'Bulgarian' },
  'Greek': { mk: 'Грчки', en: 'Greek' },
  'Turkish': { mk: 'Турски', en: 'Turkish' },
  'Albanian': { mk: 'Албански', en: 'Albanian' },
};

const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const [item, setItem] = useState<LibraryItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [signedPdfUrl, setSignedPdfUrl] = useState<string | null>(null);
  const [signedImageUrl, setSignedImageUrl] = useState<string | null>(null);

  const translateLanguage = (lang: string) => {
    return languageNames[lang]?.[language] || lang;
  };

  useEffect(() => {
    const fetchItem = async () => {
      // Use the public view that excludes uploaded_by field for security
      const { data, error } = await supabase
        .from('public_library_items')
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
          authorEn: data.author_en,
          year: data.year,
          language: data.language,
          keywords: data.keywords || [],
          description: { mk: data.description_mk || '', en: data.description_en || '' },
          thumbnail: data.thumbnail_url,
          pdfUrl: data.pdf_url || undefined,
          imageUrl: data.image_url || undefined,
          category: data.category,
          publicationCity: data.publication_city,
          publicationCityEn: data.publication_city_en,
          publisher: data.publisher,
          publisherEn: data.publisher_en
        };
        setItem(transformedItem);

        // Generate signed URLs for private storage access
        if (data.pdf_url) {
          const pdfPath = data.pdf_url.split('/').slice(-1)[0];
          const { data: signedData } = await supabase.storage
            .from('library-pdfs')
            .createSignedUrl(pdfPath, 3600); // 1 hour expiry
          if (signedData) {
            setSignedPdfUrl(signedData.signedUrl);
          }
        }

        if (data.image_url) {
          const imagePath = data.image_url.split('/').slice(-1)[0];
          const { data: signedData } = await supabase.storage
            .from('library-images')
            .createSignedUrl(imagePath, 3600); // 1 hour expiry
          if (signedData) {
            setSignedImageUrl(signedData.signedUrl);
          }
        }
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
    if (signedPdfUrl) {
      window.open(signedPdfUrl, '_blank');
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
            <div className={`grid grid-cols-1 max-w-6xl mx-auto ${item.type === 'book' ? 'gap-8 lg:grid-cols-[minmax(auto,320px)_1fr]' : 'gap-12 lg:grid-cols-2'}`}>
              {/* Image Column */}
              <div className={`${item.type === 'book' ? 'max-w-[200px] mx-auto lg:max-w-none' : ''}`}>
                <div className={`rounded-lg overflow-hidden shadow-elegant ${item.type === 'book' ? 'aspect-[2/3] max-h-[400px]' : 'aspect-[3/4]'}`}>
                  <img
                    src={item.thumbnail}
                    alt={item.title[language]}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Action Buttons */}
                {item.type === 'book' && signedPdfUrl && (
                  <Button 
                    variant="hero" 
                    className="w-4/5 mx-auto mt-4" 
                    size="lg"
                    onClick={handleOpenPDF}
                  >
                    <ExternalLink className="mr-2 h-5 w-5" />
                    {t('Отвори PDF', 'Open PDF')}
                  </Button>
                )}
                
                {item.type === 'image' && signedImageUrl && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full mt-4" size="lg">
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
                            src={signedImageUrl}
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
                <h1 className="text-2xl md:text-3xl font-bold leading-tight">
                  {item.title[language]}
                </h1>

                {/* Metadata */}
                <div className="space-y-3">
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex gap-8">
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">
                          {t('Автор', 'Author')}
                        </dt>
                        <dd className="mt-1">
                          {language === 'mk' ? item.author : (item.authorEn || item.author)}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">
                          {t('Година', 'Year')}
                        </dt>
                        <dd className="mt-1">{item.year}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">
                          {t('Јазици', 'Languages')}
                        </dt>
                        <dd className="mt-1">{item.language.map(translateLanguage).join(', ')}</dd>
                      </div>
                    </div>
                    {((item.publisher || item.publisherEn) || (item.publicationCity || item.publicationCityEn)) && (
                      <div className="flex gap-8">
                        {(item.publisher || item.publisherEn) && (
                          <div>
                            <dt className="text-sm font-medium text-muted-foreground">
                              {t('Издавач', 'Published By')}
                            </dt>
                            <dd className="mt-1">
                              {language === 'mk' ? item.publisher : (item.publisherEn || item.publisher)}
                            </dd>
                          </div>
                        )}
                        {(item.publicationCity || item.publicationCityEn) && (
                          <div>
                            <dt className="text-sm font-medium text-muted-foreground">
                              {t('Град на издавање', 'Publication City')}
                            </dt>
                            <dd className="mt-1">
                              {language === 'mk' ? item.publicationCity : (item.publicationCityEn || item.publicationCity)}
                            </dd>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                </div>

                {/* Description */}
                <div>
                  <h2 className="text-xl font-bold mb-3">
                    {item.type === 'book' 
                      ? t('Опис', 'Description')
                      : t('Описание', 'Description')}
                  </h2>
                  <div 
                    className="text-muted-foreground leading-relaxed prose max-w-none"
                    dangerouslySetInnerHTML={{ 
                      __html: DOMPurify.sanitize(item.description[language]) 
                    }}
                  />
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
