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

// A closed loop that starts and ends exactly at (cx, cy). baseAngle picks
// which direction the dot first swings out in, and direction picks
// clockwise vs counter-clockwise — radius and total arc (a full circle)
// stay identical, only the path's orientation varies.
function loopKeyframes(
  cx: number,
  cy: number,
  radius: number,
  baseAngle: number,
  direction: 1 | -1,
  steps = 48
) {
  const centerX = cx + Math.cos(baseAngle) * radius;
  const centerY = cy + Math.sin(baseAngle) * radius;
  const theta0 = baseAngle + Math.PI;
  const xs: number[] = [];
  const ys: number[] = [];
  for (let i = 0; i <= steps; i++) {
    const theta = theta0 + direction * (i / steps) * Math.PI * 2;
    xs.push(centerX + Math.cos(theta) * radius);
    ys.push(centerY + Math.sin(theta) * radius);
  }
  return { xs, ys };
}

export default function AnimatedDots({
  variant,
  size,
  seed = 1,
  cardIndex = 0,
  className = "",
}: {
  variant: "three" | "five" | "six";
  size?: number;
  seed?: number;
  cardIndex?: number;
  className?: string;
}) {
  const { width, height, fill, dots } = VARIANTS[variant];
  const displayWidth = size ?? width;
  const displayHeight = size ? (size / width) * height : height;
  const rand = seededRandom(seed);

  const duration = 1.2;
  const cycle = 8;
  const groupDelay = cardIndex * 1.8;

  return (
    <div
      className={`relative ${className}`}
      style={{ width: displayWidth, height: displayHeight }}
    >
      <svg
        width={displayWidth}
        height={displayHeight}
        viewBox={`0 0 ${width} ${height}`}
        className="block"
        style={{ overflow: "visible" }}
      >
        {dots.map((dot, i) => {
          const baseAngle = rand() * Math.PI * 2;
          const direction = rand() < 0.5 ? 1 : -1;
          const { xs, ys } = loopKeyframes(dot.cx, dot.cy, dot.r * 0.7, baseAngle, direction);
          return (
            <motion.circle
              key={i}
              r={dot.r}
              fill={fill}
              initial={{ cx: dot.cx, cy: dot.cy }}
              whileInView={{ cx: xs, cy: ys }}
              viewport={{ once: false, amount: 0.6 }}
              transition={{
                duration,
                delay: 1 + groupDelay + i * 0.08,
                repeat: Infinity,
                repeatDelay: cycle - duration,
                ease: "linear",
              }}
            />
          );
        })}
      </svg>
    </div>
  );
}
