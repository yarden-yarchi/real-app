const PALETTE = ["#96342b", "#3f3883", "#c65d3c", "#ecb9af", "#f1d3cd", "#201854"];

function seededRandom(seed: number) {
  let t = seed;
  return function () {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function roundedPolygonPath(points: [number, number][], radius: number) {
  const n = points.length;
  const parts: string[] = [];
  for (let i = 0; i < n; i++) {
    const prev = points[(i - 1 + n) % n];
    const curr = points[i];
    const next = points[(i + 1) % n];

    const toPrev = normalize([prev[0] - curr[0], prev[1] - curr[1]]);
    const toNext = normalize([next[0] - curr[0], next[1] - curr[1]]);

    const p1: [number, number] = [curr[0] + toPrev[0] * radius, curr[1] + toPrev[1] * radius];
    const p2: [number, number] = [curr[0] + toNext[0] * radius, curr[1] + toNext[1] * radius];

    parts.push(i === 0 ? `M ${p1[0]} ${p1[1]}` : `L ${p1[0]} ${p1[1]}`);
    parts.push(`Q ${curr[0]} ${curr[1]} ${p2[0]} ${p2[1]}`);
  }
  parts.push("Z");
  return parts.join(" ");
}

function normalize([x, y]: [number, number]): [number, number] {
  const len = Math.sqrt(x * x + y * y) || 1;
  return [x / len, y / len];
}

export default function RandomTriangle({ seed, size = 62 }: { seed: number; size?: number }) {
  const rand = seededRandom(seed);
  const pad = size * 0.14;
  const points: [number, number][] = [0, 1, 2].map(() => [
    pad + rand() * (size - 2 * pad),
    pad + rand() * (size - 2 * pad),
  ]);
  const color = PALETTE[Math.floor(rand() * PALETTE.length)];
  const d = roundedPolygonPath(points, 2.4);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
      <path d={d} fill={color} />
    </svg>
  );
}
