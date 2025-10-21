import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowLeft, ExternalLink, Book as BookIcon, Image as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';
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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [allImages, setAllImages] = useState<string[]>([]);

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
          year: data.year, // Kept for backward compatibility
          yearMk: (data as any).year_mk,
          yearEn: (data as any).year_en,
          typeMk: (data as any).type_mk,
          typeEn: (data as any).type_en,
          sourceMk: (data as any).source_mk,
          sourceEn: (data as any).source_en,
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
          publisherEn: data.publisher_en,
          additionalImages: data.additional_images || []
        };
        setItem(transformedItem);

        // Build gallery of all images (thumbnail + additional images)
        const images: string[] = [data.thumbnail_url];
        if (data.additional_images && data.additional_images.length > 0) {
          images.push(...data.additional_images);
        }
        setAllImages(images);

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

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
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
                <div className={`rounded-lg overflow-hidden shadow-elegant ${item.type === 'book' ? 'aspect-[2/3] max-h-[400px]' : 'aspect-[3/4]'} relative group`}>
                  <img
                    src={allImages[currentImageIndex] || item.thumbnail}
                    alt={item.title[language]}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Navigation arrows for multiple images */}
                  {allImages.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label={t('Претходна слика', 'Previous image')}
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        onClick={handleNextImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label={t('Следна слика', 'Next image')}
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                      
                      {/* Image counter */}
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                        {currentImageIndex + 1} / {allImages.length}
                      </div>
                    </>
                  )}
                </div>

                {/* Action Buttons */}
                {item.type === 'book' && signedPdfUrl && (
                  <div className="flex justify-center mt-4">
                    <Button 
                      variant="hero" 
                      className="w-4/5" 
                      size="lg"
                      onClick={handleOpenPDF}
                    >
                      <ExternalLink className="mr-2 h-5 w-5" />
                      {t('Отвори PDF', 'Open PDF')}
                    </Button>
                  </div>
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
                      : t('Сведоштво', 'Testimonial')}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-2xl md:text-3xl font-bold leading-tight">
                  {item.title[language]}
                </h1>

                {/* Metadata */}
                <div className="space-y-4">
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground mb-1">
                        {t('Автор', 'Author')}
                      </dt>
                      <dd className="text-base">
                        {language === 'mk' ? item.author : (item.authorEn || item.author)}
                      </dd>
                    </div>
                    
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground mb-1">
                        {t('Година', 'Year')}
                      </dt>
                      <dd className="text-base">
                        {language === 'mk' 
                          ? (item.yearMk || item.year) 
                          : (item.yearEn || item.year)}
                      </dd>
                    </div>
                    
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground mb-1">
                        {t('Јазици', 'Languages')}
                      </dt>
                      <dd className="text-base">{item.language.map(translateLanguage).join(', ')}</dd>
                    </div>

                    {(item.publisher || item.publisherEn) && (
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground mb-1">
                          {t('Издавач', 'Published By')}
                        </dt>
                        <dd className="text-base">
                          {language === 'mk' ? item.publisher : (item.publisherEn || item.publisher)}
                        </dd>
                      </div>
                    )}
                    
                    {(item.publicationCity || item.publicationCityEn) && (
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground mb-1">
                          {t('Град на издавање', 'Publication City')}
                        </dt>
                        <dd className="text-base">
                          {language === 'mk' ? item.publicationCity : (item.publicationCityEn || item.publicationCity)}
                        </dd>
                      </div>
                    )}

                    {item.type === 'image' && (item.typeMk || item.typeEn) && (
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground mb-1">
                          {t('Тип', 'Type')}
                        </dt>
                        <dd className="text-base">
                          {language === 'mk' ? item.typeMk : (item.typeEn || item.typeMk)}
                        </dd>
                      </div>
                    )}

                    {(item.sourceMk || item.sourceEn) && (
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground mb-1">
                          {t('Извор', 'Source')}
                        </dt>
                        <dd className="text-base">
                          {language === 'mk' ? item.sourceMk : (item.sourceEn || item.sourceMk)}
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>

                {/* Description */}
                <div>
                  <h2 className="text-xl font-bold mb-3">
                    {item.type === 'book' 
                      ? t('Опис', 'Description')
                      : t('Описание', 'Description')}
                  </h2>
                  <div 
                    className="rich-content text-muted-foreground leading-relaxed max-w-none"
                    dangerouslySetInnerHTML={{ 
                      __html: DOMPurify.sanitize(
                        /<[^>]+>/.test(item.description[language] || '')
                          ? (item.description[language] || '')
                          : (item.description[language] || '').replace(/\n/g, '<br />')
                      )
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
