import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  ArrowLeft,
  ExternalLink,
  Book as BookIcon,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  X,
  Download,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { LibraryItem } from "@/data/mockLibraryItems";
import DOMPurify from "dompurify";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { useLibraryLanguages } from "@/hooks/useLibraryOptions";

const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { language, t } = useLanguage();
  
  const handleBackToLibrary = () => {
    // Navigate back to the exact library state user was in
    const from = location.state?.from || '/library?page=1';
    navigate(from);
  };
  const [item, setItem] = useState<LibraryItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [signedPdfUrl, setSignedPdfUrl] = useState<string | null>(null);
  const [signedImageUrl, setSignedImageUrl] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [allImages, setAllImages] = useState<string[]>([]);
  const [isZoomDialogOpen, setIsZoomDialogOpen] = useState(false);
  const [zoomImageIndex, setZoomImageIndex] = useState(0);

  const { data: languages = [] } = useLibraryLanguages();

  const translateLanguage = (lang: string) => {
    const languageOption = languages.find(l => l.value === lang);
    if (languageOption) {
      return language === 'mk' ? languageOption.name_mk : languageOption.name_en;
    }
    return lang;
  };

  useEffect(() => {
    const fetchItem = async () => {
      // Use the public view that excludes uploaded_by field for security
      const { data, error } = await supabase.from("public_library_items").select("*").eq("id", id).maybeSingle();

      if (error) {
        console.error("Error fetching item:", error);
        setLoading(false);
        return;
      }

      if (data) {
        const transformedItem: LibraryItem = {
          id: data.id,
          type: data.type as "book" | "image",
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
          description: { mk: data.description_mk || "", en: data.description_en || "" },
          thumbnail: data.thumbnail_url,
          pdfUrl: data.pdf_url || undefined,
          imageUrl: data.image_url || undefined,
          category: data.category,
          publicationCity: data.publication_city,
          publicationCityEn: data.publication_city_en,
          publisher: data.publisher,
          publisherEn: data.publisher_en,
          additionalImages: data.additional_images || [],
          issueNumberMk: (data as any).issue_number_mk,
          issueNumberEn: (data as any).issue_number_en,
          watermarkUrl: (data as any).watermark_url,
        };
        setItem(transformedItem);

        // Build gallery of all images for image type items (main image + additional images)
        let images: string[] = [];
        if (data.type === 'image') {
          if (data.image_url) {
            images.push(data.image_url);
          }
          if (data.additional_images && data.additional_images.length > 0) {
            images.push(...data.additional_images);
          }
        }
        setAllImages(images);

        // Generate signed URLs for private storage access
        if (data.pdf_url) {
          const pdfPath = data.pdf_url.split("/").slice(-1)[0];
          const { data: signedData } = await supabase.storage.from("library-pdfs").createSignedUrl(pdfPath, 3600); // 1 hour expiry
          if (signedData) {
            setSignedPdfUrl(signedData.signedUrl);
          }
        }

        if (data.image_url) {
          const imagePath = data.image_url.split("/").slice(-1)[0];
          const { data: signedData } = await supabase.storage.from("library-images").createSignedUrl(imagePath, 3600); // 1 hour expiry
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
          <p className="text-muted-foreground">{t("Се вчитува...", "Loading...")}</p>
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
            <h1 className="text-2xl font-bold">{t("Ставката не е пронајдена", "Item not found")}</h1>
            <Button onClick={handleBackToLibrary}>{t("Назад", "Go Back")}</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleOpenPDF = () => {
    if (signedPdfUrl) {
      window.open(signedPdfUrl, "_blank", "noopener,noreferrer");
    }
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  const handleImageClick = () => {
    setZoomImageIndex(currentImageIndex);
    setIsZoomDialogOpen(true);
  };

  const handleZoomPrevImage = () => {
    setZoomImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const handleZoomNextImage = () => {
    setZoomImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  const getImageFileName = (src: string) => {
    try {
      const u = new URL(src);
      const ext = (u.pathname.split(".").pop() || "jpg").split("?")[0];
      const base = (item?.title?.en || item?.title?.mk || "image")
        .toString()
        .normalize("NFKD")
        .replace(/[^\w\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-")
        .toLowerCase();
      return `${base}-${zoomImageIndex + 1}.${ext}`;
    } catch {
      return `image-${zoomImageIndex + 1}.jpg`;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Back Button */}
        <section className="py-6 border-b border-border">
          <div className="container mx-auto px-4">
            <Button variant="ghost" onClick={handleBackToLibrary}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("Назад", "Back")}
            </Button>
          </div>
        </section>

        {/* Item Detail */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div
              className={`grid grid-cols-1 max-w-6xl mx-auto ${item.type === "book" ? "gap-8 lg:grid-cols-[minmax(auto,320px)_1fr]" : "gap-12 lg:grid-cols-2"}`}
            >
              {/* Image Column */}
              <div className={`${item.type === "book" ? "max-w-[200px] mx-auto lg:max-w-none" : ""}`}>
                <div
                  className={`rounded-lg overflow-hidden shadow-elegant ${item.type === "book" ? "aspect-[2/3] max-h-[400px]" : "aspect-[3/4]"} relative group ${item.type === "image" && allImages.length > 0 ? "cursor-pointer" : ""}`}
                  onClick={item.type === "image" && allImages.length > 0 ? handleImageClick : undefined}
                >
                  <img
                    src={item.type === "image" && allImages.length > 0 ? allImages[currentImageIndex] : item.thumbnail}
                    alt={item.title[language]}
                    className="w-full h-full object-contain"
                  />

                  {/* Navigation arrows for multiple images */}
                  {item.type === "image" && allImages.length > 1 && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePrevImage();
                        }}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-opacity z-10"
                        aria-label={t("Претходна слика", "Previous image")}
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNextImage();
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-opacity z-10"
                        aria-label={t("Следна слика", "Next image")}
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
                {(item.type === "book" || item.type === "periodical") && (
                  <div className="flex justify-center mt-4">
                    {signedPdfUrl ? (
                      <Button variant="hero" className="w-4/5" size="lg" onClick={handleOpenPDF}>
                        <ExternalLink className="mr-2 h-5 w-5" />
                        {t("Отвори PDF", "Open PDF")}
                      </Button>
                    ) : (item.sourceMk || item.sourceEn) && /^https?:\/\//i.test(language === "mk" ? item.sourceMk || "" : item.sourceEn || item.sourceMk || "") ? (
                      <Button 
                        variant="hero" 
                        className="w-4/5" 
                        size="lg" 
                        onClick={() => {
                          const sourceUrl = language === "mk" ? item.sourceMk : item.sourceEn || item.sourceMk;
                          if (sourceUrl) window.open(sourceUrl, '_blank', 'noopener,noreferrer');
                        }}
                      >
                        <ExternalLink className="mr-2 h-5 w-5" />
                        {t("Отвори Извор", "Open Source")}
                      </Button>
                    ) : null}
                  </div>
                )}

                {/* Watermark Display */}
                {item.watermarkUrl && (
                  <div className="flex justify-center mt-16">
                    <img 
                      src={item.watermarkUrl} 
                      alt="Watermark" 
                      className="max-w-[200px] lg:max-w-[320px] mx-auto h-auto rounded-lg shadow-md"
                    />
                  </div>
                )}
              </div>

              {/* Details Column */}
              <div className="space-y-8">
                {/* Type Badge */}
                <div className="flex items-center gap-2">
                  {item.type === "book" ? (
                    <BookIcon className="h-5 w-5 text-primary" />
                  ) : item.type === "periodical" ? (
                    <BookIcon className="h-5 w-5 text-primary" />
                  ) : (
                    <ImageIcon className="h-5 w-5 text-primary" />
                  )}
                  <span className="text-sm font-medium text-primary">
                    {item.type === "book" ? t("Книга", "Book") : item.type === "periodical" ? t("Периодика", "Periodical") : t("Сведоштво", "Testimonial")}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-2xl md:text-3xl font-bold leading-tight pb-3 border-b-2 border-primary">{item.title[language]}</h1>

                {/* Metadata */}
                <div className="space-y-4">
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground mb-1">{t("Година", "Year")}</dt>
                      <dd className="text-base">
                        {language === "mk" ? item.yearMk || item.year : item.yearEn || item.year}
                      </dd>
                    </div>

                    {item.type === 'periodical' && (item.sourceMk || item.sourceEn) && (
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground mb-1">{t("Весник", "Newspaper")}</dt>
                        <dd className="text-base">
                          {language === "mk" ? item.sourceMk : item.sourceEn || item.sourceMk}
                        </dd>
                      </div>
                    )}

                    {item.type === 'periodical' && ((item as any).issueNumberMk || (item as any).issueNumberEn) && (
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground mb-1">{t("Број на весник", "Newspaper Number")}</dt>
                        <dd className="text-base">
                          {language === "mk" ? (item as any).issueNumberMk : (item as any).issueNumberEn || (item as any).issueNumberMk}
                        </dd>
                      </div>
                    )}

                    {(item.author || item.authorEn) && (
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground mb-1">{t("Автор", "Author")}</dt>
                        <dd className="text-base">
                          {language === "mk" ? item.author : item.authorEn || item.author}
                        </dd>
                      </div>
                    )}

                    <div>
                      <dt className="text-sm font-medium text-muted-foreground mb-1">{t("Јазици", "Languages")}</dt>
                      <dd className="text-base">{item.language.map(translateLanguage).join(", ")}</dd>
                    </div>

                    {item.type !== 'periodical' && (item.publisher || item.publisherEn) && (
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground mb-1">
                          {t("Издавач", "Published By")}
                        </dt>
                        <dd className="text-base">
                          {language === "mk" ? item.publisher : item.publisherEn || item.publisher}
                        </dd>
                      </div>
                    )}

                    {(item.publicationCity || item.publicationCityEn) && (
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground mb-1">
                          {item.type === 'periodical' ? t("Место на издавање", "Publication Place") : t("Град на издавање", "Publication City")}
                        </dt>
                        <dd className="text-base">
                          {language === "mk" ? item.publicationCity : item.publicationCityEn || item.publicationCity}
                        </dd>
                      </div>
                    )}

                    {item.type === "image" && (item.typeMk || item.typeEn) && (
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground mb-1">{t("Тип", "Type")}</dt>
                        <dd className="text-base">{language === "mk" ? item.typeMk : item.typeEn || item.typeMk}</dd>
                      </div>
                    )}

                    {(item.sourceMk || item.sourceEn) && item.type !== 'periodical' && (() => {
                      const sourceValue = language === "mk" ? item.sourceMk : item.sourceEn || item.sourceMk;
                      const isUrl = sourceValue && /^https?:\/\//i.test(sourceValue);
                      
                      return (
                        <div>
                          <dt className="text-sm font-medium text-muted-foreground mb-1">{t("Извор", "Source")}</dt>
                          <dd className="text-base">
                            {isUrl ? (
                              <Button
                                variant="outline"
                                size="lg"
                                className="font-semibold"
                                onClick={() => window.open(sourceValue, '_blank', 'noopener,noreferrer')}
                              >
                                <ExternalLink className="mr-2 h-4 w-4" />
                                {t("Извор", "Source")}
                              </Button>
                            ) : (
                              sourceValue
                            )}
                          </dd>
                        </div>
                      );
                    })()}
                  </dl>
                </div>

                {/* Description */}
                <div>
                  <h2 className="text-xl font-bold mb-3 pt-3 border-t-2 border-primary">
                    {item.type === "book" ? t("Опис", "Description") : t("Опис", "Description")}
                  </h2>
                  <div
                    className="rich-content text-muted-foreground leading-relaxed max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(
                        /<[^>]+>/.test(item.description[language] || "")
                          ? item.description[language] || ""
                          : (item.description[language] || "").replace(/\n/g, "<br />"),
                      ),
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Zoom Dialog */}
      <Dialog open={isZoomDialogOpen} onOpenChange={setIsZoomDialogOpen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 gap-0">
          <DialogTitle className="sr-only">{t("Зумирана слика", "Zoomed Image")}</DialogTitle>
          <div className="relative w-full h-[90vh]">
            <TransformWrapper initialScale={1} minScale={0.5} maxScale={5} centerOnInit>
              {({ zoomIn, zoomOut, resetTransform }) => (
                <>
                  {/* Close button */}
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute top-4 left-4 z-20 bg-black/80 hover:bg-black text-white border-0"
                    onClick={() => setIsZoomDialogOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>

                  {/* Zoom Controls */}
                  <div className="absolute top-4 right-4 z-20 flex flex-col sm:flex-row gap-2 pointer-events-none">
                    <Button
                      variant="secondary"
                      size="icon"
                      className="bg-black/80 hover:bg-black text-white border-0 w-10 h-10 pointer-events-auto"
                      onClick={() => zoomIn()}
                      aria-label={t("Зумирај", "Zoom in")}
                    >
                      <ZoomIn className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="bg-black/80 hover:bg-black text-white border-0 w-10 h-10 pointer-events-auto"
                      onClick={() => zoomOut()}
                      aria-label={t("Одзумирај", "Zoom out")}
                    >
                      <ZoomOut className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="bg-black/80 hover:bg-black text-white border-0 w-10 h-10 pointer-events-auto"
                      onClick={() => resetTransform()}
                      aria-label={t("Ресетирај", "Reset")}
                    >
                      <RotateCcw className="h-5 w-5" />
                    </Button>
                    <a
                      href={allImages[zoomImageIndex] || item.thumbnail}
                      download={getImageFileName(allImages[zoomImageIndex] || item.thumbnail)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pointer-events-auto"
                    >
                      <Button
                        variant="secondary"
                        size="icon"
                        className="bg-black/80 hover:bg-black text-white border-0 w-10 h-10"
                        aria-label={t("Преземи слика", "Download image")}
                      >
                        <Download className="h-5 w-5" />
                      </Button>
                    </a>
                  </div>

                  {/* Image navigation */}
                  {allImages.length > 1 && (
                    <>
                      <button
                        onClick={handleZoomPrevImage}
                        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 bg-black/80 hover:bg-black text-white p-2 sm:p-3 rounded-full transition-colors"
                        aria-label={t("Претходна слика", "Previous image")}
                      >
                        <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
                      </button>
                      <button
                        onClick={handleZoomNextImage}
                        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 bg-black/80 hover:bg-black text-white p-2 sm:p-3 rounded-full transition-colors"
                        aria-label={t("Следна слика", "Next image")}
                      >
                        <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
                      </button>

                      {/* Image counter */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-black/80 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-sm">
                        {zoomImageIndex + 1} / {allImages.length}
                      </div>
                    </>
                  )}

                  {/* Zoomable Image */}
                  <TransformComponent
                    wrapperClass="!w-full !h-full"
                    contentClass="!w-full !h-full flex items-center justify-center"
                  >
                    <img
                      src={allImages[zoomImageIndex] || item.thumbnail}
                      alt={item.title[language]}
                      className="max-w-full max-h-full object-contain pointer-events-auto"
                      crossOrigin="anonymous"
                    />
                  </TransformComponent>
                </>
              )}
            </TransformWrapper>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ItemDetail;
