import { useLocation, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center py-16">
        <div className="text-center space-y-6">
          <h1 className="text-6xl font-bold text-primary">404</h1>
          <h2 className="text-2xl font-semibold">
            {t("Страницата не е пронајдена", "Page not found")}
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            {t(
              `Страницата "${location.pathname}" не постои.`,
              `The page "${location.pathname}" does not exist.`
            )}
          </p>
          <Link to="/">
            <Button variant="hero" size="lg">
              <Home className="mr-2 h-4 w-4" />
              {t("Назад на почетна", "Back to Home")}
            </Button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
