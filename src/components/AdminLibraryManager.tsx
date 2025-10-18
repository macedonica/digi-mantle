import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Pencil, Trash2, Loader2 } from 'lucide-react';
import type { LibraryItem } from '@/data/mockLibraryItems';

export const AdminLibraryManager = () => {
  const { language, t } = useLanguage();
  const { toast } = useToast();
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<LibraryItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [editFormData, setEditFormData] = useState({
    title_mk: '',
    title_en: '',
    author: '',
    year: new Date().getFullYear(),
    languages: [] as string[],
    category: '',
    type: '',
    description_mk: '',
    description_en: '',
    keywords: '',
    publication_city: '',
    publisher: '',
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
        year: item.year,
        language: item.language,
        keywords: item.keywords || [],
        description: { mk: item.description_mk || '', en: item.description_en || '' },
        thumbnail: item.thumbnail_url,
        pdfUrl: item.pdf_url || undefined,
        imageUrl: item.image_url || undefined,
        category: item.category,
        publicationCity: item.publication_city,
        publisher: item.publisher
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
      year: item.year,
      languages: item.language,
      category: item.category,
      type: item.type,
      description_mk: item.description.mk,
      description_en: item.description.en,
      keywords: item.keywords.join(', '),
      publication_city: item.publicationCity || '',
      publisher: item.publisher || '',
    });
  };

  const handleSaveEdit = async () => {
    if (!editingItem) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('library_items')
        .update({
          title_mk: editFormData.title_mk,
          title_en: editFormData.title_en,
          author: editFormData.author,
          year: editFormData.year,
          language: editFormData.languages,
          category: editFormData.category,
          type: editFormData.type,
          description_mk: editFormData.description_mk || null,
          description_en: editFormData.description_en || null,
          keywords: editFormData.keywords ? editFormData.keywords.split(',').map(k => k.trim()) : null,
          publication_city: editFormData.publication_city || null,
          publisher: editFormData.publisher || null,
        })
        .eq('id', editingItem.id);

      if (error) throw error;

      toast({
        title: t('Успешно', 'Success'),
        description: t('Ставката е ажурирана', 'Item has been updated'),
      });

      setEditingItem(null);
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
      <Dialog open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('Уреди Ставка', 'Edit Item')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
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
                <Label htmlFor="edit_author">{t('Автор', 'Author')}</Label>
                <Input
                  id="edit_author"
                  value={editFormData.author}
                  onChange={(e) => setEditFormData({ ...editFormData, author: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_publisher">{t('Издавач', 'Published By')}</Label>
                <Input
                  id="edit_publisher"
                  value={editFormData.publisher}
                  onChange={(e) => setEditFormData({ ...editFormData, publisher: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_publication_city">{t('Град на издавање', 'Publication City')}</Label>
                <Input
                  id="edit_publication_city"
                  value={editFormData.publication_city}
                  onChange={(e) => setEditFormData({ ...editFormData, publication_city: e.target.value })}
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
                <Label htmlFor="edit_category">{t('Категорија', 'Category')}</Label>
                <Select value={editFormData.category} onValueChange={(value) => setEditFormData({ ...editFormData, category: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="history">History</SelectItem>
                    <SelectItem value="culture">Culture</SelectItem>
                    <SelectItem value="geography">Geography</SelectItem>
                    <SelectItem value="personalities">Personalities</SelectItem>
                  </SelectContent>
                </Select>
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
              <Textarea
                id="edit_desc_mk"
                value={editFormData.description_mk}
                onChange={(e) => setEditFormData({ ...editFormData, description_mk: e.target.value })}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_desc_en">{t('Опис (EN)', 'Description (EN)')}</Label>
              <Textarea
                id="edit_desc_en"
                value={editFormData.description_en}
                onChange={(e) => setEditFormData({ ...editFormData, description_en: e.target.value })}
                rows={3}
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
