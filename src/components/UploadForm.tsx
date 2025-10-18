import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export const UploadForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [uploadType, setUploadType] = useState<'document' | 'image' | null>(null);
  
  const [formData, setFormData] = useState({
    title_mk: '',
    title_en: '',
    author: '',
    year: new Date().getFullYear(),
    language: '',
    category: '',
    type: '',
    description_mk: '',
    description_en: '',
    keywords: '',
  });

  const [files, setFiles] = useState<{
    thumbnail?: File;
    pdf?: File;
    image?: File;
  }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      let thumbnailUrl = '';
      let pdfUrl = null;
      let imageUrl = null;

      if (uploadType === 'image') {
        // For images, use the same file for both thumbnail and image view
        if (files.image) {
          const imagePath = `${crypto.randomUUID()}-${files.image.name}`;
          const { error: imageError } = await supabase.storage
            .from('library-images')
            .upload(imagePath, files.image);

          if (imageError) throw imageError;

          const { data: { publicUrl } } = supabase.storage
            .from('library-images')
            .getPublicUrl(imagePath);
          
          thumbnailUrl = publicUrl;
          imageUrl = publicUrl;
        } else {
          throw new Error(t('Сликата е задолжителна', 'Image is required'));
        }
      } else {
        // For documents, require separate thumbnail and PDF
        if (files.thumbnail) {
          const thumbnailPath = `${crypto.randomUUID()}-${files.thumbnail.name}`;
          const { error: thumbnailError } = await supabase.storage
            .from('library-images')
            .upload(thumbnailPath, files.thumbnail);

          if (thumbnailError) throw thumbnailError;

          const { data: { publicUrl } } = supabase.storage
            .from('library-images')
            .getPublicUrl(thumbnailPath);
          
          thumbnailUrl = publicUrl;
        } else {
          throw new Error(t('Сликичката е задолжителна', 'Thumbnail is required'));
        }

        // Upload PDF if provided
        if (files.pdf) {
          const pdfPath = `${crypto.randomUUID()}-${files.pdf.name}`;
          const { error: pdfError } = await supabase.storage
            .from('library-pdfs')
            .upload(pdfPath, files.pdf);

          if (pdfError) throw pdfError;

          const { data: { publicUrl } } = supabase.storage
            .from('library-pdfs')
            .getPublicUrl(pdfPath);
          
          pdfUrl = publicUrl;
        }
      }

      // Create database entry with appropriate type
      const itemType = uploadType === 'image' ? 'image' : formData.type || 'document';

      const { error: dbError } = await supabase
        .from('library_items')
        .insert({
          title_mk: formData.title_mk,
          title_en: formData.title_en,
          author: formData.author,
          year: formData.year,
          language: formData.language,
          category: formData.category,
          type: itemType,
          description_mk: formData.description_mk || null,
          description_en: formData.description_en || null,
          keywords: formData.keywords ? formData.keywords.split(',').map(k => k.trim()) : null,
          thumbnail_url: thumbnailUrl,
          pdf_url: pdfUrl,
          image_url: imageUrl,
          uploaded_by: user.id,
        });

      if (dbError) throw dbError;

      toast({
        title: t('Успешно качено', 'Successfully uploaded'),
        description: t('Ставката е додадена во библиотеката', 'Item has been added to the library'),
      });

      onSuccess();
    } catch (error: any) {
      toast({
        title: t('Грешка', 'Error'),
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {!uploadType ? (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-center mb-6">
            {t('Избери тип на содржина', 'Select Content Type')}
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <Button
              type="button"
              variant="outline"
              className="h-32 flex flex-col gap-2"
              onClick={() => setUploadType('document')}
            >
              <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="font-semibold">{t('Документ/Книга', 'Document/Book')}</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-32 flex flex-col gap-2"
              onClick={() => setUploadType('image')}
            >
              <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="font-semibold">{t('Слика', 'Image')}</span>
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              {uploadType === 'document' 
                ? t('Качи Документ/Книга', 'Upload Document/Book')
                : t('Качи Слика', 'Upload Image')}
            </h3>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setUploadType(null)}
            >
              {t('Промени тип', 'Change Type')}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title_mk">{t('Наслов (МК)', 'Title (MK)')}</Label>
              <Input
                id="title_mk"
                value={formData.title_mk}
                onChange={(e) => setFormData({ ...formData, title_mk: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="title_en">{t('Наслов (EN)', 'Title (EN)')}</Label>
              <Input
                id="title_en"
                value={formData.title_en}
                onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="author">{t('Автор', 'Author')}</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="year">{t('Година', 'Year')}</Label>
              <Input
                id="year"
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">{t('Јазик', 'Language')}</Label>
              <Select value={formData.language} onValueChange={(value) => setFormData({ ...formData, language: value })}>
                <SelectTrigger>
                  <SelectValue placeholder={t('Избери јазик', 'Select language')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mk">{t('Македонски', 'Macedonian')}</SelectItem>
                  <SelectItem value="en">{t('Англиски', 'English')}</SelectItem>
                  <SelectItem value="other">{t('Друго', 'Other')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">{t('Категорија', 'Category')}</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder={t('Избери категорија', 'Select category')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="history">History</SelectItem>
                  <SelectItem value="culture">Culture</SelectItem>
                  <SelectItem value="geography">Geography</SelectItem>
                  <SelectItem value="personalities">Personalities</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {uploadType === 'document' && (
              <div className="space-y-2">
                <Label htmlFor="type">{t('Тип', 'Type')}</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('Избери тип', 'Select type')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="book">{t('Книга', 'Book')}</SelectItem>
                    <SelectItem value="document">{t('Документ', 'Document')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="keywords">{t('Клучни зборови (одвоени со запирка)', 'Keywords (comma separated)')}</Label>
              <Input
                id="keywords"
                value={formData.keywords}
                onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                placeholder="keyword1, keyword2, keyword3"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description_mk">{t('Опис (МК)', 'Description (MK)')}</Label>
            <Textarea
              id="description_mk"
              value={formData.description_mk}
              onChange={(e) => setFormData({ ...formData, description_mk: e.target.value })}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description_en">{t('Опис (EN)', 'Description (EN)')}</Label>
            <Textarea
              id="description_en"
              value={formData.description_en}
              onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
              rows={3}
            />
          </div>

          {uploadType === 'document' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="thumbnail">{t('Сликичка', 'Thumbnail')} *</Label>
                <Input
                  id="thumbnail"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFiles({ ...files, thumbnail: e.target.files?.[0] })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pdf">{t('PDF Документ', 'PDF Document')}</Label>
                <Input
                  id="pdf"
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setFiles({ ...files, pdf: e.target.files?.[0] })}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="image">{t('Слика', 'Image')} *</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => setFiles({ ...files, image: e.target.files?.[0] })}
                required
              />
              <p className="text-sm text-muted-foreground">
                {t('Оваа слика ќе се користи и како сликичка и за приказ', 'This image will be used as both thumbnail and for viewing')}
              </p>
            </div>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('Се качува...', 'Uploading...')}
              </>
            ) : (
              t('Качи', 'Upload')
            )}
          </Button>
        </>
      )}
    </form>
  );
};
