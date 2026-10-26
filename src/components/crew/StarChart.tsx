import { STARS, TRAVELLED_LY, DISTANCE_LY, VOYAGE } from "@/lib/mission";

const W = 760;
const H = 420;

function pointOnRoute(t: number): { x: number; y: number } {
  const x0 = 70;
  const y0 = 300;
  const x1 = 360;
  const y1 = 96;
  const x2 = 690;
  const y2 = 150;
  const u = 1 - t;
  return {
    x: u * u * x0 + 2 * u * t * x1 + t * t * x2,
    y: u * u * y0 + 2 * u * t * y1 + t * t * y2,
  };
}

export function StarChart({ compact = false }: { compact?: boolean }) {
  const t = TRAVELLED_LY / DISTANCE_LY;
  const here = pointOnRoute(t);
  const samples = 24;
  const travelled = Array.from({ length: samples + 1 }, (_, i) => {
    const p = pointOnRoute((t * i) / samples);
    return `${p.x},${p.y}`;
  }).join(" ");
  const remaining = Array.from({ length: samples + 1 }, (_, i) => {
    const p = pointOnRoute(t + ((1 - t) * i) / samples);
    return `${p.x},${p.y}`;
  }).join(" ");

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="h-full w-full"
      role="img"
      aria-label="Fold corridor chart from Sol to Helios Prime"
    >
      <defs>
        <radialGradient id="chart-glow" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="#152a45" />
          <stop offset="100%" stopColor="#0a1628" />
        </radialGradient>
        <filter id="soft">
          <feGaussianBlur stdDeviation="1.2" />
        </filter>
      </defs>
      <rect width={W} height={H} fill="url(#chart-glow)" rx="16" />
      {Array.from({ length: 6 }, (_, i) => (
        <line
          key={`h-${i}`}
          x1="48"
          x2={W - 24}
          y1={40 + i * 64}
          y2={40 + i * 64}
          stroke="#2a4a6e"
          strokeOpacity="0.35"
        />
      ))}
      {Array.from({ length: 8 }, (_, i) => (
        <line
          key={`v-${i}`}
          y1="28"
          y2={H - 36}
          x1={64 + i * 84}
          x2={64 + i * 84}
          stroke="#2a4a6e"
          strokeOpacity="0.28"
        />
      ))}
      {STARS.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#ede6da" opacity={s.o} />
      ))}
      <polyline
        points={remaining}
        fill="none"
        stroke="#c9a27c"
        strokeOpacity="0.35"
        strokeWidth="1.6"
        strokeDasharray="5 7"
      />
      <polyline
        points={travelled}
        fill="none"
        stroke="#c9a27c"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <circle cx="70" cy="300" r="7" fill="#ede6da" />
      <circle cx="70" cy="300" r="14" fill="#c9a27c" opacity="0.25" filter="url(#soft)" />
      <text x="70" y="328" textAnchor="middle" fill="#c4bdb0" fontSize="11" fontFamily="Source Sans 3, sans-serif">
        Sol
      </text>
      <circle cx="690" cy="150" r="5" fill="#c9a27c" />
      <circle cx="690" cy="150" r="11" fill="#c9a27c" opacity="0.3" filter="url(#soft)" />
      <text x="690" y="136" textAnchor="middle" fill="#c9a27c" fontSize="11" fontFamily="Source Serif 4, serif">
        Helios Prime
      </text>
      <text x="690" y="176" textAnchor="middle" fill="#8b9bb0" fontSize="10" fontFamily="Source Sans 3, sans-serif">
        Vesper-4
      </text>
      <g transform={`translate(${here.x}, ${here.y})`}>
        <circle r="5" fill="#ede6da" />
        <circle r="11" fill="none" stroke="#c9a27c" strokeWidth="1.2" />
      </g>
      <text
        x={here.x}
        y={here.y - 16}
        textAnchor="middle"
        fill="#ede6da"
        fontSize="12"
        fontFamily="Source Serif 4, serif"
      >
        {VOYAGE.shipName}
      </text>
      {!compact ? (
        <text
          x="48"
          y={H - 14}
          fill="#8b9bb0"
          fontSize="10"
          fontFamily="Source Sans 3, sans-serif"
          letterSpacing="0.16em"
        >
          CYGNUS FOLD  ·  ATLAS 14-C  ·  NOT FOR EVA USE
        </text>
      ) : null}
    </svg>
  );
}
