import { useLanguage } from "@/contexts/LanguageContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import koleMangov from "@/assets/kole-mangov.jpg";
import koleMangov1 from "@/assets/kole-mangov-promotion.jpg";
import koleMangov2 from "@/assets/kole-mangov-wife.jpg";
import koleMangov3 from "@/assets/kole-mangov-assembly.jpg";

const Kole = () => {
  const { t } = useLanguage();

  const { language } = useLanguage();

  const contentMK = {
    title: "КОЛЕ МАНГОВ",
    subtitle: "БИОГРАФИЈА",
    sections: [
      {
        text: `Коле Мангов е македонски публицист, судија, поет, борец за човековите права на Мaкедонците дискриминирани од Република Грција и одбрана на уставното име на Република Македонија. Роден е на 2 август 1940 во село Баница (на грчки Веви), Леринско (регион на денешна Флорина) во северниот дел на Грција (регион Централна Македонија во денешна Грција, во Македонија познат како Егејски дел). Презимето на неговото семејство Мангови во Грција е преименувано во Мангос. Неговата мајка починала кога тој имал две години, а неговиот татко, Павле Мангов загинал во Граѓанската војна во Грција. Во 1945 година, како петгодишно дете-бегалец, заедно со други Македонци од Грција, ја преминал тогашната грчко-југословенска граница. Заведен како Никола Манговски во Социјалистичка Федеративна Југославија (СФРЈ), на подоцнежни години, го менува своето име во Коле Мангов, за да биде автентично на тоа како му се обраќале во неговото родно место Баница.`,
      },
      {
        text: `Како дете без родители, заедно со другите македонски деца од Грција, израснал во детскиот дом „Лазо Трповски" во Битола, каде и завршил гимназија „Гоце Делчев". Имал полубрат Ристо, кој како мало дете останал и својот живот го поминал во Грција, и полусестра Маре, која исто како него, како мало дете, ја преминала грчко - југословенската граница и својот живот го поминала во Македонија, СФРЈ.

Коле Мангов завршил Правен факултет во Скопје. Бил судија во Основниот суд - Скопје, потоа судија во Стопанскиот суд - Скопје, а по реорганизацијата на судскиот систем бил судија во Апелациониот суд - Скопје. Како член на Комисија за уставни прашања на Собранието на Социјалистичка Република Македонија од редот на научните и стручните работници од областа на правото (на кратко Уставната комисија), која била формирана на 25 јануари 1991 година, учествувал во создавањето на Уставот на Република Македонија кој е донесен на 17 ноември 1991 година.`,
      },
      {
        text: `Во младоста почнал да пишува поезија и е автор на две поетски книги „Гладострав", издадена од Мисла во 1975 во Скопје и „Вик", во издание на Култура од 1979. Настапувал и на Струшките вечери на поезијата. Од 1997 година бил член на Друштвото на писателите на Македонија.

На крајот на седумдесетите и почетокот на осумдесетите години соочувајќи се со цензура поради ограничената слобода на медиумите, на говорот и изразувањето во социјалистичка Македонија и југословенскиот режим, особено за национални прашања, објавува текстови од областа на македонската национална историја и тековните горливи македонски прашања во македонски гласила во странство. Па, така, негови написи се објавувани во „Македонски глас"/„Канадско-македонски глас" од Торонто, Канада, „Македонски збор" од Детроит, САД, „Македонски весник" од Гетеборг, Шведска, Весник" од Перт, Австралија, и други. Дел од овие текстови биле преобјавувани во списанието „Македонија" на Матицата на иселеници од Македонија. Со приближувањето на плурализмот негови записи се објавуваат во „Нова Македонија", „Вечер", „Млад борец", „21", белградска „Борба", „Глас", „Република".

Во еден период, по неговиот прв еднонеделен престој во родното село Баница и Леринско во Грција, објавува текстови од перспектива на тамошниот народ напишани на егејски дијалект под псевдонимот Пламен Жаров. Овие текстови се објавени во весникот „Македонија" од Торонто, Канада и преобјавени и во други списанија на Македонците во странство.`,
      },
    ],
    humanRights: `На 3 јуни 1990 година заедно со неколку соработници го основал и станал претседател на Здружението за заштита на човековите права на Македонците дискриминирани од Република Грција „Достоинство". Преку здружението „Достоинство", и индивидуално, неуморно се застапувал и ги промовирал правните факти и аргументи за остварување на човековите права на Македонците родени во Грција, а кои избегале од Грција од крајот на Втората светска војна, за време и по Граѓанската војна во Грција (декември 1944-јануари 1945 година и 1946-1949 година) поради насилството и теророт кои ги доживувало македонското население таму, на Македонците кои живеат во Грција, како и за признавање на Македонија како независна држава и за признавање на уставното име на Македонија.

Во декември 1992 година под негово водство здружението Достоинство, заедно со Комитетот на хелсиншкиот парламент на граѓаните во Македонија, покренува кампања за испраќање на подготвени разгледници кои македонските граѓани во свое име како поединци ги испраќале до генералниот секретар на Обединетите Нации, Бутрос Бутрос Гали, со кои барале негов ангажман за Македонија да биде примена за членка во Обединетите Нации. На предната страна од разгледницата е претставен цртеж-колаж од Симон Шемов „Скок кон облаците" од 1975.

Борбата за македонските прашања ја водел на високо ниво и остварувал лична кореспонденција со видни политичари и дипломати од сиот свет, како што се: Жао де Деуш Пињеира, претседавач на Министерскиот совет на Европската заедница; Романо Проди, претседател на Европската комисија; Медлин Олбрајт, државен секретар на САД; Бутрос Бутрос Гали, генерален секретар на Обединетите Нации; Ото Фон Хабзбург, пратеник во Европскиот парламент, други претседатели на држави и шефови на дипломатии. За неговата работа бил интервјуиран од бројни медиуми од земјата и од странство, меѓу кои од Грција, Белгија, Словенија, Јапонија, итн.`,
    quote: "Очекувам писма да бидат испраќани и од вас како читатели до многу релевантни личности. Би требало да станеме поактивни околу ова прашање за да престане употребата на кратенката ФИРОМ. Не е збор за спор за името! Зошто нашата власт не ѝ врати на Грција со поранешна турска провинција Грција...Негацијата на Македонците како малцинство во Грција помина во негација на Македонците како нација. Јас, без знаење на англискиот јазик, толку можам...",
    legacy: `Неговиот публицистички опус е издаден во две книги „За македонските човечки права", публицистика, 1995 во издание на МРТ – Македонско радио и „Во одбрана на македонскиот национален идентитет", публицистика, 1998 во издание на НИП „Глобус", Скопје.

Коле Мангов почина на 73 годишна возраст на 1 јануари 2013 во Скопје. Бил оженет и татко на две ќерки.`,
    poemsTitle: "Две песни од неговиот опус:",
    poem1Title: "ОСУДИ МЕ РАСЕЛОВ СУДЕ",
    poem1: `Осуди ме Раселов суде
Што не сум го видел мајчиниот гроб
Осуди ме
Не заради 
Безогледноста на очајот
Не заради
Немоќта пред смртта
Не ги осудувај државниците
\tлидерите водачите
Не ги осудувај политичките системи
\tу правните поредоци
Не ги осудувај Обединетите нации
\tнивните Резолуции
\tи Декларации

Што не сум го видел мајчиниот гроб
Осуди го тоа дете
Да остане со непросолзена солза
Голема како езеро
Тешка како солза на небото
Пред распукнување
Со закана кон светот
Што очекува
Уште еден мој пораз
И уште една процесија на молчењето

Осуди ме Раселов суде
Да ја премолчам смртта на моето
\t       потекло
Нејзината неименливост
И обезгласеност

Осуди ме
Да остане обезгласен
Мојот молк
По знакот на мајчиниот гроб

Осуди ме со тишина
Осуди ме со најмрачна тишина
Осуди ме да не се сети
Таењето на мојата душа
Длабокото притаено таење
\t      на мојата душа
Кое се стајува
Во своето бессилие
Пред стравот`,
    poem1Note: "(Објавена во Студентски збор, Скопје, 18 април 1980 и во Македонија, Скопје, август 1981)",
    poem2Title: "НАТПИС",
    poem2: `Очигледно
Двата министри
Совршено се незаинтересирани 
За коските на Павле Мангов

Бесмислено е да очекувам
Натпис
Со кирилски букви:
Туку почиваат коските
На Павле Мангов

По сѐ
Треба да го измислам
Непостоењето 
На коските на Павле Мангов

И кога ми се најавува
Говорот на коските
И говорот на крвта
Да одговорам…

Навистина
Што да одговорам
Кога ми се најавува
Говорот на коските
И говорот на крвта`,
    poem2Note: "Песна објавена во Нова Македонија, Скопје, 20 јуни 1982 година и во Песната меѓу двете лета, издание на Струшките вечери на поезијата, Струга, 1982, на македонски, англиски, француски и руски јазик.",
  };

  const contentEN = {
    title: "KOLE MANGOV",
    subtitle: "BIOGRAPHY",
    sections: [
      { text: "[English translation coming soon]" },
      { text: "[English translation coming soon]" },
      { text: "[English translation coming soon]" },
    ],
    humanRights: "[English translation coming soon]",
    quote: "[English translation coming soon]",
    legacy: "[English translation coming soon]",
    poemsTitle: "Two poems from his work:",
    poem1Title: "CONDEMN ME RUSSELL'S COURT",
    poem1: "[English translation coming soon]",
    poem1Note: "",
    poem2Title: "INSCRIPTION",
    poem2: "[English translation coming soon]",
    poem2Note: "",
  };

  const data = language === 'mk' ? contentMK : contentEN;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12 max-w-7xl">
        {/* Title Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {data.title}
          </h1>
          <h2 className="text-2xl md:text-3xl text-primary">
            {data.subtitle}
          </h2>
        </div>

        {/* Section 1: Photo Left, Text Right */}
        <div className="grid md:grid-cols-2 gap-8 mb-16 items-start">
          <div className="flex flex-col justify-center">
            <img 
              src={koleMangov1} 
              alt="Коле Мангов" 
              className="w-full max-w-md rounded-lg shadow-lg"
            />
            <p className="text-sm text-muted-foreground mt-3 text-center max-w-md">
              {language === 'mk' ? 'Коле Мангов - македонски публицист и борец за човекови права' : 'Kole Mangov - Macedonian publicist and human rights activist'}
            </p>
          </div>
          <div className="prose prose-lg max-w-none">
            <p className="text-foreground leading-relaxed whitespace-pre-line">
              {data.sections[0].text}
            </p>
          </div>
        </div>

        {/* Section 2: Text Left, Photo Right */}
        <div className="grid md:grid-cols-2 gap-8 mb-16 items-start">
          <div className="prose prose-lg max-w-none md:order-1">
            <p className="text-foreground leading-relaxed whitespace-pre-line">
              {data.sections[1].text}
            </p>
          </div>
          <div className="flex flex-col justify-center md:order-2">
            <img 
              src={koleMangov2} 
              alt="Коле Мангов" 
              className="w-full max-w-md rounded-lg shadow-lg"
            />
            <p className="text-sm text-muted-foreground mt-3 text-center max-w-md mx-auto">
              {language === 'mk' ? 'Коле Мангов со сопругата Лилјана Мангова' : 'Kole Mangov with his wife Liljana Mangova'}
            </p>
          </div>
        </div>

        {/* Section 3: Full width text only */}
        <div className="mb-16">
          <div className="prose prose-lg max-w-none">
            <p className="text-foreground leading-relaxed whitespace-pre-line">
              {data.sections[2].text}
            </p>
          </div>
        </div>

        {/* Human Rights Work */}
        <div className="mb-16">
          <div className="prose prose-lg max-w-none">
            <p className="text-foreground leading-relaxed whitespace-pre-line">
              {data.humanRights}
            </p>
          </div>
        </div>

        {/* Third Image - Centered above quote */}
        <div className="flex flex-col items-center mb-12">
          <img 
            src={koleMangov3} 
            alt="Коле Мангов" 
            className="w-full max-w-md rounded-lg shadow-lg"
          />
          <p className="text-sm text-muted-foreground mt-3 text-center max-w-md">
            {language === 'mk' ? 'Коле Мангов на II-то изборно собрание на Достоинство' : 'Kole Mangov at the 2nd electoral assembly of Dignity'}
          </p>
        </div>

        {/* Quote */}
        <div className="bg-muted p-8 rounded-lg mb-16">
          <blockquote className="text-lg italic text-foreground border-l-4 border-primary pl-6">
            {data.quote}
          </blockquote>
        </div>

        {/* Legacy */}
        <div className="mb-16">
          <div className="prose prose-lg max-w-none">
            <p className="text-foreground leading-relaxed whitespace-pre-line">
              {data.legacy}
            </p>
          </div>
        </div>

        {/* Poems Section */}
        <div className="border-t border-border pt-16">
          <h3 className="text-3xl font-bold text-primary mb-12 text-center">
            {data.poemsTitle}
          </h3>

          {/* Poems side by side */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Poem 1 */}
            <div className="bg-muted/60 p-8 rounded-lg flex flex-col">
              <h4 className="text-2xl font-bold text-foreground mb-6 text-center">
                {data.poem1Title}
              </h4>
              <pre className="text-foreground leading-relaxed whitespace-pre-wrap font-serif text-lg mb-4 flex-1">
                {data.poem1}
              </pre>
              <p className="text-sm text-muted-foreground italic text-center">
                {data.poem1Note}
              </p>
            </div>

            {/* Poem 2 */}
            <div className="bg-muted/60 p-8 rounded-lg flex flex-col">
              <h4 className="text-2xl font-bold text-foreground mb-6 text-center">
                {data.poem2Title}
              </h4>
              <pre className="text-foreground leading-relaxed whitespace-pre-wrap font-serif text-lg mb-4 flex-1">
                {data.poem2}
              </pre>
              <p className="text-sm text-muted-foreground italic text-center">
                {data.poem2Note}
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Kole;
