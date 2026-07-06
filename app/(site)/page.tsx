import Image from "next/image";
import { supabaseServer } from "@/lib/supabase-server";
import BoxCard from "@/app/components/BoxCard";
import FaqAccordion from "@/app/components/FaqAccordion";
import ContactForm from "@/app/components/ContactForm";
import Reveal from "@/app/components/Reveal";
import AnimatedDots from "@/app/components/AnimatedDots";
import HeroBoxStack from "@/app/components/HeroBoxStack";
import { whatsappLink } from "@/lib/whatsapp";
import { SITE_URL } from "@/lib/site";

export const metadata = {
  alternates: { canonical: "/" },
};

// Structured data so Google connects the brand ("ריל") with its founder
// ("שובל לב ארי") in search results. Shoval is modeled as her own Person
// entity (not just a nested field) and cross-linked via @id so both can
// surface independently — e.g. a Knowledge Panel for her name.
const shovalJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${SITE_URL}/#shoval-lev-ari`,
  name: "שובל לב ארי",
  jobTitle: "מורה ומפתחת ערכות הלמידה של ריל",
  description:
    "מורה לתנ\"ך והיסטוריה, בוגרת תכנית \"רביבים\" באוניברסיטה העברית, יוצרת קולקציית ערכות הלמידה של ריל.",
  worksFor: { "@id": `${SITE_URL}/#organization` },
  url: SITE_URL,
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: "ריל",
  alternateName: "REAL",
  url: SITE_URL,
  founder: { "@id": `${SITE_URL}/#shoval-lev-ari` },
  description:
    "ערכות למידה פיזיות, רב שימושיות ומודולריות למורים, שפיתחה המורה שובל לב ארי.",
};

