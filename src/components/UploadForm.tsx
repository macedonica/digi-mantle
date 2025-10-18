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

      // Upload thumbnail (required)
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
        throw new Error('Thumbnail is required');
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

      // Upload additional image if provided
      if (files.image) {
        const imagePath = `${crypto.randomUUID()}-${files.image.name}`;
        const { error: imageError } = await supabase.storage
          .from('library-images')
          .upload(imagePath, files.image);

        if (imageError) throw imageError;

        const { data: { publicUrl } } = supabase.storage
          .from('library-images')
          .getPublicUrl(imagePath);
        
        imageUrl = publicUrl;
      }

      // Create database entry
      const { error: dbError } = await supabase
        .from('library_items')
        .insert({
          title_mk: formData.title_mk,
          title_en: formData.title_en,
          author: formData.author,
          year: formData.year,
          language: formData.language,
          category: formData.category,
          type: formData.type,
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

        <div className="space-y-2">
          <Label htmlFor="type">{t('Тип', 'Type')}</Label>
          <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
            <SelectTrigger>
              <SelectValue placeholder={t('Избери тип', 'Select type')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="book">{t('Книга', 'Book')}</SelectItem>
              <SelectItem value="image">{t('Слика', 'Image')}</SelectItem>
              <SelectItem value="document">{t('Документ', 'Document')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          <Label htmlFor="pdf">{t('PDF', 'PDF')}</Label>
          <Input
            id="pdf"
            type="file"
            accept=".pdf"
            onChange={(e) => setFiles({ ...files, pdf: e.target.files?.[0] })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="image">{t('Дополнителна Слика', 'Additional Image')}</Label>
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={(e) => setFiles({ ...files, image: e.target.files?.[0] })}
          />
        </div>
      </div>

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
    </form>
  );
};
