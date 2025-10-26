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
  year_mk: z.string().trim().min(1, 'Year (MK) is required').max(200, 'Year (MK) must be less than 200 characters'),
  year_en: z.string().trim().min(1, 'Year (EN) is required').max(200, 'Year (EN) must be less than 200 characters'),
  languages: z.array(z.string()).min(1, 'At least one language is required'),
  categories: z.array(z.string()).min(1, 'At least one category is required'),
  type_mk: z.string().optional(),
  type_en: z.string().optional(),
  source_mk: z.string().max(300, 'Source (MK) must be less than 300 characters').optional(),
  source_en: z.string().max(300, 'Source (EN) must be less than 300 characters').optional(),
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
    year_mk: new Date().getFullYear().toString(),
    year_en: new Date().getFullYear().toString(),
    languages: [] as string[],
    categories: [] as string[],
    type_mk: '',
    type_en: '',
    source_mk: '',
    source_en: '',
    description_mk: '',
    description_en: '',
    keywords: '',
    publication_city: '',
    publication_city_en: '',
    publisher: '',
    publisher_en: '',
  });

  const availableLanguages = [
    { mk: 'Македонски', en: 'Macedonian' },
    { mk: 'Англиски', en: 'English' },
    { mk: 'Српски', en: 'Serbian' },
    { mk: 'Бугарски', en: 'Bulgarian' },
    { mk: 'Француски', en: 'French' },
    { mk: 'Хрватски', en: 'Croatian' },
    { mk: 'Германски', en: 'German' },
    { mk: 'Латински', en: 'Latin' },
    { mk: 'Коине', en: 'Koine' },
    { mk: 'Руски', en: 'Russian' },
    { mk: 'Грчки', en: 'Greek' },
    { mk: 'Италијански', en: 'Italian' },
    { mk: 'Црковнословенски', en: 'Church Slavonic' },
    { mk: 'Старословенски', en: 'Old Church Slavonic' },
    { mk: 'Глаголица', en: 'Glagolitic Script' }
  ];

  const availableCategories = [
    { value: 'history', mk: 'Историја', en: 'History' },
    { value: 'archaeology', mk: 'Археологија', en: 'Archaeology' },
    { value: 'literature', mk: 'Книжевност', en: 'Literature' },
    { value: 'ethnology', mk: 'Етнологија', en: 'Ethnology' },
    { value: 'folklore', mk: 'Фолклор', en: 'Folklore' },
  ];

  const [files, setFiles] = useState<{
    thumbnail?: File;
    pdf?: File;
    image?: File;
    additionalImages?: File[];
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
        
        // No size limit for PDFs, only type validation
        if (files.pdf && !['application/pdf'].includes(files.pdf.type)) {
          throw new Error('PDF must be a valid PDF file');
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

      // Upload additional images if provided (for books only)
      let additionalImageUrls: string[] = [];
      if (uploadType === 'document' && files.additionalImages && files.additionalImages.length > 0) {
        for (const imageFile of files.additionalImages) {
          validateFile(
            imageFile,
            5 * 1024 * 1024, // 5MB per image
            ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
            'Additional Image'
          );
          
          const imagePath = `${crypto.randomUUID()}-${imageFile.name}`;
          const { error: imageError } = await supabase.storage
            .from('library-images')
            .upload(imagePath, imageFile);

          if (imageError) throw imageError;

          const { data: { publicUrl } } = supabase.storage
            .from('library-images')
            .getPublicUrl(imagePath);
          
          additionalImageUrls.push(publicUrl);
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
          year_mk: formData.year_mk,
          year_en: formData.year_en,
          language: formData.languages,
          category: formData.categories,
          type: itemType,
          type_mk: formData.type_mk || null,
          type_en: formData.type_en || null,
          source_mk: formData.source_mk || null,
          source_en: formData.source_en || null,
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
          additional_images: additionalImageUrls.length > 0 ? additionalImageUrls : null,
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
              <Label htmlFor="year_mk">{t('Година (МК)', 'Year (MK)')}</Label>
              <Input
                id="year_mk"
                type="text"
                value={formData.year_mk}
                onChange={(e) => setFormData({ ...formData, year_mk: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="year_en">{t('Година (EN)', 'Year (EN)')}</Label>
              <Input
                id="year_en"
                type="text"
                value={formData.year_en}
                onChange={(e) => setFormData({ ...formData, year_en: e.target.value })}
                required
              />
            </div>

            {uploadType === 'image' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="type_mk">{t('Тип (МК)', 'Type (MK)')}</Label>
                  <Input
                    id="type_mk"
                    value={formData.type_mk}
                    onChange={(e) => setFormData({ ...formData, type_mk: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type_en">{t('Тип (EN)', 'Type (EN)')}</Label>
                  <Input
                    id="type_en"
                    value={formData.type_en}
                    onChange={(e) => setFormData({ ...formData, type_en: e.target.value })}
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="source_mk">{t('Извор (МК)', 'Source (MK)')}</Label>
              <Input
                id="source_mk"
                value={formData.source_mk}
                onChange={(e) => setFormData({ ...formData, source_mk: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="source_en">{t('Извор (EN)', 'Source (EN)')}</Label>
              <Input
                id="source_en"
                value={formData.source_en}
                onChange={(e) => setFormData({ ...formData, source_en: e.target.value })}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>{t('Јазици', 'Languages')}</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 border rounded-lg">
                {availableLanguages.map((lang) => (
                  <div key={lang.en} className="flex items-center space-x-2">
                    <Checkbox
                      id={`lang-${lang.en}`}
                      checked={formData.languages.includes(lang.en)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFormData({ 
                            ...formData, 
                            languages: [...formData.languages, lang.en] 
                          });
                        } else {
                          setFormData({ 
                            ...formData, 
                            languages: formData.languages.filter(l => l !== lang.en) 
                          });
                        }
                      }}
                    />
                    <label 
                      htmlFor={`lang-${lang.en}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {language === 'mk' ? lang.mk : lang.en}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>{t('Категории', 'Categories')}</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 border rounded-lg">
                {availableCategories.map((cat) => (
                  <div key={cat.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`cat-${cat.value}`}
                      checked={formData.categories.includes(cat.value)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFormData({ 
                            ...formData, 
                            categories: [...formData.categories, cat.value] 
                          });
                        } else {
                          setFormData({ 
                            ...formData, 
                            categories: formData.categories.filter(c => c !== cat.value) 
                          });
                        }
                      }}
                    />
                    <label 
                      htmlFor={`cat-${cat.value}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {language === 'mk' ? cat.mk : cat.en}
                    </label>
                  </div>
                ))}
              </div>
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

              <div className="space-y-2">
                <Label htmlFor="additionalImages">{t('Дополнителни Слики (Опционално)', 'Additional Images (Optional)')}</Label>
                <Input
                  id="additionalImages"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => setFiles({ ...files, additionalImages: e.target.files ? Array.from(e.target.files) : [] })}
                />
                <p className="text-sm text-muted-foreground">
                  {t('Можете да додадете повеќе слики за галерија', 'You can add multiple images for the gallery')}
                </p>
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
