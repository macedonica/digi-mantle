import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useLibraryLanguages, useLibraryCategories, useLibraryNewspapers, LibraryLanguage, LibraryCategory, LibraryNewspaper } from '@/hooks/useLibraryOptions';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, ChevronUp, ChevronDown, Languages, FolderOpen } from 'lucide-react';

export const AdminOptionsManager = () => {
  const { language, t } = useLanguage();
  const queryClient = useQueryClient();
  
  const { data: languages = [], isLoading: languagesLoading } = useLibraryLanguages(true);
  const { data: bookCategories = [], isLoading: bookCategoriesLoading } = useLibraryCategories('book', true);
  const { data: periodicalCategories = [], isLoading: periodicalCategoriesLoading } = useLibraryCategories('periodical', true);
  const { data: imageCategories = [], isLoading: imageCategoriesLoading } = useLibraryCategories('image', true);
  const { data: newspapers = [], isLoading: newspapersLoading } = useLibraryNewspapers(true);

  const [languageDialogOpen, setLanguageDialogOpen] = useState(false);
  const [newspaperDialogOpen, setNewspaperDialogOpen] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; type: 'language' | 'category' | 'newspaper' } | null>(null);

  const [editingLanguage, setEditingLanguage] = useState<LibraryLanguage | null>(null);
  const [editingNewspaper, setEditingNewspaper] = useState<LibraryNewspaper | null>(null);
  const [editingCategory, setEditingCategory] = useState<LibraryCategory | null>(null);

  const [languageForm, setLanguageForm] = useState({ name_mk: '', name_en: '', value: '' });
  const [newspaperForm, setNewspaperForm] = useState({ name_mk: '', name_en: '', value: '' });
  const [categoryForm, setCategoryForm] = useState({ name_mk: '', name_en: '', value: '', type: 'book' as 'book' | 'image' | 'periodical' });

  const handleSaveLanguage = async () => {
    if (!languageForm.name_mk || !languageForm.name_en || !languageForm.value) {
      toast({ title: t('Грешка', 'Error'), description: t('Пополнете ги сите полиња', 'Fill all fields'), variant: 'destructive' });
      return;
    }

    try {
      if (editingLanguage) {
        const { error } = await supabase
          .from('library_languages')
          .update({ name_mk: languageForm.name_mk, name_en: languageForm.name_en, value: languageForm.value })
          .eq('id', editingLanguage.id);
        if (error) throw error;
      } else {
        const maxOrder = Math.max(...languages.map(l => l.sort_order), 0);
        const { error } = await supabase
          .from('library_languages')
          .insert({ ...languageForm, sort_order: maxOrder + 1 });
        if (error) throw error;
      }
      
      queryClient.invalidateQueries({ queryKey: ['library-languages'] });
      setLanguageDialogOpen(false);
      setEditingLanguage(null);
      setLanguageForm({ name_mk: '', name_en: '', value: '' });
      toast({ title: t('Успех', 'Success'), description: t('Јазикот е зачуван', 'Language saved') });
    } catch (error: any) {
      toast({ title: t('Грешка', 'Error'), description: error.message, variant: 'destructive' });
    }
  };

  const handleSaveCategory = async () => {
    if (!categoryForm.name_mk || !categoryForm.name_en || !categoryForm.value || !categoryForm.type) {
      toast({ title: t('Грешка', 'Error'), description: t('Пополнете ги сите полиња', 'Fill all fields'), variant: 'destructive' });
      return;
    }

    try {
      if (editingCategory) {
        const { error } = await supabase
          .from('library_categories')
          .update({ name_mk: categoryForm.name_mk, name_en: categoryForm.name_en, value: categoryForm.value, type: categoryForm.type })
          .eq('id', editingCategory.id);
        if (error) throw error;
      } else {
        const relevantCategories = categoryForm.type === 'book' ? bookCategories : categoryForm.type === 'periodical' ? periodicalCategories : imageCategories;
        const maxOrder = Math.max(...relevantCategories.map(c => c.sort_order), 0);
        const { error } = await supabase
          .from('library_categories')
          .insert({ ...categoryForm, sort_order: maxOrder + 1 });
        if (error) throw error;
      }
      
      queryClient.invalidateQueries({ queryKey: ['library-categories'] });
      setCategoryDialogOpen(false);
      setEditingCategory(null);
      setCategoryForm({ name_mk: '', name_en: '', value: '', type: 'book' });
      toast({ title: t('Успех', 'Success'), description: t('Категоријата е зачувана', 'Category saved') });
    } catch (error: any) {
      toast({ title: t('Грешка', 'Error'), description: error.message, variant: 'destructive' });
    }
  };

  const handleSaveNewspaper = async () => {
    if (!newspaperForm.name_mk || !newspaperForm.name_en || !newspaperForm.value) {
      toast({ title: t('Грешка', 'Error'), description: t('Пополнете ги сите полиња', 'Fill all fields'), variant: 'destructive' });
      return;
    }

    try {
      if (editingNewspaper) {
        const { error } = await supabase
          .from('library_newspapers')
          .update({ name_mk: newspaperForm.name_mk, name_en: newspaperForm.name_en, value: newspaperForm.value })
          .eq('id', editingNewspaper.id);
        if (error) throw error;
      } else {
        const maxOrder = Math.max(...newspapers.map(n => n.sort_order), 0);
        const { error } = await supabase
          .from('library_newspapers')
          .insert({ ...newspaperForm, sort_order: maxOrder + 1 });
        if (error) throw error;
      }
      
      queryClient.invalidateQueries({ queryKey: ['library-newspapers'] });
      setNewspaperDialogOpen(false);
      setEditingNewspaper(null);
      setNewspaperForm({ name_mk: '', name_en: '', value: '' });
      toast({ title: t('Успех', 'Success'), description: t('Весникот е зачуван', 'Newspaper saved') });
    } catch (error: any) {
      toast({ title: t('Грешка', 'Error'), description: error.message, variant: 'destructive' });
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;

    try {
      const table = itemToDelete.type === 'language' ? 'library_languages' : itemToDelete.type === 'newspaper' ? 'library_newspapers' : 'library_categories';
      const { error } = await supabase.from(table).delete().eq('id', itemToDelete.id);
      if (error) throw error;

      const queryKey = itemToDelete.type === 'language' ? ['library-languages'] : itemToDelete.type === 'newspaper' ? ['library-newspapers'] : ['library-categories'];
      queryClient.invalidateQueries({ queryKey });
      toast({ title: t('Успех', 'Success'), description: t('Избришано', 'Deleted') });
    } catch (error: any) {
      toast({ title: t('Грешка', 'Error'), description: error.message, variant: 'destructive' });
    } finally {
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  const handleToggleActive = async (id: string, type: 'language' | 'category' | 'newspaper', currentStatus: boolean) => {
    try {
      const table = type === 'language' ? 'library_languages' : type === 'newspaper' ? 'library_newspapers' : 'library_categories';
      const { error } = await supabase.from(table).update({ is_active: !currentStatus }).eq('id', id);
      if (error) throw error;

      const queryKey = type === 'language' ? ['library-languages'] : type === 'newspaper' ? ['library-newspapers'] : ['library-categories'];
      queryClient.invalidateQueries({ queryKey });
      toast({ title: t('Успех', 'Success'), description: t('Статусот е променет', 'Status changed') });
    } catch (error: any) {
      toast({ title: t('Грешка', 'Error'), description: error.message, variant: 'destructive' });
    }
  };

  const handleReorder = async (id: string, type: 'language' | 'category' | 'newspaper', direction: 'up' | 'down') => {
    const items = type === 'language' ? languages : type === 'newspaper' ? newspapers : [...bookCategories, ...periodicalCategories, ...imageCategories];
    const currentIndex = items.findIndex(item => item.id === id);
    if (currentIndex === -1) return;

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    try {
      const table = type === 'language' ? 'library_languages' : type === 'newspaper' ? 'library_newspapers' : 'library_categories';
      const currentItem = items[currentIndex];
      const targetItem = items[targetIndex];

      await supabase.from(table).update({ sort_order: targetItem.sort_order }).eq('id', currentItem.id);
      await supabase.from(table).update({ sort_order: currentItem.sort_order }).eq('id', targetItem.id);

      const queryKey = type === 'language' ? ['library-languages'] : type === 'newspaper' ? ['library-newspapers'] : ['library-categories'];
      queryClient.invalidateQueries({ queryKey });
      toast({ title: t('Успех', 'Success'), description: t('Редоследот е променет', 'Order changed') });
    } catch (error: any) {
      toast({ title: t('Грешка', 'Error'), description: error.message, variant: 'destructive' });
    }
  };

  if (languagesLoading || bookCategoriesLoading || periodicalCategoriesLoading || imageCategoriesLoading || newspapersLoading) {
    return <div>{t('Се вчитува...', 'Loading...')}</div>;
  }

  return (
    <div className="space-y-8">
      {/* Languages Section */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Languages className="h-6 w-6 text-primary" />
            <h3 className="text-2xl font-bold">{t('Јазици', 'Languages')}</h3>
          </div>
          <Dialog open={languageDialogOpen} onOpenChange={setLanguageDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { setEditingLanguage(null); setLanguageForm({ name_mk: '', name_en: '', value: '' }); }}>
                <Plus className="mr-2 h-4 w-4" />
                {t('Додај Јазик', 'Add Language')}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingLanguage ? t('Уреди Јазик', 'Edit Language') : t('Додај Јазик', 'Add Language')}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>{t('Име (Македонски)', 'Name (Macedonian)')}</Label>
                  <Input value={languageForm.name_mk} onChange={(e) => setLanguageForm({ ...languageForm, name_mk: e.target.value })} />
                </div>
                <div>
                  <Label>{t('Име (Англиски)', 'Name (English)')}</Label>
                  <Input value={languageForm.name_en} onChange={(e) => setLanguageForm({ ...languageForm, name_en: e.target.value })} />
                </div>
                <div>
                  <Label>{t('Вредност', 'Value')}</Label>
                  <Input value={languageForm.value} onChange={(e) => setLanguageForm({ ...languageForm, value: e.target.value })} />
                </div>
                <Button onClick={handleSaveLanguage} className="w-full">{t('Зачувај', 'Save')}</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-2">
          {languages.map((lang, index) => (
            <div key={lang.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-4">
                <div>
                  <p className="font-medium">{language === 'mk' ? lang.name_mk : lang.name_en}</p>
                  <p className="text-sm text-muted-foreground">{lang.value}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch checked={lang.is_active} onCheckedChange={() => handleToggleActive(lang.id, 'language', lang.is_active)} />
                <Button variant="ghost" size="icon" onClick={() => handleReorder(lang.id, 'language', 'up')} disabled={index === 0}>
                  <ChevronUp className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleReorder(lang.id, 'language', 'down')} disabled={index === languages.length - 1}>
                  <ChevronDown className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => { setEditingLanguage(lang); setLanguageForm({ name_mk: lang.name_mk, name_en: lang.name_en, value: lang.value }); setLanguageDialogOpen(true); }}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => { setItemToDelete({ id: lang.id, type: 'language' }); setDeleteDialogOpen(true); }}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Newspapers Section */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <FolderOpen className="h-6 w-6 text-primary" />
            <h3 className="text-2xl font-bold">{t('Весници за Периодика', 'Newspapers for Periodicals')}</h3>
          </div>
          <Dialog open={newspaperDialogOpen} onOpenChange={setNewspaperDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { setEditingNewspaper(null); setNewspaperForm({ name_mk: '', name_en: '', value: '' }); }}>
                <Plus className="mr-2 h-4 w-4" />
                {t('Додај Весник', 'Add Newspaper')}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingNewspaper ? t('Уреди Весник', 'Edit Newspaper') : t('Додај Весник', 'Add Newspaper')}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>{t('Име (Македонски)', 'Name (Macedonian)')}</Label>
                  <Input value={newspaperForm.name_mk} onChange={(e) => setNewspaperForm({ ...newspaperForm, name_mk: e.target.value })} />
                </div>
                <div>
                  <Label>{t('Име (Англиски)', 'Name (English)')}</Label>
                  <Input value={newspaperForm.name_en} onChange={(e) => setNewspaperForm({ ...newspaperForm, name_en: e.target.value })} />
                </div>
                <div>
                  <Label>{t('Вредност', 'Value')}</Label>
                  <Input value={newspaperForm.value} onChange={(e) => setNewspaperForm({ ...newspaperForm, value: e.target.value })} />
                </div>
                <Button onClick={handleSaveNewspaper} className="w-full">{t('Зачувај', 'Save')}</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-2">
          {newspapers.map((newspaper, index) => (
            <div key={newspaper.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-4">
                <div>
                  <p className="font-medium">{language === 'mk' ? newspaper.name_mk : newspaper.name_en}</p>
                  <p className="text-sm text-muted-foreground">{newspaper.value}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch checked={newspaper.is_active} onCheckedChange={() => handleToggleActive(newspaper.id, 'newspaper', newspaper.is_active)} />
                <Button variant="ghost" size="icon" onClick={() => handleReorder(newspaper.id, 'newspaper', 'up')} disabled={index === 0}>
                  <ChevronUp className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleReorder(newspaper.id, 'newspaper', 'down')} disabled={index === newspapers.length - 1}>
                  <ChevronDown className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => { setEditingNewspaper(newspaper); setNewspaperForm({ name_mk: newspaper.name_mk, name_en: newspaper.name_en, value: newspaper.value }); setNewspaperDialogOpen(true); }}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => { setItemToDelete({ id: newspaper.id, type: 'newspaper' }); setDeleteDialogOpen(true); }}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Categories Section */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <FolderOpen className="h-6 w-6 text-primary" />
            <h3 className="text-2xl font-bold">{t('Категории', 'Categories')}</h3>
          </div>
          <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { setEditingCategory(null); setCategoryForm({ name_mk: '', name_en: '', value: '', type: 'book' }); }}>
                <Plus className="mr-2 h-4 w-4" />
                {t('Додај Категорија', 'Add Category')}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingCategory ? t('Уреди Категорија', 'Edit Category') : t('Додај Категорија', 'Add Category')}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>{t('Тип', 'Type')}</Label>
                  <Select value={categoryForm.type} onValueChange={(value: 'book' | 'image' | 'periodical') => setCategoryForm({ ...categoryForm, type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="book">{t('Книга', 'Book')}</SelectItem>
                      <SelectItem value="periodical">{t('Периодика', 'Periodical')}</SelectItem>
                      <SelectItem value="image">{t('Слика', 'Image')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>{t('Име (Македонски)', 'Name (Macedonian)')}</Label>
                  <Input value={categoryForm.name_mk} onChange={(e) => setCategoryForm({ ...categoryForm, name_mk: e.target.value })} />
                </div>
                <div>
                  <Label>{t('Име (Англиски)', 'Name (English)')}</Label>
                  <Input value={categoryForm.name_en} onChange={(e) => setCategoryForm({ ...categoryForm, name_en: e.target.value })} />
                </div>
                <div>
                  <Label>{t('Вредност', 'Value')}</Label>
                  <Input value={categoryForm.value} onChange={(e) => setCategoryForm({ ...categoryForm, value: e.target.value })} />
                </div>
                <Button onClick={handleSaveCategory} className="w-full">{t('Зачувај', 'Save')}</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-6">
          <div>
            <h4 className="font-semibold mb-3">{t('Категории за Книги', 'Book Categories')}</h4>
            <div className="space-y-2">
              {bookCategories.map((cat, index) => (
                <div key={cat.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div>
                      <p className="font-medium">{language === 'mk' ? cat.name_mk : cat.name_en}</p>
                      <p className="text-sm text-muted-foreground">{cat.value}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch checked={cat.is_active} onCheckedChange={() => handleToggleActive(cat.id, 'category', cat.is_active)} />
                    <Button variant="ghost" size="icon" onClick={() => handleReorder(cat.id, 'category', 'up')} disabled={index === 0}>
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleReorder(cat.id, 'category', 'down')} disabled={index === bookCategories.length - 1}>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => { setEditingCategory(cat); setCategoryForm({ name_mk: cat.name_mk, name_en: cat.name_en, value: cat.value, type: cat.type }); setCategoryDialogOpen(true); }}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => { setItemToDelete({ id: cat.id, type: 'category' }); setDeleteDialogOpen(true); }}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3">{t('Категории за Периодика', 'Periodical Categories')}</h4>
            <div className="space-y-2">
              {periodicalCategories.map((cat, index) => (
                <div key={cat.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div>
                      <p className="font-medium">{language === 'mk' ? cat.name_mk : cat.name_en}</p>
                      <p className="text-sm text-muted-foreground">{cat.value}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch checked={cat.is_active} onCheckedChange={() => handleToggleActive(cat.id, 'category', cat.is_active)} />
                    <Button variant="ghost" size="icon" onClick={() => handleReorder(cat.id, 'category', 'up')} disabled={index === 0}>
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleReorder(cat.id, 'category', 'down')} disabled={index === periodicalCategories.length - 1}>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => { setEditingCategory(cat); setCategoryForm({ name_mk: cat.name_mk, name_en: cat.name_en, value: cat.value, type: cat.type }); setCategoryDialogOpen(true); }}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => { setItemToDelete({ id: cat.id, type: 'category' }); setDeleteDialogOpen(true); }}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3">{t('Категории за Слики', 'Image Categories')}</h4>
            <div className="space-y-2">
              {imageCategories.map((cat, index) => (
                <div key={cat.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div>
                      <p className="font-medium">{language === 'mk' ? cat.name_mk : cat.name_en}</p>
                      <p className="text-sm text-muted-foreground">{cat.value}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch checked={cat.is_active} onCheckedChange={() => handleToggleActive(cat.id, 'category', cat.is_active)} />
                    <Button variant="ghost" size="icon" onClick={() => handleReorder(cat.id, 'category', 'up')} disabled={index === 0}>
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleReorder(cat.id, 'category', 'down')} disabled={index === imageCategories.length - 1}>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => { setEditingCategory(cat); setCategoryForm({ name_mk: cat.name_mk, name_en: cat.name_en, value: cat.value, type: cat.type }); setCategoryDialogOpen(true); }}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => { setItemToDelete({ id: cat.id, type: 'category' }); setDeleteDialogOpen(true); }}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('Потврди Бришење', 'Confirm Delete')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('Дали сте сигурни дека сакате да го избришете ова?', 'Are you sure you want to delete this?')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('Откажи', 'Cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>{t('Избриши', 'Delete')}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
