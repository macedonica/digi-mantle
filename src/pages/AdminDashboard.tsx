import { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Library, LogOut, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { UploadForm } from '@/components/UploadForm';
import { AdminLibraryManager } from '@/components/AdminLibraryManager';
import { AdminOptionsManager } from '@/components/AdminOptionsManager';

const AdminDashboard = () => {
  const { user, signOut } = useAuth();
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleUploadSuccess = () => {
    setUploadDialogOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">
              {t('Админ Контролна Табла', 'Admin Dashboard')}
            </h1>
            <p className="text-muted-foreground">
              {t('Добредојдовте,', 'Welcome,')} {user?.email}
            </p>
          </div>

          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="upload">
                <Upload className="mr-2 h-4 w-4" />
                {t('Качување', 'Upload')}
              </TabsTrigger>
              <TabsTrigger value="manage">
                <Library className="mr-2 h-4 w-4" />
                {t('Управување', 'Manage')}
              </TabsTrigger>
              <TabsTrigger value="options">
                <Settings className="mr-2 h-4 w-4" />
                {t('Опции', 'Options')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="mt-6">
              <Card className="p-6 space-y-4">
                <div className="flex items-center space-x-3">
                  <Upload className="h-8 w-8 text-primary" />
                  <h2 className="text-2xl font-bold">
                    {t('Качи Содржина', 'Upload Content')}
                  </h2>
                </div>
                <p className="text-muted-foreground">
                  {t(
                    'Додајте нови книги и слики во библиотеката.',
                    'Add new books and images to the library.'
                  )}
                </p>
                <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="hero" className="w-full">
                      <Upload className="mr-2 h-4 w-4" />
                      {t('Почни Качување', 'Start Upload')}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{t('Качи Нова Ставка', 'Upload New Item')}</DialogTitle>
                    </DialogHeader>
                    <UploadForm onSuccess={handleUploadSuccess} />
                  </DialogContent>
                </Dialog>
              </Card>
            </TabsContent>

            <TabsContent value="manage" className="mt-6">
              <Card className="p-6 space-y-4">
                <div className="flex items-center space-x-3">
                  <Library className="h-8 w-8 text-primary" />
                  <h2 className="text-2xl font-bold">
                    {t('Управувај со Библиотека', 'Manage Library')}
                  </h2>
                </div>
                <p className="text-muted-foreground">
                  {t(
                    'Уредувај или избриши постоечки ставки.',
                    'Edit or delete existing items.'
                  )}
                </p>
                <AdminLibraryManager />
              </Card>
            </TabsContent>

            <TabsContent value="options" className="mt-6">
              <Card className="p-6 space-y-4">
                <div className="flex items-center space-x-3">
                  <Settings className="h-8 w-8 text-primary" />
                  <h2 className="text-2xl font-bold">
                    {t('Управувај со Опции', 'Manage Options')}
                  </h2>
                </div>
                <p className="text-muted-foreground">
                  {t(
                    'Додавај, уредувај или избриши јазици и категории.',
                    'Add, edit or delete languages and categories.'
                  )}
                </p>
                <AdminOptionsManager />
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-center mt-8">
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              {t('Одјави се', 'Sign Out')}
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
