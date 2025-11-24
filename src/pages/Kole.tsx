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
        text: `Коле Мангов е македонски публицист, судија, поет, борец за човековите права на Мaкедонците дискриминирани од Република Грција и одбрана на уставното име на Република Македонија. Роден е на 2 август 1940 во село Баница (на грчки Веви), Леринско (регион на денешна Флорина) во северниот дел на Грција (регион Централна Македонија во денешна Грција, во Македонија познат како Егејски дел). Презимето на неговото семејство Мангови во Грција е преименувано во Мангос. Неговата мајка, Лена Мангова, родена Ничова (Елени Мангу, родена Ничопулу) починала во текот на Граѓанската војна во Грција, кога тој имал две години, а неговиот татко, Павле Мангов (Павлос Мангос) загинал во Граѓанската војна во Грција. Во 1945 година, како дете-бегалец, заедно со други Македонци од Грција, ја преминал тогашната грчко-југословенска граница. Заведен како Никола Манговски во Социјалистичка Федеративна Југославија (СФРЈ), на подоцнежни години, го менува своето име во Коле Мангов, за да биде автентично на тоа како му се обраќале во неговото родно место Баница.`,
      },
      {
        text: `Како дете без родители, заедно со другите македонски деца од Грција, израснал во детскиот дом „Лазо Трповски" во Битола, каде и завршил гимназија „Гоце Делчев". Имал полубрат Ристо, кој како мало дете останал и својот живот го поминал во Грција, и полусестра Маре, која исто како него, како мало дете, ја преминала грчко - југословенската граница и својот живот го поминала во Македонија, СФРЈ.

Коле Мангов завршил Правен факултет во Скопје. Бил судија во Основниот суд - Скопје, потоа судија во Стопанскиот суд - Скопје, а по реорганизацијата на судскиот систем бил судија во Апелациониот суд - Скопје. Како член на Комисија за уставни прашања на Собранието на Социјалистичка Република Македонија од редот на научните и стручните работници од областа на правото (на кратко Уставната комисија), која била формирана на 25 јануари 1991 година, учествувал во создавањето на Уставот на Република Македонија кој е донесен на 17 ноември 1991 година.`,
      },
      {
        text: `Во младоста почнал да пишува поезија и е автор на две поетски книги „Гладострав", издадена од Мисла во 1975 во Скопје и „Вик", во издание на Култура од 1979. Настапувал и на Струшките вечери на поезијата. Од 1997 година бил член на Друштвото на писателите на Македонија.

На крајот на седумдесетите и почетокот на осумдесетите години соочувајќи се со цензура поради ограничената слобода на медиумите, на говорот и изразувањето во социјалистичка Македонија и југословенскиот режим, особено за национални прашања, објавува текстови од областа на македонската национална историја и тековните горливи македонски прашања во македонски гласила во странство. Па, така, негови написи се објавувани во „Македонски глас"/„Канадско-македонски глас" од Торонто, Канада, „Македонски збор" од Детроит, САД, „Македонски весник" од Гетеборг, Шведска, „Весник" од Перт, Австралија, и други. Дел од овие текстови биле преобјавувани во списанието „Македонија" на Матицата на иселеници од Македонија. Со приближувањето на плурализмот негови записи се објавуваат во „Нова Македонија", „Вечер", „Млад борец", „21", белградска „Борба", „Глас", „Република".

Во еден период, по неговиот прв еднонеделен престој во родното село Баница и Леринско во Грција, објавува текстови од перспектива на тамошниот народ напишани на егејски дијалект под псевдонимот Пламен Жаров. Овие текстови се објавени во весникот „Македонија" од Торонто, Канада и преобјавени и во други списанија на Македонците во странство.`,
      },
    ],
    humanRights: `На 3 јуни 1990 година заедно со неколку соработници го основал и станал претседател на Здружението за заштита на човековите права на Македонците дискриминирани од Република Грција „Достоинство". Преку здружението „Достоинство", и индивидуално, неуморно се застапувал и ги промовирал правните факти и аргументи за остварување на човековите права на Македонците родени во Грција, а кои избегале од Грција од крајот на Втората светска војна, за време и по Граѓанската војна во Грција (1946-1949 година) поради насилството и теророт кои ги доживувало македонското население таму, на Македонците кои живеат во Грција, како и за признавање на Македонија како независна држава и за признавање на уставното име на Македонија.

Во декември 1992 година под негово водство здружението Достоинство, заедно со Комитетот на хелсиншкиот парламент на граѓаните во Македонија, покренува кампања за испраќање на подготвени разгледници кои македонските граѓани во свое име како поединци ги испраќале до генералниот секретар на Обединетите Нации, Бутрос Бутрос Гали, со кои барале негов ангажман за Македонија да биде примена за членка во Обединетите Нации. На предната страна од разгледницата е претставен цртеж-колаж од Симон Шемов „Скок кон облаците" од 1975.

Борбата за македонските прашања ја водел на високо ниво и остварувал лична кореспонденција со видни политичари и дипломати од сиот свет, како што се: Жао де Деуш Пињеира, претседавач на Министерскиот совет на Европската заедница; Романо Проди, претседател на Европската комисија; Медлин Олбрајт, државен секретар на САД; Бутрос Бутрос Гали, генерален секретар на Обединетите Нации; Ото Фон Хабзбург, пратеник во Европскиот парламент, други претседатели на држави и шефови на дипломатии. За неговата работа бил интервјуиран од бројни медиуми од земјата и од странство, меѓу кои од Грција, Белгија, Словенија, Јапонија, итн.

Во едно обраќање во медиумите тој сосема прецизно ја доловува формулата, како според него треба секој поединец да настапува, во заштита на човековите права:`,
    quote: 'Очекувам писма да бидат испраќани и од вас како читатели до многу релевантни личности. Би требало да станеме поактивни околу ова прашање за да престане употребата на кратенката ФИРОМ. Не е збор за спор за името! Зошто нашата власт не ѝ врати на Грција со "поранешна турска провинција Грција"...Негацијата на Македонците како малцинство во Грција помина во негација на Македонците како нација. Јас, без знаење на англискиот јазик, толку можам...',
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
    poem1Note: '(Објавена во "Студентски збор", Скопје, 18 април 1980 и во "Македонија", Скопје, август 1981)',
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
    poem2Note: 'Песна објавена во "Нова Македонија", Скопје, 20 јуни 1982 година и во "Песната меѓу двете лета", издание на Струшките вечери на поезијата, Струга, 1982, на македонски, англиски, француски и руски јазик.',
  };

  const contentEN = {
    title: "KOLE MANGOV",
    subtitle: "BIOGRAPHY",
    sections: [
      {
        text: `Kole Mangov was a Macedonian publicist, judge, poet, and fighter for the human rights of Macedonians discriminated against by the Republic of Greece, as well as a defender of the constitutional name of the Republic of Macedonia. He was born on 2 August 1940 in the village of Banica (Greek: Vevi), in the Lerin region (today's Florina) in northern Greece (the Central Macedonia region, known in Macedonia as the Aegean part). In Greece, his family surname "Mangovi" was changed to "Mangos." His mother, Lena Mangova, born Nitchova (in Greek: Eleni Mangou, born Nitsopoulou), died during the Greek Civil War, when he was two years old, and his father, Pavle Mangov (in Greek: Pavlos Mangos) was killed in the Greek Civil War. In 1945, as a five-year-old refugee child, he crossed the then Greek–Yugoslav border together with other Macedonians fleeing Greece. Registered as Nikola Mangovski in the Socialist Federal Republic of Yugoslavia (SFRY), he later changed his name to Kole Mangov to reflect the way he was addressed in his native village.`,
      },
      {
        text: `As an orphaned child, he grew up, alongside other Macedonian refugee children from Greece, in the "Lazo Trpovski" children's home in Bitola, where he also completed his secondary education at the "Goce Delchev" Gymnasium. He had a half-brother, Risto, who remained in Greece and spent his life there, and a half-sister, Mare, who, like him, crossed the border as a child and lived her life in Macedonia, then part of SFRY.

Mangov graduated from the Faculty of Law in Skopje. He served as a judge in the Basic Court – Skopje, later in the Commercial Court – Skopje, and after the reorganization of the judiciary, in the Court of Appeals – Skopje. As a legal expert, he was a member of the Committee on Constitutional Issues of the Assembly of the Socialist Republic of Macedonia, established on 25 January 1991, and he participated in drafting the Constitution of the Republic of Macedonia, adopted on 17 November 1991.`,
      },
      {
        text: `In his youth, Mangov began writing poetry. He authored two poetry books: Gladostrav (Fear of Hunger) (Misla, 1975) and Vik (Scream) (Kultura, 1979). He also appeared at the Struga Poetry Evenings. In 1997 he became a member of the Writers' Association of Macedonia.

During the late 1970s and early 1980s, facing the censorship and restrictions on media freedom, speech, and expression in socialist Macedonia and the Yugoslav regime, particularly concerning national issues, he published opinion pieces on Macedonian national history and contemporary Macedonian issues in Macedonian periodicals abroad. His works appeared in the Macedonian Voice / Canadian-Macedonian Voice (Toronto, Canada), Macedonian Word (Detroit, USA), Macedonian Newspaper (Gothenburg, Sweden), Vesnik (Perth, Australia), and others. Some of these opinion pieces were reprinted in Macedonia, the journal of the Macedonian Emigrants' Association. With the emergence of political pluralism, his writings began appearing in Nova Makedonija, Vecher, Mlad Borec, 21, Belgrade's Borba, Glas, and Republika.

For a period, following his first week-long visit to his native village Banica and the Lerin region in Greece, he published opinion pieces written from the perspective of the local people in the Aegean dialect under the pseudonym Plamen Zharov. These pieces appeared in Macedonia (Toronto, Canada) and were subsequently reprinted in other Macedonian diaspora publications.`,
      },
    ],
    humanRights: `On 3 June 1990, together with several associates, Mangov founded, and became president of, the Association for the Protection of the Human Rights of Macedonians Discriminated Against by the Republic of Greece, "Dignity" ("Dostoinstvo"). Through this association, and in his individual capacity, he tirelessly advocated for the human rights of Macedonians born in Greece who fled during and after the Second World War and during and after the Greek Civil War (1946-1949), due to the violence and terror they faced there. He also advocated for the rights of Macedonians still living in Greece and for the recognition of Macedonia as an independent state and under its constitutional name.

In December 1992, under his leadership, the association Dignity (Dostoinstvo), together with the Committee of the Helsinki Citizens' Assembly in Macedonia, launched a campaign to send prepared postcards to the Secretary - General of the United Nations, Boutros Boutros-Ghali, urging him to support Macedonia's admission to the United Nations. The front of the postcard featured Simon Shemov's 1975 drawing-collage Leap Toward the Clouds.

Mangov conducted his advocacy for the Macedonian human rights at a high international level, establishing personal correspondence with leading global politicians and diplomats, including João de Deus Pinheiro, chairman of the Council of Ministers of the European Community; Romano Prodi, president of the European Commission; Madeleine Albright, U.S. Secretary of State; Boutros Boutros-Ghali, UN Secretary-General; Otto von Habsburg, member of the European Parliament; as well as other presidents, ministers, and diplomats. He was interviewed by numerous media outlets from Macedonia and abroad, including reporters from Greece, Belgium, Slovenia, Japan, and others.

In one public statement, he succinctly expressed his view i.e. the formula of how individuals should act in defense of human rights:`,
    quote: `"I expect letters to be sent from you as readers to many relevant officials. We must become more active on this issue so that the use of the acronym FYROM ceases. This is not a dispute about the name! Why doesn't our government respond to Greece with 'Former Turkish Province Greece'? … The negation of Macedonians as a minority in Greece has turned into the negation of Macedonians as a nation. I, without knowledge of English, can only do this much…"`,
    legacy: `His writings were collected in two books: For Macedonian Human Rights (MRT – Macedonian Radio, 1995) and In Defense of the Macedonian National Identity (NIP "Globus," 1998).

Kole Mangov died at the age of 73 on 1 January 2013 in Skopje, Macedonia. He was married and the father of two daughters.`,
    poemsTitle: "Two of his poems",
    poem1Title: "CONDEMN ME, RUSSELL TRIBUNAL",
    poem1: "[Poem text to be added]",
    poem1Note: "(Published in Studentski Zbor, Skopje, 18 April 1980, and in Macedonia, Skopje, August 1981)",
    poem2Title: "INSCRIPTION",
    poem2: "[Poem text to be added]",
    poem2Note: "(Published in Nova Makedonija, Skopje, 20 June 1982, and in The Poem Between the Two Summers, Struga Poetry Evenings, Struga, 1982, in Macedonian, English, French, and Russian)",
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
              className="w-full max-w-xl rounded-lg shadow-lg"
            />
            <p className="text-sm text-muted-foreground mt-3 text-center max-w-xl">
              {language === 'mk' ? 'Коле Мангов промоција на книгата За македонските човекови права' : 'Kole Mangov - Macedonian publicist and human rights activist'}
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
              className="w-full max-w-xl rounded-lg shadow-lg"
            />
            <p className="text-sm text-muted-foreground mt-3 text-center max-w-xl mx-auto">
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
            className="w-full max-w-xl rounded-lg shadow-lg"
          />
          <p className="text-sm text-muted-foreground mt-3 text-center max-w-xl">
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