export default async function Home() {
  const { data: boxes } = await supabaseServer
    .from("boxes")
    .select("*")
    .order("sort_order", { ascending: true });
  const { data: faqs } = await supabaseServer
    .from("faqs")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  return (
    <main className="pb-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(shovalJsonLd) }}
      />
      {/* Hero */}
      <section className="relative z-10 mx-auto max-w-6xl px-[10px] pt-[126px] md:px-6">
        <div className="flex flex-col items-center gap-10 md:flex-row md:items-start md:justify-between md:gap-12">
          <Reveal className="flex flex-col items-center gap-5 text-center md:items-start md:text-right md:flex-1 md:self-stretch md:justify-center">
            <h1 className="flex flex-col items-center md:items-start">
              <span className="font-display text-[clamp(4rem,8.73vw,8.25rem)] leading-none text-brick">
                למידה היא
              </span>
              <span className="flex flex-wrap items-center justify-center gap-x-[26px] gap-y-1 md:justify-start">
                <span className="font-display text-[clamp(4rem,8.73vw,8.25rem)] leading-none text-terracotta">
                  מפגש
                </span>
                <span className="max-w-[260px] font-sans text-lg font-bold text-purple sm:max-w-[300px] sm:text-xl">
                  אפשר להחזיר את היצירתיות לכיתה ולהפוך כל שיעור - לשיעור שזוכרים!
                </span>
              </span>
            </h1>
            <p className="text-2xl font-bold text-purple">ערכה פיזית | רב שימושית | מודולארית</p>
            <div className="flex items-center gap-2.5 rounded-lg bg-pink-lighter p-2.5">
              <span className="text-lg font-semibold leading-none text-brick">
                נסו להציץ לקופסאות
              </span>
              {/* Rotated wrapper points the arrow down on mobile; the wiggle
                  translates inside it, so the nudge follows the arrow. */}
              <span className="inline-flex -rotate-90 md:rotate-0">
                <Image
                  src="/icons/arrow-left.svg"
                  alt=""
                  width={31}
                  height={15}
                  className="animate-arrow-wiggle"
                />
              </span>
            </div>
          </Reveal>
          <Reveal delay={150} className="w-full max-w-[254px] shrink-0 md:flex-1">
            <HeroBoxStack boxes={boxes ?? []} />
          </Reveal>
        </div>
      </section>

      {/* Boxes */}
      <section id="boxes" className="mx-[10px] md:mx-5 -mt-[35px] rounded-lg bg-purple px-4 py-12 sm:px-6 md:py-16">
        <div className="mx-auto max-w-[1140px]">
          <Reveal>
            <h2 className="text-center font-display text-[4em] leading-none text-white md:text-right md:text-6xl md:leading-normal">
              הציצו לתוך הקופסאות
            </h2>
            <p className="mt-4 text-center text-lg font-bold text-white md:text-right">
              שמונה קופסאות עץ מוחשיות, כל אחת מהן מכילה בתוכה כל מה שמורה צריך בשביל למידה מחוץ
              לקופסא.
            </p>
          </Reveal>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {boxes?.map((box, i) => (
              <Reveal key={box.id} delay={i * 80}>
                <BoxCard box={box} />
              </Reveal>
            ))}
          </div>
          {(!boxes || boxes.length === 0) && (
            <p className="mt-6 text-center text-white/70">הערכות יתווספו בקרוב</p>
          )}
        </div>
      </section>

      {/* Pricing */}
      <section className="mx-auto mt-12 max-w-6xl px-[10px] md:px-6 md:mt-16">
        <Reveal className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-right">
          <h2 className="text-2xl font-bold text-purple sm:text-3xl">
            אפשרויות רכישה והטמעה בצוות
          </h2>
          <a
            href={whatsappLink("היי, אשמח לשמוע פרטים על רכישת הקופסאות")}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-2 rounded-[4px] bg-whatsapp px-6 py-2.5 font-bold text-white transition-transform duration-150 hover:scale-95 hover:opacity-90 sm:inline-flex"
          >
            דברו איתי לרכישה
            <Image src="/icons/whatsapp.svg" alt="" width={22} height={22} />
          </a>
        </Reveal>

        <div className="mt-8 flex flex-col gap-5">
          {/* Card 1 */}
          <Reveal className="flex flex-col gap-9 rounded-[20px] bg-pink-light p-[30px] md:flex-row md:items-center md:gap-5 md:p-8">
            <div className="flex items-start justify-between gap-[55px] md:contents">
              <div className="flex min-w-0 flex-1 flex-col gap-[15px] text-right md:w-auto md:shrink-0 md:flex-none">
                <h3 className="text-2xl font-bold text-[#3d3238]">קופסא בודדת</h3>
                <p className="font-display text-4xl text-brick sm:text-5xl">1,350 ₪</p>
              </div>
              <AnimatedDots variant="three" size={44} seed={1} cardIndex={0} className="shrink-0 md:order-last" />
            </div>
            <div className="h-px w-full shrink-0 bg-brick/40 md:h-16 md:w-px" />
            <p className="text-lg font-bold text-[#3d3238] md:flex-1">
              למי שרוצה לבדוק אותנו קודם בקטן.
              <br />
              אזהרת ספוילר: אתם הולכים לחזור בשביל השאר
            </p>
          </Reveal>

          {/* Card 2 */}
          <Reveal
            delay={100}
            className="flex flex-col gap-9 rounded-[20px] bg-brick p-[30px] md:flex-row md:items-center md:gap-5 md:p-8"
          >
            <div className="flex items-start justify-between gap-[55px] md:contents">
              <div className="flex min-w-0 flex-1 flex-col gap-[15px] text-right md:w-auto md:shrink-0 md:flex-none">
                <h3 className="text-2xl font-bold text-white">הסדרה המלאה - כל הקופסאות!</h3>
                <p className="font-display text-4xl text-pink-lighter sm:text-5xl">9,800 ₪</p>
              </div>
              <AnimatedDots variant="five" size={40} seed={2} cardIndex={1} className="shrink-0 md:order-last" />
            </div>
            <div className="h-px w-full shrink-0 bg-white/40 md:h-16 md:w-px" />
            <div className="space-y-2 text-lg font-bold text-white md:flex-1">
              <p>כל 8 הערכות של ריל מייצרות יחד רצף פדגוגי, תרבות ושפה ייחודית בבית הספר.</p>
              <p className="font-normal">
                רכישת הסדרה המלאה כוללת מפגש חשיפה והתנסות של 45 דקות לצוות החינוכי ללא עלות
                נוספת.
              </p>
            </div>
          </Reveal>

          {/* Card 3 */}
          <Reveal
            delay={200}
            className="flex flex-col gap-9 rounded-[20px] border-2 border-terracotta p-[30px] md:flex-row md:items-center md:gap-5 md:p-8"
          >
            <div className="flex items-start justify-between gap-[55px] md:contents">
              <div className="min-w-0 flex-1 text-right text-xl font-bold text-[#3d3238] md:w-[220px] md:shrink-0 md:flex-none">
                ליווי והטמעה של הקופסאות לאורך שנת לימודים
              </div>
              <AnimatedDots variant="six" size={36} seed={3} cardIndex={2} className="shrink-0 md:order-last" />
            </div>
            <div className="h-px w-full shrink-0 bg-brick/40 md:h-16 md:w-px" />
            <div className="space-y-3 text-right md:flex-1">
              <div className="flex flex-wrap items-baseline gap-3">
                <span className="text-lg text-[#3d3238]">
                  <span className="font-bold">ליווי דו-חודשי:</span> 4 מפגשי ליווי והנחיה לצוות
                  לאורך השנה
                </span>
                <span className="font-display text-2xl text-terracotta">1,600 ₪</span>
              </div>
              <div className="flex flex-wrap items-baseline gap-3">
                <span className="text-lg text-[#3d3238]">
                  <span className="font-bold">ליווי חודשי:</span> 8 מפגשי ליווי והנחיה לצוות לאורך
                  השנה
                </span>
                <span className="font-display text-2xl text-terracotta">3,200 ₪</span>
              </div>
            </div>
          </Reveal>
        </div>

        <a
          href={whatsappLink("היי, אשמח לשמוע פרטים על רכישת הקופסאות")}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 flex w-fit items-center gap-2 rounded-[4px] bg-whatsapp px-6 py-2.5 font-bold text-white transition-transform duration-150 hover:scale-95 hover:opacity-90 sm:hidden mx-auto"
        >
          דברו איתי לרכישה
          <Image src="/icons/whatsapp.svg" alt="" width={22} height={22} />
        </a>
      </section>

      {/* About */}
      <section id="about" className="mx-[10px] md:mx-5 mt-12 rounded-lg bg-white md:mt-16">
        <div className="mx-auto flex max-w-[1140px] flex-col gap-8 px-6 py-[50px] sm:px-10 md:flex-row md:items-start md:gap-12">
          <Reveal className="relative mx-auto h-[280px] w-[220px] shrink-0 sm:h-[318px] sm:w-[249px]">
            <div className="absolute inset-3 -z-10 rounded-full bg-purple-dark" />
            <Image
              src="/shoval.png"
              alt="שובל לב ארי"
              fill
              className="rounded-full object-cover"
            />
          </Reveal>
          <Reveal delay={120} className="text-right md:flex-1">
            <p className="text-center font-sans text-lg text-purple md:text-right">
              נעים להכיר — הסיפור שמאחורי הערכות
            </p>
            <h2 className="mt-1 text-center font-display text-4xl text-terracotta sm:text-5xl md:text-right">
              היי, אני שובל לב ארי
            </h2>
            <div className="mt-5 text-lg leading-relaxed text-[#3d3238]">
              <p>
                נשואה לעמיטל, אמא של לביא ושחר, גרה בפרדס חנה. בוגרת תכנית ״רביבים״ באוניברסיטה
                העברית, מורה לתנ״ך והיסטוריה. בעברי חינכתי כיתות בתיכון, ואני פשוט אוהבת חינוך.
              </p>
              <p className="mt-[11px]">
                אני מאמינה ששיעור הוא הרבה מעבר להקניית ידע. <span className="font-bold">שיעור הוא מפגש</span>.
              </p>
              <p className="mt-[11px]">
                עם ההתקדמות המהירה של הטכנולוגיה, הרגשתי שהמפגש האמיתי, המבט בעיניים, הלמידה דרך
                הידיים והחוויה המשותפת, נעדרים מהשיעורים שלנו. ככל שהילדים גדלים, תהליך הלמידה שלהם
                עובר בעיקר למסך.
              </p>
              <p className="mt-[11px]">
                את הערכות פיתחתי מתוך העבודה בשטח, התלמידים שלי חוו את השיעורים עם העזרים האלה
                בגרסאות השונות עד שהגעתי לתוצאה הזאת, ואחרי עבודת חקר מעמיקה בלמידה חברתית־רגשית
                (SEL), דינמיקה קבוצתית ואמנות ניהול הדיון אני מציגה בפניכם את קולקציית הערכות.
              </p>
              <p className="mt-[11px] font-bold text-terracotta">המטרה שלי:</p>
              <p className="text-[31px] font-bold leading-[35px] text-purple">
                לתת למורים כלים פרקטיים, מעוצבים ונוחים לשימוש,  שיחזירו את היצירתיות לכיתה ויהפכו
                כל שיעור לשיעור שזוכרים.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto mt-12 max-w-4xl px-4 sm:px-6 md:mt-16">
        <Reveal>
          <h2 className="text-center font-display text-4xl text-terracotta sm:text-5xl">
            שאלות ותשובות
          </h2>
        </Reveal>
        <div className="mt-8">
          {faqs && faqs.length > 0 ? (
            <FaqAccordion items={faqs} />
          ) : (
            <p className="text-center text-foreground/60">שאלות ותשובות יתווספו בקרוב</p>
          )}
        </div>
      </section>

      {/* Contact CTA */}
      <section id="contact" className="mx-[10px] md:mx-5 mt-12 rounded-lg bg-brick md:mt-16">
        <div className="mx-auto max-w-[1140px] px-6 py-10 sm:px-10 sm:py-12">
          <Reveal className="flex flex-col items-center gap-6 text-center">
            <a
              href={whatsappLink("היי, אשמח לקבל פרטים נוספים")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit items-center gap-2 rounded-[4px] bg-whatsapp px-6 py-2.5 font-bold text-white transition-transform duration-150 hover:scale-95 hover:opacity-90"
            >
              מוזמנים לדבר איתנו
              <Image src="/icons/whatsapp.svg" alt="" width={22} height={22} />
            </a>
            <h2 className="font-display text-4xl leading-tight text-white sm:text-5xl md:text-6xl">
              או להשאיר פרטים ונחזור אליכם!
            </h2>
          </Reveal>
          <Reveal delay={150} className="mt-10">
            <ContactForm />
          </Reveal>
        </div>
      </section>
    </main>
  );
}
