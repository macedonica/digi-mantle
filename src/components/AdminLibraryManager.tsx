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
  year: z.number().int().min(1000, 'Year must be at least 1000').max(new Date().getFullYear() + 1, 'Year cannot be in the future'),
  languages: z.array(z.string()).min(1, 'At least one language is required'),
  categories: z.array(z.string()).min(1, 'At least one category is required'),
  type: z.string().min(1, 'Type is required'),
  description_mk: z.string().max(50000, 'Description (MK) must be less than 50,000 characters').optional(),
  description_en: z.string().max(50000, 'Description (EN) must be less than 50,000 characters').optional(),
  keywords: z.string().max(1000, 'Keywords must be less than 1,000 characters').optional(),
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

  const [editFormData, setEditFormData] = useState({
    title_mk: '',
    title_en: '',
    author: '',
    author_en: '',
    year: new Date().getFullYear(),
    languages: [] as string[],
    categories: [] as string[],
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

  const availableCategories = [
    { value: 'history', mk: 'Историја', en: 'History' },
    { value: 'archaeology', mk: 'Археологија', en: 'Archaeology' },
    { value: 'literature', mk: 'Книжевност', en: 'Literature' },
    { value: 'ethnology', mk: 'Етнологија', en: 'Ethnology' },
    { value: 'folklore', mk: 'Фолклор', en: 'Folklore' },
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
        publisherEn: item.publisher_en
      }));
      setItems(transformedItems);
    }
    setLoading(false);
  };

  const handleEdit = (item: LibraryItem) => {
    setEditingItem(item);
    setEditFormData({
      title_mk: item.title.mk,
      title_en: item.title.en,
      author: item.author,
      author_en: item.authorEn || '',
      year: item.year,
      languages: item.language,
      categories: item.category,
      type: item.type,
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
        
        thumbnailUrl = publicUrl;
      }

      const { error } = await supabase
        .from('library_items')
        .update({
          title_mk: editFormData.title_mk,
          title_en: editFormData.title_en,
          author: editFormData.author,
          author_en: editFormData.author_en,
          year: editFormData.year,
          language: editFormData.languages,
          category: editFormData.categories,
          type: editFormData.type,
          description_mk: editFormData.description_mk || null,
          description_en: editFormData.description_en || null,
          keywords: editFormData.keywords ? editFormData.keywords.split(',').map(k => k.trim()) : null,
          publication_city: editFormData.publication_city || null,
          publication_city_en: editFormData.publication_city_en || null,
          publisher: editFormData.publisher || null,
          publisher_en: editFormData.publisher_en || null,
          thumbnail_url: thumbnailUrl,
        })
        .eq('id', editingItem.id);

      if (error) throw error;

      toast({
        title: t('Успешно', 'Success'),
        description: t('Ставката е ажурирана', 'Item has been updated'),
      });

      setEditingItem(null);
      setNewThumbnail(null);
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
                <Label htmlFor="edit_year">{t('Година', 'Year')}</Label>
                <Input
                  id="edit_year"
                  type="number"
                  value={editFormData.year}
                  onChange={(e) => setEditFormData({ ...editFormData, year: parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label>{t('Јазици', 'Languages')}</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 border rounded-lg">
                  {availableLanguages.map((lang) => (
                    <div key={lang} className="flex items-center space-x-2">
                      <Checkbox
                        id={`edit-lang-${lang}`}
                        checked={editFormData.languages.includes(lang)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setEditFormData({ 
                              ...editFormData, 
                              languages: [...editFormData.languages, lang] 
                            });
                          } else {
                            setEditFormData({ 
                              ...editFormData, 
                              languages: editFormData.languages.filter(l => l !== lang) 
                            });
                          }
                        }}
                      />
                      <label 
                        htmlFor={`edit-lang-${lang}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {lang}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t('Категории', 'Categories')}</Label>
                <div className="grid grid-cols-2 gap-4 p-4 border rounded-lg">
                  {availableCategories.map((cat) => (
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
