"use client";

import Image from "next/image";
import Reveal from "./Reveal";

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  return (
    <div className="flex flex-col gap-3">
      {items.map((item, i) => (
        <Reveal key={item.id} delay={i * 60}>
          <details className="group rounded-[10px] border border-purple px-5 py-3 open:pb-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden [&::marker]:hidden">
              <span className="flex items-center gap-4">
                <Image src="/icons/dots-2.svg" alt="" width={40} height={14} />
                <span className="text-lg font-bold text-purple">{item.question}</span>
              </span>
              <span className="shrink-0 text-purple transition-transform group-open:rotate-45 text-2xl leading-none">
                +
              </span>
            </summary>
            <p className="mt-2 pr-14 text-base text-foreground">{item.answer}</p>
          </details>
        </Reveal>
      ))}
    </div>
  );
}
