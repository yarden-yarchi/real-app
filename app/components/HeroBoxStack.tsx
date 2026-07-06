"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

type Box = { id: string; title: string };

// Positions are percentages of the stack frame in the Figma design
// (253.71 x 554.76), so the stack scales proportionally at any width.
// `boxTitle` overrides the lookup when the box art label differs from the
// box title in the database.
const STACK: {
  src: string;
  title: string;
  boxTitle?: string;
  height: number;
  left: string;
  top: string;
  z: string;
}[] = [
  { src: "/hero-boxes/talking.png", title: "מדברים", height: 207, left: "12.836%", top: "0%", z: "z-[8]" },
  { src: "/hero-boxes/balance.png", title: "איזון", height: 211, left: "5.917%", top: "11.892%", z: "z-[7]" },
  { src: "/hero-boxes/characters.png", title: "דמויות", height: 207, left: "13.259%", top: "23.139%", z: "z-[6]" },
  { src: "/hero-boxes/dynamics.png", title: "דינמיקה", boxTitle: "דינמיקה קבוצתית", height: 206, left: "5.87%", top: "33.978%", z: "z-[5]" },
  { src: "/hero-boxes/preparation-and-processing.png", title: "הכנה ועיבוד", height: 207, left: "12.83%", top: "46.043%", z: "z-[4]" },
  { src: "/hero-boxes/escape-room.png", title: "חדר בריחה", height: 202, left: "7.536%", top: "57.753%", z: "z-[3]" },
  { src: "/hero-boxes/shapes.png", title: "צורות", height: 203, left: "0%", top: "69.812%", z: "z-[2]" },
  { src: "/hero-boxes/dress-rehearsal.png", title: "חזרה גנרלית", height: 204, left: "5.365%", top: "81.418%", z: "z-[1]" },
];

export default function HeroBoxStack({ boxes }: { boxes: Box[] }) {
  const idByTitle = new Map(boxes.map((box) => [box.title, box.id]));
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="relative aspect-[253.71/554.76] w-full">
      {STACK.map((item) => {
        const id = idByTitle.get(item.boxTitle ?? item.title);
        const isHovered = hovered === item.title;
        const dimmed = hovered !== null && !isHovered;
        const className = `absolute block w-[86.741%] transition-all duration-300 ease-out ${
          isHovered ? "z-20 scale-[1.07] animate-hero-box-fade" : item.z
        } ${dimmed ? "blur-[3px]" : ""}`;
        const style = { left: item.left, top: item.top };
        const content = (
          <Image
            src={item.src}
            alt={item.title}
            width={441}
            height={item.height}
            loading="eager"
            className="h-auto w-full"
          />
        );
        const hoverProps = {
          onMouseEnter: () => setHovered(item.title),
          onMouseLeave: () => setHovered(null),
        };

        return id ? (
          <Link key={item.title} href={`/boxes/${id}`} className={className} style={style} {...hoverProps}>
            {content}
          </Link>
        ) : (
          <div key={item.title} className={className} style={style} {...hoverProps}>
            {content}
          </div>
        );
      })}
    </div>
  );
}
