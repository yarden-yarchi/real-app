import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { supabaseServer } from "@/lib/supabase-server";
import RandomTriangle from "@/app/components/RandomTriangle";
import ContactForm from "@/app/components/ContactForm";
import Reveal from "@/app/components/Reveal";
import { whatsappLink } from "@/lib/whatsapp";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const { data: box } = await supabaseServer
    .from("boxes")
    .select("title, description, desktop_image")
    .eq("id", id)
    .single();

  if (!box) return {};

  return {
    title: box.title,
    description: box.description ?? undefined,
    alternates: { canonical: `/boxes/${id}` },
    openGraph: {
      title: `${box.title} | ריל`,
      description: box.description ?? undefined,
      url: `/boxes/${id}`,
      images: box.desktop_image ? [box.desktop_image] : undefined,
    },
  };
}

export default async function BoxPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: box } = await supabaseServer.from("boxes").select("*").eq("id", id).single();

  if (!box) notFound();

  return (
    <main className="pb-4">
      {/* Hero */}
      <section className="relative flex h-[85vh] w-full items-end overflow-hidden">
        {box.desktop_image && (
          <Image
            src={box.desktop_image}
            alt={box.title}
            fill
            priority
            className="object-cover"
            unoptimized
          />
        )}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(140, 61, 1, 0) 38.31%, rgba(140, 61, 1, 0.6) 92.4%)",
          }}
        />
        <div className="relative z-10 w-full px-4 pb-12 sm:px-6 md:px-10">
          <Reveal fade className="mx-auto max-w-[1140px] text-center">
            <h1 className="font-display text-[clamp(2.5rem,8.73vw,8.25rem)] leading-none text-white">
              {box.title}
            </h1>
            {box.description && (
              <p className="mt-2 text-xl font-bold text-white sm:text-2xl">{box.description}</p>
            )}
          </Reveal>
        </div>
      </section>

      {/* Details card */}
      <section className="relative z-20 mx-[10px] md:mx-5 -mt-8 rounded-lg bg-white">
        <div className="mx-auto flex max-w-[1140px] flex-col gap-10 px-6 py-10 sm:px-10 md:flex-row md:gap-12">
          <Reveal fade className="text-right md:flex-1">
            <h2 className="text-center text-2xl font-bold text-terracotta md:text-right">
              על הערכה
            </h2>
            {box.about && (
              <div className="mt-5 space-y-4 text-lg leading-relaxed text-foreground">
                {box.about
                  .split("\n")
                  .map((p: string) => p.trim())
                  .filter(Boolean)
                  .map((paragraph: string, i: number) => (
                    <p key={i}>{paragraph}</p>
                  ))}
              </div>
            )}
          </Reveal>

          <div className="hidden w-px shrink-0 bg-purple/20 md:block" />

          {box.included_items?.length > 0 && (
            <div className="text-right md:flex-1">
              <Reveal fade delay={80}>
                <h2 className="text-center text-2xl font-bold text-terracotta md:text-right">
                  מה כלול בערכה?
                </h2>
              </Reveal>
              <div className="mt-5 flex flex-col gap-4">
                {box.included_items.map((item: string, i: number) => (
                  <Reveal fade key={i} delay={120 + i * 70}>
                    <div className="flex items-center gap-2.5 rounded-[10px] bg-background px-5 py-2">
                      <RandomTriangle seed={i + 1} size={90} />
                      <p className="text-lg text-purple">{item}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="mx-[10px] md:mx-5 mt-[20px] rounded-lg bg-brick">
        <div className="mx-auto max-w-[1140px] px-6 py-10 sm:px-10 sm:py-12">
          <Reveal fade className="flex flex-col items-center gap-6 text-center">
            <a
              href={whatsappLink(`היי, אשמח לפרטים על הזמנת ${box.title}`)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit items-center gap-2 rounded-[4px] bg-whatsapp px-6 py-2.5 font-bold text-white transition-transform duration-150 hover:scale-95 hover:opacity-90"
            >
              להזמנת הערכה שלחו הודעה
              <Image src="/icons/whatsapp.svg" alt="" width={22} height={22} />
            </a>
            <h2 className="font-display text-4xl leading-tight text-white sm:text-5xl md:text-6xl">
              או מלאו פרטים ונחזור אליכם!
            </h2>
          </Reveal>
          <Reveal fade delay={150} className="mt-10">
            <ContactForm />
          </Reveal>
        </div>
      </section>
    </main>
  );
}
