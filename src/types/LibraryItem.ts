export interface LibraryItem {
  id: string;
  type: 'book' | 'image' | 'periodical';
  title: { mk: string; en: string };
  author: string;
  authorEn?: string;
  year?: number | string; // Kept for backward compatibility
  yearMk?: string;
  yearEn?: string;
  typeMk?: string;
  typeEn?: string;
  sourceMk?: string;
  sourceEn?: string;
  language: string[];
  keywords: string[];
  description: { mk: string; en: string };
  thumbnail: string;
  pdfUrl?: string;
  imageUrl?: string;
  category: string[];
  publicationCity?: string;
  publicationCityEn?: string;
  publisher?: string;
  publisherEn?: string;
  additionalImages?: string[];
  issueNumberMk?: string;
  issueNumberEn?: string;
  watermarkUrl?: string;
  watermarkLink?: string;
}
