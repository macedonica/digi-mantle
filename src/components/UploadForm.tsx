import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { z } from 'zod';

// Validation schema for form inputs
const uploadSchema = z.object({
  title_mk: z.string().trim().min(1, 'Title (MK) is required').max(500, 'Title (MK) must be less than 500 characters'),
  title_en: z.string().trim().min(1, 'Title (EN) is required').max(500, 'Title (EN) must be less than 500 characters'),
  author: z.string().trim().min(1, 'Author (MK) is required').max(200, 'Author (MK) must be less than 200 characters'),
  author_en: z.string().trim().max(200, 'Author (EN) must be less than 200 characters').optional(),
  year: z.number().int().min(1000, 'Year must be at least 1000').max(new Date().getFullYear() + 1, 'Year cannot be in the future'),
  languages: z.array(z.string()).min(1, 'At least one language is required'),
  category: z.string().min(1, 'Category is required'),
  type: z.string().optional(),
  description_mk: z.string().max(50000, 'Description (MK) must be less than 50,000 characters').optional(),
  description_en: z.string().max(50000, 'Description (EN) must be less than 50,000 characters').optional(),
  keywords: z.string().max(1000, 'Keywords must be less than 1,000 characters').optional(),
  publication_city: z.string().max(200, 'Publication city (MK) must be less than 200 characters').optional(),
  publication_city_en: z.string().max(200, 'Publication city (EN) must be less than 200 characters').optional(),
  publisher: z.string().max(300, 'Publisher (MK) must be less than 300 characters').optional(),
  publisher_en: z.string().max(300, 'Publisher (EN) must be less than 300 characters').optional(),
});

// File validation helper
const validateFile = (file: File | undefined, maxSize: number, allowedTypes: string[], fieldName: string) => {
  if (!file) return;
  
  if (file.size > maxSize) {
    throw new Error(`${fieldName} must be less than ${Math.round(maxSize / 1024 / 1024)}MB`);
  }
  
  if (!allowedTypes.includes(file.type)) {
    throw new Error(`${fieldName} must be one of: ${allowedTypes.join(', ')}`);
  }
};

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
    author_en: '',
    year: new Date().getFullYear(),
    languages: [] as string[],
    category: '',
    type: '',
    description_mk: '',
    description_en: '',
    keywords: '',
    publication_city: '',
    publication_city_en: '',
    publisher: '',
    publisher_en: '',
  });

  const availableLanguages = [
    'Macedonian',
    'English', 
    'Serbian',
    'Bulgarian',
    'French',
    'Croatian',
    'German'
  ];

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
      // Validate form data
      const validationResult = uploadSchema.safeParse(formData);
      if (!validationResult.success) {
        const firstError = validationResult.error.errors[0];
        throw new Error(firstError.message);
      }

      // Validate files based on upload type
      if (uploadType === 'image') {
        validateFile(
          files.image, 
          10 * 1024 * 1024, // 10MB
          ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
          'Image'
        );
      } else {
        validateFile(
          files.thumbnail,
          5 * 1024 * 1024, // 5MB
          ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
          'Thumbnail'
        );
        
        if (files.pdf) {
          validateFile(
            files.pdf,
            50 * 1024 * 1024, // 50MB
            ['application/pdf'],
            'PDF'
          );
        }
      }

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
      const itemType = uploadType === 'image' ? 'image' : 'book';

      const { error: dbError } = await supabase
        .from('library_items')
        .insert({
          title_mk: formData.title_mk,
          title_en: formData.title_en,
          author: formData.author,
          author_en: formData.author_en,
          year: formData.year,
          language: formData.languages,
          category: formData.category,
          type: itemType,
          description_mk: formData.description_mk || null,
          description_en: formData.description_en || null,
          keywords: formData.keywords ? formData.keywords.split(',').map(k => k.trim()) : null,
          thumbnail_url: thumbnailUrl,
          pdf_url: pdfUrl,
          image_url: imageUrl,
          uploaded_by: user.id,
          publication_city: formData.publication_city || null,
          publication_city_en: formData.publication_city_en || null,
          publisher: formData.publisher || null,
          publisher_en: formData.publisher_en || null,
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
              <Label htmlFor="author">{t('Автор (МК)', 'Author (MK)')}</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="author_en">{t('Автор (EN)', 'Author (EN)')}</Label>
              <Input
                id="author_en"
                value={formData.author_en}
                onChange={(e) => setFormData({ ...formData, author_en: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="publisher">{t('Издавач (МК)', 'Published By (MK)')}</Label>
              <Input
                id="publisher"
                value={formData.publisher}
                onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="publisher_en">{t('Издавач (EN)', 'Published By (EN)')}</Label>
              <Input
                id="publisher_en"
                value={formData.publisher_en}
                onChange={(e) => setFormData({ ...formData, publisher_en: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="publication_city">{t('Град на издавање (МК)', 'Publication City (MK)')}</Label>
              <Input
                id="publication_city"
                value={formData.publication_city}
                onChange={(e) => setFormData({ ...formData, publication_city: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="publication_city_en">{t('Град на издавање (EN)', 'Publication City (EN)')}</Label>
              <Input
                id="publication_city_en"
                value={formData.publication_city_en}
                onChange={(e) => setFormData({ ...formData, publication_city_en: e.target.value })}
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

            <div className="space-y-2 md:col-span-2">
              <Label>{t('Јазици', 'Languages')}</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 border rounded-lg">
                {availableLanguages.map((lang) => (
                  <div key={lang} className="flex items-center space-x-2">
                    <Checkbox
                      id={`lang-${lang}`}
                      checked={formData.languages.includes(lang)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFormData({ 
                            ...formData, 
                            languages: [...formData.languages, lang] 
                          });
                        } else {
                          setFormData({ 
                            ...formData, 
                            languages: formData.languages.filter(l => l !== lang) 
                          });
                        }
                      }}
                    />
                    <label 
                      htmlFor={`lang-${lang}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {lang}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">{t('Категорија', 'Category')}</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder={t('Избери категорија', 'Select category')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="history">{t('Историја', 'History')}</SelectItem>
                  <SelectItem value="archaeology">{t('Археологија', 'Archaeology')}</SelectItem>
                  <SelectItem value="literature">{t('Книжевност', 'Literature')}</SelectItem>
                  <SelectItem value="ethnology">{t('Етнологија', 'Ethnology')}</SelectItem>
                  <SelectItem value="folklore">{t('Фолклор', 'Folklore')}</SelectItem>
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
            <ReactQuill
              theme="snow"
              value={formData.description_mk}
              onChange={(value) => setFormData({ ...formData, description_mk: value })}
              modules={{
                toolbar: [
                  [{ 'header': [1, 2, 3, false] }],
                  ['bold', 'italic', 'underline'],
                  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                  [{ 'align': [] }],
                  ['link'],
                  ['clean']
                ]
              }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description_en">{t('Опис (EN)', 'Description (EN)')}</Label>
            <ReactQuill
              theme="snow"
              value={formData.description_en}
              onChange={(value) => setFormData({ ...formData, description_en: value })}
              modules={{
                toolbar: [
                  [{ 'header': [1, 2, 3, false] }],
                  ['bold', 'italic', 'underline'],
                  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                  [{ 'align': [] }],
                  ['link'],
                  ['clean']
                ]
              }}
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
