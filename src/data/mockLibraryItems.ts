import book1 from '@/assets/book1.jpg';
import book2 from '@/assets/book2.jpg';
import map1 from '@/assets/map1.jpg';
import ilinden1 from '@/assets/ilinden1.jpg';
import culture1 from '@/assets/culture1.jpg';
import personality1 from '@/assets/personality1.jpg';

export interface LibraryItem {
  id: string;
  type: 'book' | 'image';
  title: { mk: string; en: string };
  author: string;
  authorEn?: string;
  year: number;
  language: string[];
  keywords: string[];
  description: { mk: string; en: string };
  thumbnail: string;
  pdfUrl?: string;
  imageUrl?: string;
  category: string;
  publicationCity?: string;
  publicationCityEn?: string;
  publisher?: string;
  publisherEn?: string;
}

export const mockLibraryItems: LibraryItem[] = [
  {
    id: '1',
    type: 'book',
    title: {
      mk: 'Документи од Илинденското Востание',
      en: 'Documents of the Ilinden Uprising'
    },
    author: 'Историски Архив',
    year: 1903,
    language: ['Macedonian'],
    keywords: ['илинден', 'востание', 'историја', 'ilinden', 'uprising', 'history'],
    description: {
      mk: 'Ова е збирка на автентични документи од Илинденското востание од 1903 година, која претставува значајна колекција на историски материјали од национално значење. Документите ги опфаќаат пораките, писмата и службените записи од тоа време.',
      en: 'This is a collection of authentic documents from the Ilinden Uprising of 1903, representing a significant collection of historical materials of national importance. The documents include messages, letters, and official records from that time.'
    },
    thumbnail: ilinden1,
    pdfUrl: '#',
    category: 'history'
  },
  {
    id: '2',
    type: 'book',
    title: {
      mk: 'Антологија на Македонска Поезија',
      en: 'Anthology of Macedonian Poetry'
    },
    author: 'Различни Автори',
    year: 1952,
    language: ['Macedonian'],
    keywords: ['поезија', 'литература', 'антологија', 'poetry', 'literature', 'anthology'],
    description: {
      mk: 'Сеопфатна збирка на македонска поезија од различни периоди и автори. Книгата содржи дела од најзначајните македонски поети и претставува важен придонес кон националната литература.',
      en: 'A comprehensive collection of Macedonian poetry from different periods and authors. The book contains works from the most significant Macedonian poets and represents an important contribution to national literature.'
    },
    thumbnail: book2,
    pdfUrl: '#',
    category: 'poetry'
  },
  {
    id: '3',
    type: 'image',
    title: {
      mk: 'Историска Карта на Македонија',
      en: 'Historical Map of Macedonia'
    },
    author: 'Картографски Институт',
    year: 1920,
    language: ['Various'],
    keywords: ['карта', 'географија', 'историја', 'map', 'geography', 'history'],
    description: {
      mk: 'Детална историска карта на Македонија од почетокот на 20 век, прикажувајќи територијални граници и важни географски локации од тоа време.',
      en: 'A detailed historical map of Macedonia from the early 20th century, showing territorial boundaries and important geographical locations from that period.'
    },
    thumbnail: map1,
    imageUrl: map1,
    category: 'history'
  },
  {
    id: '4',
    type: 'book',
    title: {
      mk: 'Древни Македонски Ракописи',
      en: 'Ancient Macedonian Manuscripts'
    },
    author: 'Манастирска Библиотека',
    year: 1450,
    language: ['Old Church Slavonic'],
    keywords: ['ракопис', 'религија', 'историја', 'manuscript', 'religion', 'history'],
    description: {
      mk: 'Овој ракопис претставува редок пример на средновековна македонска писменост, чуван во манастирската библиотека со векови. Содржи религиозни текстови и историски записи.',
      en: 'This manuscript represents a rare example of medieval Macedonian literacy, preserved in the monastery library for centuries. It contains religious texts and historical records.'
    },
    thumbnail: book1,
    pdfUrl: '#',
    category: 'history'
  },
  {
    id: '5',
    type: 'image',
    title: {
      mk: 'Македонска Народна Везба',
      en: 'Macedonian Folk Embroidery'
    },
    author: 'Етнографски Музеј',
    year: 1880,
    language: ['Visual'],
    keywords: ['култура', 'везба', 'традиција', 'culture', 'embroidery', 'tradition'],
    description: {
      mk: 'Традиционални македонски шари и мотиви од народната везба, претставувајќи богато културно наследство и уметнички изразувања на македонскиот народ.',
      en: 'Traditional Macedonian patterns and motifs from folk embroidery, representing the rich cultural heritage and artistic expressions of the Macedonian people.'
    },
    thumbnail: culture1,
    imageUrl: culture1,
    category: 'culture'
  },
  {
    id: '6',
    type: 'image',
    title: {
      mk: 'Портрет на Македонски Интелектуалец',
      en: 'Portrait of a Macedonian Intellectual'
    },
    author: 'Фотографски Студио',
    year: 1910,
    language: ['Visual'],
    keywords: ['личност', 'портрет', 'историја', 'personality', 'portrait', 'history'],
    description: {
      mk: 'Историска фотографија на истакнат македонски интелектуалец од почетокот на 20 век, документирајќи го образованото општество од тоа време.',
      en: 'Historical photograph of a prominent Macedonian intellectual from the early 20th century, documenting the educated society of that time.'
    },
    thumbnail: personality1,
    imageUrl: personality1,
    category: 'personalities'
  }
];
