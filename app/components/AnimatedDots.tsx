"use client";

import { motion } from "framer-motion";

type Dot = { cx: number; cy: number; r: number };

const VARIANTS: Record<"three" | "five" | "six", { width: number; height: number; fill: string; dots: Dot[] }> = {
  three: {
    width: 63,
    height: 63,
    fill: "#ffffff",
    dots: [
      { cx: 10, cy: 10, r: 10 },
      { cx: 30.8359, cy: 30.8359, r: 10 },
      { cx: 52.4434, cy: 52.4434, r: 10 },
    ],
  },
  five: {
    width: 60,
    height: 60,
    fill: "#c65d3c",
    dots: [
      { cx: 10, cy: 10, r: 10 },
      { cx: 50, cy: 10, r: 10 },
      { cx: 10, cy: 50, r: 10 },
      { cx: 50, cy: 50, r: 10 },
      { cx: 30.0029, cy: 29.8496, r: 10 },
    ],
  },
  six: {
    width: 56,
    height: 92,
    fill: "#96342b",
    dots: [
      { cx: 46, cy: 10, r: 10 },
      { cx: 46, cy: 46, r: 10 },
      { cx: 46, cy: 82, r: 10 },
      { cx: 10, cy: 10, r: 10 },
      { cx: 10, cy: 46, r: 10 },
      { cx: 10, cy: 82, r: 10 },
    ],
  },
};

function seededRandom(seed: number) {
  let t = seed;
  return function () {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

export default function AnimatedDots({
  variant,
  size,
  seed = 1,
  className = "",
}: {
  variant: "three" | "five" | "six";
  size?: number;
  seed?: number;
  className?: string;
}) {
  const { width, height, fill, dots } = VARIANTS[variant];
  const rand = seededRandom(seed);
  const displayWidth = size ?? width;
  const displayHeight = size ? (size / width) * height : height;

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ width: displayWidth, height: displayHeight }}
    >
      <svg
        width={displayWidth}
        height={displayHeight}
        viewBox={`0 0 ${width} ${height}`}
        className="block"
      >
        {dots.map((dot, i) => {
          const startX = dot.r + rand() * (width - dot.r * 2);
          const startY = dot.r + rand() * (height - dot.r * 2);
          return (
            <motion.circle
              key={i}
              r={dot.r}
              fill={fill}
              initial={{ cx: startX, cy: startY, opacity: 0 }}
              whileInView={{ cx: dot.cx, cy: dot.cy, opacity: 1 }}
              viewport={{ once: false, amount: 0.6 }}
              transition={{
                duration: 0.4,
                delay: i * 0.08,
                ease: "easeOut",
              }}
            />
          );
        })}
      </svg>
    </div>
  );
}
