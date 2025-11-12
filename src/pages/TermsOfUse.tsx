import { useLanguage } from '@/contexts/LanguageContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ScrollArea } from '@/components/ui/scroll-area';

const TermsOfUse = () => {
  const { language } = useLanguage();

  const contentMK = `
# 📄 Услови за користење

**Датум на стапување во сила: 8 Ноември, 2025**

Добредојдовте на **bibliothecamacedonica.com**, непрофитна дигитална платформа посветена на зачувување и споделување на македонската историја, култура и наследство преку дигитализирани книги, весници, фотографии и архивски фрагменти. Со пристапување и користење на оваа веб-страница, се согласувате со следниве Услови за користење:

## 1. Цел и мисија

Целта на библиотеката е да го поддржи образованието во Македонија, да зачува историски и културни материјали, да овозможи истражување и да промовира пристап до ретки документи.

## 2. Користење на материјалите

Сите содржини се достапни само за едукативни, истражувачки и некомерцијални цели.

**Дозволено е:**
- Прегледување, преземање и споделување за лична или академска употреба со соодветна атрибуција

**Не е дозволено:**
- Комерцијална употреба
- Измена или препубликување без дозвола
- Отстранување или прикривање на авторски права

## 3. Дозволите не се преносливи

Дозволите добиени од носители на права важат само за оваа веб-страница. Тие не се преносливи на посетители или трети страни. Повторна употреба бара посебна дозвола од оригиналниот носител на права.

## 4. Однесување на корисници

Корисниците мора да се однесуваат законски и со почит. Злоупотреба може да доведе до ограничување на пристапот или правни последици.

## 5. Одговорност

Се стремиме кон точност, но не гарантираме дека сите содржини се без грешки. Некои материјали може да содржат застарени или контроверзни ставови.

## 6. Промени на условите

Овие услови може да се ажурираат. Продолженото користење значи прифаќање на промените.

---

# 📜 Авторски права и интелектуална сопственост

**Датум на стапување во сила: 8 Ноември, 2025**

**bibliothecamacedonica.com** ги почитува авторските права и интелектуалната сопственост на автори, издавачи и носители на права.

## 1. Статус на авторски права

Колекцијата вклучува:
- Дела во јавен домен
- Дела со експлицитна дозвола
- Дела за кои не е добиен одговор на барање за дозвола
- Дела за кои не можевме да ги идентификуваме или контактираме носителите на права, и покрај разумни напори

## 2. Добра волја и фер употреба

Работиме со добра волја и се повикуваме на фер употреба и образовни исклучоци, особено за историски материјали и дела со непознати или недостапни носители на авторски права („orphan works").

## 3. Атрибуција

Каде што е можно, даваме целосна атрибуција на автори, фотографи, издавачи и институции.

## 4. Барања за отстранување

Ако сте носител на права и сметате дека вашето дело е користено без соодветна дозвола или атрибуција, контактирајте нѐ на b.macedonica@gmail.com. Ќе го разгледаме барањето и ќе постапиме соодветно.

## 5. Права на придонесувачи

Придонесувачите ги задржуваат авторските права и можат да ги дефинираат условите за користење.

## 6. Дозволите не се преносливи

Дозволите дадени на **bibliothecamacedonica.com** се ограничени само на овој проект и не овозможуваат повторна употреба од други. Посетителите мора самостојно да побараат дозвола за дистрибуција.

---

# 🔐 Политика за приватност

**Датум на стапување во сила: 8 Ноември, 2025**

**bibliothecamacedonica.com** се обврзува да ја заштити приватноста на корисниците. Ние не собираме лични податоци, не следиме IP адреси и не користиме колачиња.

## 1. Нема собирање на податоци

Ние не следиме, не складираме и не обработуваме никакви лични информации од посетителите на веб-страницата.

## 2. Доброволен контакт

Ако одлучите да нѐ контактирате (на пример, за барање за отстранување или придонес), вашите информации ќе ги користиме само за да одговориме на вашето барање. Нема да ги споделиме со трети страни.

## 3. Без следење од трети страни

Не користиме алатки за анализа, рекламни мрежи или технологии за следење од трети страни.

## 4. Ажурирања на политиката

Доколку се променат нашите практики, ќе ја ажурираме оваа политика и ќе ги известиме корисниците преку веб-страницата.

---

# 📬 Контакт

Доколку имате прашања, повратни информации или грижи во врска со авторски права, приватност или содржина на оваа веб-страница, контактирајте нѐ на:

**Е-пошта: b.macedonica@gmail.com**

Се стремиме да одговориме на сите барања во рок од 7 работни дена.

**За барања за отстранување, ве молиме наведете:**
- Вашето име
- Контакт информации
- Опис на материјалот
- Доказ за носителство на права
  `;

  const contentEN = `
# 📄 Terms of Use

**Effective Date: November 8, 2025**

Welcome to **bibliothecamacedonica.com**, a non-profit digital archive dedicated to preserving and sharing Macedonian history, culture, and heritage through digitized books, newspapers, photographs, and archival snippets. By accessing or using this website, you agree to the following Terms of Use:

## 1. Purpose and Mission

This digital library exists to support education in Macedonia, preserve historical and cultural materials, facilitate research, and promote access to rare documents.

## 2. Use of Materials

All content is for educational, research, and non-commercial purposes only.

**You may:**
- View, download, and share materials for personal or academic use with proper attribution

**You may not:**
- Use materials for commercial gain
- Alter or republish materials without permission
- Remove or obscure copyright notices

## 3. Permissions Are Non-Transferable

Permissions granted to **bibliothecamacedonica.com** by rights holders apply only to this website. They do not extend to visitors or third parties. Reuse or redistribution requires separate permission from the original rights holder.

## 4. User Conduct

Users must act lawfully and respectfully. Misuse may result in restricted access or legal action.

## 5. Disclaimer

We strive for accuracy but cannot guarantee all content is error-free. Some materials may reflect outdated or controversial views.

## 6. Changes to Terms

These terms may be updated. Continued use implies acceptance of changes.

---

# 📜 Copyright and Intellectual Property

**Effective Date: November 8, 2025**

**bibliothecamacedonica.com** respects the intellectual property rights of authors, publishers, and rights holders.

## 1. Copyright Status

Our collection includes:
- Public domain works
- Works with explicit permission
- Works with no response to permission requests
- Works where rights holders could not be identified or located after reasonable efforts

## 2. Good Faith and Fair Use

We act in good faith and rely on fair use and educational exemptions, especially for historical materials and works with unknown or unreachable copyright holders ("orphan works").

## 3. Attribution

Where known, we provide full credit to authors, photographers, publishers, and institutions.

## 4. Takedown Requests

If you are a rights holder and believe your work is used without proper permission or credit, contact us at b.macedonica@gmail.com. We will review and act promptly.

## 5. Contributor Rights

Contributors retain copyright and may define usage terms.

## 6. Permissions Are Non-Transferable

Permissions granted to **bibliothecamacedonica.com** are limited to this project and do not authorize reuse by others. Visitors must seek separate permission for redistribution.

---

# 🔐 Privacy Policy

**Effective Date: November 8, 2025**

**bibliothecamacedonica.com** is committed to protecting user privacy. We do not collect personal data, IP addresses, or use cookies.

## 1. No Data Collection

We do not track, store, or process any personal information from visitors.

## 2. Voluntary Contact Only

If you contact us (e.g., for takedown or contributions), we use your info only to respond.

## 3. No Third-Party Tracking

We do not use analytics tools, advertising networks, or third-party trackers.

## 4. Updates to This Policy

If our practices change, we will update this policy and notify users on the website.

---

# 📬 Contact

If you have questions, feedback, or concerns about copyright, privacy, or content on this website, please contact us at:

**Email: b.macedonica@gmail.com**

We aim to respond within 7 working days.

**For takedown requests, please include:**
- Your name
- Contact information
- Description of the material
- Proof of rights
  `;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="prose prose-sm md:prose-base max-w-4xl mx-auto dark:prose-invert">
            <div 
              className="whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ 
                __html: language === 'mk' ? contentMK.split('\n').map(line => {
                  if (line.startsWith('# ')) return `<h1 class="text-3xl font-bold mt-8 mb-4">${line.slice(2)}</h1>`;
                  if (line.startsWith('## ')) return `<h2 class="text-2xl font-semibold mt-6 mb-3">${line.slice(3)}</h2>`;
                  if (line.startsWith('**') && line.endsWith('**')) return `<p class="font-bold mt-4">${line.slice(2, -2)}</p>`;
                  if (line.startsWith('- ')) return `<li class="ml-6">${line.slice(2)}</li>`;
                  if (line === '---') return `<hr class="my-8" />`;
                  if (line.trim() === '') return '<br />';
                  return `<p class="mb-2">${line}</p>`;
                }).join('') : contentEN.split('\n').map(line => {
                  if (line.startsWith('# ')) return `<h1 class="text-3xl font-bold mt-8 mb-4">${line.slice(2)}</h1>`;
                  if (line.startsWith('## ')) return `<h2 class="text-2xl font-semibold mt-6 mb-3">${line.slice(3)}</h2>`;
                  if (line.startsWith('**') && line.endsWith('**')) return `<p class="font-bold mt-4">${line.slice(2, -2)}</p>`;
                  if (line.startsWith('- ')) return `<li class="ml-6">${line.slice(2)}</li>`;
                  if (line === '---') return `<hr class="my-8" />`;
                  if (line.trim() === '') return '<br />';
                  return `<p class="mb-2">${line}</p>`;
                }).join('')
              }}
            />
          </div>
        </ScrollArea>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfUse;