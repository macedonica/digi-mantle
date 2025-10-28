import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Pencil, Trash2, Loader2 } from 'lucide-react';
import type { LibraryItem } from '@/data/mockLibraryItems';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { z } from 'zod';

// Validation schema for edit form
const editSchema = z.object({
  title_mk: z.string().trim().min(1, 'Title (MK) is required').max(500, 'Title (MK) must be less than 500 characters'),
  title_en: z.string().trim().min(1, 'Title (EN) is required').max(500, 'Title (EN) must be less than 500 characters'),
  author: z.string().trim().min(1, 'Author (MK) is required').max(200, 'Author (MK) must be less than 200 characters'),
  author_en: z.string().trim().max(200, 'Author (EN) must be less than 200 characters').optional(),
  year_mk: z.string().trim().min(1, 'Year (MK) is required').max(200, 'Year (MK) must be less than 200 characters'),
  year_en: z.string().trim().min(1, 'Year (EN) is required').max(200, 'Year (EN) must be less than 200 characters'),
  languages: z.array(z.string()).min(1, 'At least one language is required'),
  categories: z.array(z.string()).min(1, 'At least one category is required'),
  type: z.string().min(1, 'Type is required'),
  type_mk: z.string().max(200, 'Type (MK) must be less than 200 characters').optional(),
  type_en: z.string().max(200, 'Type (EN) must be less than 200 characters').optional(),
  source_mk: z.string().optional(),
  source_en: z.string().optional(),
  description_mk: z.string().max(50000, 'Description (MK) must be less than 50,000 characters').optional(),
  description_en: z.string().max(50000, 'Description (EN) must be less than 50,000 characters').optional(),
  keywords: z.string().optional(),
  publication_city: z.string().max(200, 'Publication city (MK) must be less than 200 characters').optional(),
  publication_city_en: z.string().max(200, 'Publication city (EN) must be less than 200 characters').optional(),
  publisher: z.string().max(300, 'Publisher (MK) must be less than 300 characters').optional(),
  publisher_en: z.string().max(300, 'Publisher (EN) must be less than 300 characters').optional(),
});

// File validation helper
const validateFile = (file: File, maxSize: number, allowedTypes: string[], fieldName: string) => {
  if (file.size > maxSize) {
    throw new Error(`${fieldName} must be less than ${Math.round(maxSize / 1024 / 1024)}MB`);
  }
  
  if (!allowedTypes.includes(file.type)) {
    throw new Error(`${fieldName} must be one of: ${allowedTypes.join(', ')}`);
  }
};

