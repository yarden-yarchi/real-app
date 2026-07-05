"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useBoxTransition } from "@/app/components/BoxTransition";

type Box = { id: string; title: string };

// Positions are percentages of the stack frame in the Figma design
// (253.71 x 554.76), so the stack scales proportionally at any width.
// anchor: a point (fraction of image size) inside the solid dark-brown
// face of each box photo — the zoom transition dives into that point.
// reach: half-size (fraction of image width) of the solid-dark square
// around the anchor; used to compute how far to zoom for full coverage.
const STACK = [
  { src: "/hero-boxes/escape-room.png", title: "חדר בריחה", height: 202, left: "12.836%", top: "0%", z: "z-[8]", anchor: { x: 0.503, y: 0.624 }, reach: 0.054 },
  { src: "/hero-boxes/dress-rehearsal.png", title: "חזרה גנרלית", height: 204, left: "5.917%", top: "11.892%", z: "z-[7]", anchor: { x: 0.503, y: 0.623 }, reach: 0.045 },
  { src: "/hero-boxes/characters.png", title: "דמויות", height: 207, left: "13.259%", top: "23.139%", z: "z-[6]", anchor: { x: 0.585, y: 0.618 }, reach: 0.073 },
  { src: "/hero-boxes/balance.png", title: "איזון", height: 211, left: "5.87%", top: "33.978%", z: "z-[5]", anchor: { x: 0.612, y: 0.611 }, reach: 0.073 },
  { src: "/hero-boxes/dynamics.png", title: "דינמיקה", height: 206, left: "12.83%", top: "46.043%", z: "z-[4]", anchor: { x: 0.558, y: 0.646 }, reach: 0.073 },
  { src: "/hero-boxes/shapes.png", title: "צורות", height: 203, left: "7.536%", top: "57.753%", z: "z-[3]", anchor: { x: 0.585, y: 0.621 }, reach: 0.073 },
  { src: "/hero-boxes/preparation-and-processing.png", title: "הכנה ועיבוד", height: 207, left: "0%", top: "69.812%", z: "z-[2]", anchor: { x: 0.503, y: 0.734 }, reach: 0.045 },
  { src: "/hero-boxes/talking.png", title: "מדברים", height: 207, left: "5.365%", top: "81.418%", z: "z-[1]", anchor: { x: 0.544, y: 0.647 }, reach: 0.073 },
];

export default function HeroBoxStack({ boxes }: { boxes: Box[] }) {
  const idByTitle = new Map(boxes.map((box) => [box.title, box.id]));
  const [hovered, setHovered] = useState<string | null>(null);
  const { start } = useBoxTransition();

  return (
    <div className="relative aspect-[253.71/554.76] w-full">
      {STACK.map((item) => {
        const id = idByTitle.get(item.title);
        const isHovered = hovered === item.title;
        const dimmed = hovered !== null && !isHovered;
        const className = `absolute block w-[86.741%] transition-all duration-300 ease-out ${
          isHovered ? "z-20 scale-[1.07] animate-hero-box-fade" : item.z
        } ${dimmed ? "blur-[3px]" : ""}`;
        const style = { left: item.left, top: item.top };
        const content = (
          <>
            <Image
              src={item.src}
              alt={item.title}
              width={441}
              height={item.height}
              unoptimized
              loading="eager"
              className="h-auto w-full"
            />
            {isHovered && (
              // The outer span's padding bridges the gap between the box and
              // the tooltip so the pointer never leaves the link on the way.
              <span className="absolute left-1/2 -top-2 z-30 -translate-x-1/2 -translate-y-full sm:left-full sm:top-1/2 sm:translate-x-0 sm:-translate-y-1/2 sm:pl-3">
                <span className="block whitespace-nowrap rounded-lg bg-[#4B1B1C] px-4 py-2 text-sm font-bold text-white shadow-lg animate-hero-box-fade">
                  להציץ לתוך הקופסא
                </span>
              </span>
            )}
          </>
        );
        const hoverProps = {
          onMouseEnter: () => setHovered(item.title),
          onMouseLeave: () => setHovered(null),
        };

        return id ? (
          <Link
            key={item.title}
            href={`/boxes/${id}`}
            className={className}
            style={style}
            {...hoverProps}
            onClick={(e) => {
              e.preventDefault();
              const img = e.currentTarget.querySelector("img");
              const rect = (img ?? e.currentTarget).getBoundingClientRect();
              start({
                href: `/boxes/${id}`,
                src: item.src,
                alt: item.title,
                rect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height },
                anchor: item.anchor,
                reach: item.reach,
              });
            }}
          >
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
