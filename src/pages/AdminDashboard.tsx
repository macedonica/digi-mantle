import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, Library, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { user, signOut } = useAuth();
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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
              <Button variant="hero" className="w-full">
                <Upload className="mr-2 h-4 w-4" />
                {t('Почни Качување', 'Start Upload')}
              </Button>
            </Card>

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
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate(language === 'mk' ? '/библиотека' : '/library')}
              >
                <Library className="mr-2 h-4 w-4" />
                {t('Отвори Библиотека', 'Open Library')}
              </Button>
            </Card>
          </div>

          <div className="flex justify-center">
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
