import { Helmet } from "react-helmet-async";

interface SEOHeadProps {
  title: string;
  titleMk?: string;
  description: string;
  descriptionMk?: string;
  keywords?: string;
  canonicalPath?: string;
  type?: "website" | "article";
  image?: string;
  noindex?: boolean;
  structuredData?: object;
}

const BASE_URL = "https://bibliothecamacedonica.com";

export const SEOHead = ({
  title,
  titleMk,
  description,
  descriptionMk,
  keywords,
  canonicalPath = "",
  type = "website",
  image = "/favicon.png",
  noindex = false,
  structuredData,
}: SEOHeadProps) => {
  const fullUrl = `${BASE_URL}${canonicalPath}`;
  const fullImageUrl = image.startsWith("http") ? image : `${BASE_URL}${image}`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />
      
      {/* Bilingual hreflang tags */}
      <link rel="alternate" hrefLang="mk" href={fullUrl} />
      <link rel="alternate" hrefLang="en" href={fullUrl} />
      <link rel="alternate" hrefLang="x-default" href={fullUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:locale" content="mk_MK" />
      <meta property="og:locale:alternate" content="en_US" />
      <meta property="og:site_name" content="Bibliotheca Macedonica" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      
      {/* Robots */}
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

// Reusable structured data generators
export const getOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "ArchiveOrganization",
  "name": "Bibliotheca Macedonica | Дигитален Архив",
  "alternateName": "Digital Archive - Macedonian Cultural Heritage",
  "url": "https://bibliothecamacedonica.com",
  "logo": "https://bibliothecamacedonica.com/favicon.png",
  "description": "Digital archive dedicated to preserving and sharing Macedonian cultural heritage through digitized books, manuscripts, images and historical documents.",
  "foundingDate": "2020",
  "knowsAbout": [
    "Macedonian History",
    "Macedonian Culture",
    "Ilinden Uprising",
    "VMRO",
    "Macedonian Literature",
    "Ottoman Macedonia",
    "Aegean Macedonia",
    "Macedonian Language"
  ],
  "sameAs": []
});

export const getCollectionPageSchema = (itemCount: number) => ({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "Библиотека | Library - Bibliotheca Macedonica",
  "description": "Browse our collection of digitized Macedonian books, periodicals, manuscripts and historical images.",
  "numberOfItems": itemCount,
  "isPartOf": {
    "@type": "ArchiveOrganization",
    "name": "Bibliotheca Macedonica"
  }
});

export const getArchiveItemSchema = (item: {
  title: string;
  titleMk: string;
  author?: string;
  year?: string;
  description?: string;
  type: string;
  url: string;
  image?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "ArchiveComponent",
  "name": item.title,
  "alternateName": item.titleMk,
  "author": item.author ? { "@type": "Person", "name": item.author } : undefined,
  "dateCreated": item.year,
  "description": item.description,
  "holdingArchive": {
    "@type": "ArchiveOrganization",
    "name": "Bibliotheca Macedonica"
  },
  "url": item.url,
  "image": item.image,
  "inLanguage": ["mk", "en"]
});

export const getBreadcrumbSchema = (items: { name: string; url: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }))
});