export const AdminLibraryManager = () => {
  const { language, t } = useLanguage();
  const { toast } = useToast();
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<LibraryItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [newThumbnail, setNewThumbnail] = useState<File | null>(null);
  const [newAdditionalImages, setNewAdditionalImages] = useState<File[]>([]);
  const [newPdf, setNewPdf] = useState<File | null>(null);

  const [editFormData, setEditFormData] = useState({
    title_mk: '',
    title_en: '',
    author: '',
    author_en: '',
    year_mk: new Date().getFullYear().toString(),
    year_en: new Date().getFullYear().toString(),
    languages: [] as string[],
    categories: [] as string[],
    type: '',
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

  const bookCategories = [
    { value: 'history', mk: 'Історија', en: 'History' },
    { value: 'archaeology', mk: 'Археологија', en: 'Archaeology' },
    { value: 'literature', mk: 'Книжевност', en: 'Literature' },
    { value: 'ethnology', mk: 'Етнологија', en: 'Ethnology' },
    { value: 'folklore', mk: 'Фолклор', en: 'Folklore' },
  ];

  const testimonialCategories = [
    { value: 'newspaper', mk: 'Весник', en: 'Newspaper' },
    { value: 'document', mk: 'Документ', en: 'Document' },
    { value: 'map', mk: 'Карта', en: 'Map' },
    { value: 'artefact', mk: 'Артефакт', en: 'Artefact' },
    { value: 'manuscript', mk: 'Ракопис', en: 'Manuscript' },
    { value: 'book', mk: 'Книга', en: 'Book' },
    { value: 'photo', mk: 'Слика', en: 'Photo' },
  ];

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('library_items')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching items:', error);
      toast({
        title: t('Грешка', 'Error'),
        description: t('Неуспешно вчитување', 'Failed to load items'),
        variant: 'destructive',
      });
    } else {
      const transformedItems: LibraryItem[] = (data || []).map(item => ({
        id: item.id,
        type: item.type as 'book' | 'image',
        title: { mk: item.title_mk, en: item.title_en },
        author: item.author,
        authorEn: item.author_en,
        year: item.year,
        yearMk: (item as any).year_mk,
        yearEn: (item as any).year_en,
        typeMk: (item as any).type_mk,
        typeEn: (item as any).type_en,
        sourceMk: (item as any).source_mk,
        sourceEn: (item as any).source_en,
        language: item.language,
        keywords: item.keywords || [],
        description: { mk: item.description_mk || '', en: item.description_en || '' },
        thumbnail: item.thumbnail_url,
        pdfUrl: item.pdf_url || undefined,
        imageUrl: item.image_url || undefined,
        category: item.category,
        publicationCity: item.publication_city,
        publicationCityEn: item.publication_city_en,
        publisher: item.publisher,
        publisherEn: item.publisher_en,
        additionalImages: item.additional_images || []
      }));
      setItems(transformedItems);
    }
    setLoading(false);
  };

  const handleEdit = (item: LibraryItem) => {
    setEditingItem(item);
    const yearValue = typeof item.year === 'number' ? item.year.toString() : (item.year || '');
    setEditFormData({
      title_mk: item.title.mk,
      title_en: item.title.en,
      author: item.author,
      author_en: item.authorEn || '',
      year_mk: item.yearMk || yearValue,
      year_en: item.yearEn || yearValue,
      languages: item.language,
      categories: item.category,
      type: item.type,
      type_mk: item.typeMk || '',
      type_en: item.typeEn || '',
      source_mk: item.sourceMk || '',
      source_en: item.sourceEn || '',
      description_mk: item.description.mk,
      description_en: item.description.en,
      keywords: item.keywords.join(', '),
      publication_city: item.publicationCity || '',
      publication_city_en: item.publicationCityEn || '',
      publisher: item.publisher || '',
      publisher_en: item.publisherEn || '',
    });
  };

  const handleSaveEdit = async () => {
    if (!editingItem) return;

    setSaving(true);
    try {
      // Validate form data
      const validationResult = editSchema.safeParse(editFormData);
      if (!validationResult.success) {
        const firstError = validationResult.error.errors[0];
        throw new Error(firstError.message);
      }

      // Validate new thumbnail if provided
      if (newThumbnail) {
        validateFile(
          newThumbnail,
          5 * 1024 * 1024, // 5MB
          ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
          'Thumbnail'
        );
      }

      let thumbnailUrl = editingItem.thumbnail;

      // Upload new thumbnail if provided
      if (newThumbnail) {
        const thumbnailPath = `${crypto.randomUUID()}-${newThumbnail.name}`;
        const { error: uploadError } = await supabase.storage
          .from('library-images')
          .upload(thumbnailPath, newThumbnail);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('library-images')
          .getPublicUrl(thumbnailPath);
        
        // Add timestamp to prevent caching of old image
        thumbnailUrl = `${publicUrl}?t=${Date.now()}`;
      }

      // Upload new additional images if provided
      let additionalImageUrls = editingItem.additionalImages || [];
      if (newAdditionalImages.length > 0) {
        for (const imageFile of newAdditionalImages) {
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

      // Upload new PDF if provided
      let pdfUrl = editingItem.pdfUrl;
      if (newPdf) {
        // No size limit for PDFs, only type validation
        if (!['application/pdf'].includes(newPdf.type)) {
          throw new Error('PDF must be a valid PDF file');
        }

        const pdfPath = `${crypto.randomUUID()}-${newPdf.name}`;
        const { error: pdfError } = await supabase.storage
          .from('library-pdfs')
          .upload(pdfPath, newPdf);

        if (pdfError) throw pdfError;

        const { data: { publicUrl } } = supabase.storage
          .from('library-pdfs')
          .getPublicUrl(pdfPath);
        
        pdfUrl = publicUrl;
      }

      const { error } = await supabase
        .from('library_items')
        .update({
          title_mk: editFormData.title_mk,
          title_en: editFormData.title_en,
          author: editFormData.author,
          author_en: editFormData.author_en,
          year_mk: editFormData.year_mk,
          year_en: editFormData.year_en,
          language: editFormData.languages,
          category: editFormData.categories,
          type: editFormData.type,
          type_mk: editFormData.type_mk || null,
          type_en: editFormData.type_en || null,
          source_mk: editFormData.source_mk || null,
          source_en: editFormData.source_en || null,
          description_mk: editFormData.description_mk || null,
          description_en: editFormData.description_en || null,
          keywords: editFormData.keywords ? editFormData.keywords.split(',').map(k => k.trim()) : null,
          publication_city: editFormData.publication_city || null,
          publication_city_en: editFormData.publication_city_en || null,
          publisher: editFormData.publisher || null,
          publisher_en: editFormData.publisher_en || null,
          thumbnail_url: thumbnailUrl,
          additional_images: additionalImageUrls.length > 0 ? additionalImageUrls : null,
          pdf_url: pdfUrl || null,
        })
        .eq('id', editingItem.id);

      if (error) throw error;

      toast({
        title: t('Успешно', 'Success'),
        description: t('Ставката е ажурирана', 'Item has been updated'),
      });

      setEditingItem(null);
      setNewThumbnail(null);
      setNewAdditionalImages([]);
      setNewPdf(null);
      fetchItems();
    } catch (error: any) {
      toast({
        title: t('Грешка', 'Error'),
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;

    try {
      const { error } = await supabase
        .from('library_items')
        .delete()
        .eq('id', deletingId);

      if (error) throw error;

      toast({
        title: t('Успешно', 'Success'),
        description: t('Ставката е избришана', 'Item has been deleted'),
      });

      setDeletingId(null);
      fetchItems();
    } catch (error: any) {
      toast({
        title: t('Грешка', 'Error'),
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">
          {t('Нема ставки во библиотеката', 'No items in the library')}
        </p>
      ) : (
        items.map((item) => (
          <Card key={item.id} className="p-4">
            <div className="flex items-start gap-4">
              <img
                src={item.thumbnail}
                alt={item.title[language]}
                className="w-20 h-20 object-cover rounded"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg truncate">{item.title[language]}</h3>
                <p className="text-sm text-muted-foreground">{item.author} • {item.year}</p>
                <p className="text-sm text-muted-foreground">{item.category}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(item)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDeletingId(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editingItem} onOpenChange={(open) => {
        if (!open) {
          setEditingItem(null);
          setNewThumbnail(null);
          setNewAdditionalImages([]);
          setNewPdf(null);
        }
      }}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('Уреди Ставка', 'Edit Item')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Current Thumbnail Preview */}
            {editingItem && (
              <div className="space-y-2">
                <Label>{t('Тековна сликичка', 'Current Thumbnail')}</Label>
                <img
                  src={newThumbnail ? URL.createObjectURL(newThumbnail) : editingItem.thumbnail}
                  alt="Thumbnail preview"
                  className="w-32 h-32 object-cover rounded border"
                />
              </div>
            )}
            
            {/* New Thumbnail Upload */}
            <div className="space-y-2">
              <Label htmlFor="edit_thumbnail">{t('Промени сликичка', 'Change Thumbnail')}</Label>
              <Input
                id="edit_thumbnail"
                type="file"
                accept="image/*"
                onChange={(e) => setNewThumbnail(e.target.files?.[0] || null)}
              />
              <p className="text-sm text-muted-foreground">
                {t('Остави празно за да ја задржиш тековната', 'Leave empty to keep current')}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit_title_mk">{t('Наслов (МК)', 'Title (MK)')}</Label>
                <Input
                  id="edit_title_mk"
                  value={editFormData.title_mk}
                  onChange={(e) => setEditFormData({ ...editFormData, title_mk: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_title_en">{t('Наслов (EN)', 'Title (EN)')}</Label>
                <Input
                  id="edit_title_en"
                  value={editFormData.title_en}
                  onChange={(e) => setEditFormData({ ...editFormData, title_en: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_author">{t('Автор (МК)', 'Author (MK)')}</Label>
                <Input
                  id="edit_author"
                  value={editFormData.author}
                  onChange={(e) => setEditFormData({ ...editFormData, author: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_author_en">{t('Автор (EN)', 'Author (EN)')}</Label>
                <Input
                  id="edit_author_en"
                  value={editFormData.author_en}
                  onChange={(e) => setEditFormData({ ...editFormData, author_en: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_publisher">{t('Издавач (МК)', 'Published By (MK)')}</Label>
                <Input
                  id="edit_publisher"
                  value={editFormData.publisher}
                  onChange={(e) => setEditFormData({ ...editFormData, publisher: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_publisher_en">{t('Издавач (EN)', 'Published By (EN)')}</Label>
                <Input
                  id="edit_publisher_en"
                  value={editFormData.publisher_en}
                  onChange={(e) => setEditFormData({ ...editFormData, publisher_en: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_publication_city">{t('Град на издавање (МК)', 'Publication City (MK)')}</Label>
                <Input
                  id="edit_publication_city"
                  value={editFormData.publication_city}
                  onChange={(e) => setEditFormData({ ...editFormData, publication_city: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_publication_city_en">{t('Град на издавање (EN)', 'Publication City (EN)')}</Label>
                <Input
                  id="edit_publication_city_en"
                  value={editFormData.publication_city_en}
                  onChange={(e) => setEditFormData({ ...editFormData, publication_city_en: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_year_mk">{t('Година (МК)', 'Year (MK)')}</Label>
                <Input
                  id="edit_year_mk"
                  type="text"
                  value={editFormData.year_mk}
                  onChange={(e) => setEditFormData({ ...editFormData, year_mk: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_year_en">{t('Година (EN)', 'Year (EN)')}</Label>
                <Input
                  id="edit_year_en"
                  type="text"
                  value={editFormData.year_en}
                  onChange={(e) => setEditFormData({ ...editFormData, year_en: e.target.value })}
                />
              </div>

              {editFormData.type === 'image' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="edit_type_mk">{t('Тип (МК)', 'Type (MK)')}</Label>
                    <Input
                      id="edit_type_mk"
                      value={editFormData.type_mk}
                      onChange={(e) => setEditFormData({ ...editFormData, type_mk: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit_type_en">{t('Тип (EN)', 'Type (EN)')}</Label>
                    <Input
                      id="edit_type_en"
                      value={editFormData.type_en}
                      onChange={(e) => setEditFormData({ ...editFormData, type_en: e.target.value })}
                    />
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="edit_source_mk">{t('Извор (МК)', 'Source (MK)')}</Label>
                <Input
                  id="edit_source_mk"
                  value={editFormData.source_mk}
                  onChange={(e) => setEditFormData({ ...editFormData, source_mk: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_source_en">{t('Извор (EN)', 'Source (EN)')}</Label>
                <Input
                  id="edit_source_en"
                  value={editFormData.source_en}
                  onChange={(e) => setEditFormData({ ...editFormData, source_en: e.target.value })}
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label>{t('Јазици', 'Languages')}</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 border rounded-lg">
                  {availableLanguages.map((lang) => (
                    <div key={lang.en} className="flex items-center space-x-2">
                      <Checkbox
                        id={`edit-lang-${lang.en}`}
                        checked={editFormData.languages.includes(lang.en)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setEditFormData({ 
                              ...editFormData, 
                              languages: [...editFormData.languages, lang.en] 
                            });
                          } else {
                            setEditFormData({ 
                              ...editFormData, 
                              languages: editFormData.languages.filter(l => l !== lang.en) 
                            });
                          }
                        }}
                      />
                      <label 
                        htmlFor={`edit-lang-${lang.en}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {language === 'mk' ? lang.mk : lang.en}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t('Категории', 'Categories')}</Label>
                <div className="grid grid-cols-2 gap-4 p-4 border rounded-lg">
                  {(editFormData.type === 'image' ? testimonialCategories : bookCategories).map((cat) => (
                    <div key={cat.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`edit-cat-${cat.value}`}
                        checked={editFormData.categories.includes(cat.value)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setEditFormData({ 
                              ...editFormData, 
                              categories: [...editFormData.categories, cat.value] 
                            });
                          } else {
                            setEditFormData({ 
                              ...editFormData, 
                              categories: editFormData.categories.filter(c => c !== cat.value) 
                            });
                          }
                        }}
                      />
                      <label 
                        htmlFor={`edit-cat-${cat.value}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {language === 'mk' ? cat.mk : cat.en}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_keywords">{t('Клучни зборови', 'Keywords')}</Label>
              <Input
                id="edit_keywords"
                value={editFormData.keywords}
                onChange={(e) => setEditFormData({ ...editFormData, keywords: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_desc_mk">{t('Опис (МК)', 'Description (MK)')}</Label>
              <ReactQuill
                theme="snow"
                value={editFormData.description_mk}
                onChange={(value) => setEditFormData({ ...editFormData, description_mk: value })}
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
              <Label htmlFor="edit_desc_en">{t('Опис (EN)', 'Description (EN)')}</Label>
              <ReactQuill
                theme="snow"
                value={editFormData.description_en}
                onChange={(value) => setEditFormData({ ...editFormData, description_en: value })}
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

            {/* File uploads section */}
            <div className="space-y-4 border-t pt-4">
              <div className="space-y-2">
                <Label htmlFor="edit_thumbnail">{t('Нова сликичка (опционално)', 'New Thumbnail (optional)')}</Label>
                <Input
                  id="edit_thumbnail"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNewThumbnail(e.target.files?.[0] || null)}
                />
                {editingItem?.thumbnail && (
                  <p className="text-sm text-muted-foreground">
                    {t('Тековна сликичка е поставена', 'Current thumbnail is set')}
                  </p>
                )}
              </div>

              {editingItem?.type === 'book' && (
                <div className="space-y-2">
                  <Label htmlFor="edit_pdf">{t('Нов PDF (Опционално)', 'New PDF (Optional)')}</Label>
                  <Input
                    id="edit_pdf"
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setNewPdf(e.target.files?.[0] || null)}
                  />
                  {editingItem?.pdfUrl && (
                    <p className="text-sm text-muted-foreground">
                      {t('Тековниот PDF е поставен', 'Current PDF is set')}
                    </p>
                  )}
                </div>
              )}

              {editingItem?.type === 'image' && (
                <div className="space-y-2">
                  <Label htmlFor="edit_additional_images">{t('Дополнителни Слики (Опционално)', 'Additional Images (Optional)')}</Label>
                  <Input
                    id="edit_additional_images"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => setNewAdditionalImages(e.target.files ? Array.from(e.target.files) : [])}
                  />
                  <p className="text-sm text-muted-foreground">
                    {editingItem?.additionalImages && editingItem.additionalImages.length > 0
                      ? t(`Тековно има ${editingItem.additionalImages.length} дополнителни слики. Новите ќе бидат додадени.`, 
                          `Currently has ${editingItem.additionalImages.length} additional images. New ones will be added.`)
                      : t('Можете да додадете повеќе слики за галерија', 'You can add multiple images for the gallery')}
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditingItem(null)}>
                {t('Откажи', 'Cancel')}
              </Button>
              <Button onClick={handleSaveEdit} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('Се зачувува...', 'Saving...')}
                  </>
                ) : (
                  t('Зачувај', 'Save')
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('Дали сте сигурни?', 'Are you sure?')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t(
                'Оваа акција не може да се врати. Ставката ќе биде трајно избришана.',
                'This action cannot be undone. The item will be permanently deleted.'
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('Откажи', 'Cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              {t('Избриши', 'Delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
