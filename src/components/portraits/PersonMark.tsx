import type { CrewMember, HairStyle } from "@/lib/mission";
import { cn } from "@/lib/utils";

function Hair({ style, color }: { style: HairStyle; color: string }) {
  switch (style) {
    case "long":
      return (
        <>
          <ellipse cx="50" cy="38" rx="30" ry="28" fill={color} />
          <path d="M20 42 Q16 78 22 96 H78 Q84 78 80 42" fill={color} />
        </>
      );
    case "wave":
      return (
        <>
          <ellipse cx="50" cy="36" rx="28" ry="26" fill={color} />
          <path d="M22 40 C18 58 24 70 28 78 L24 52 Z" fill={color} />
          <path d="M78 40 C82 58 76 70 72 78 L76 52 Z" fill={color} />
        </>
      );
    case "bun":
      return (
        <>
          <ellipse cx="50" cy="40" rx="26" ry="24" fill={color} />
          <circle cx="50" cy="16" r="10" fill={color} />
        </>
      );
    case "pixie":
      return <ellipse cx="50" cy="38" rx="26" ry="22" fill={color} />;
    case "coil":
      return (
        <>
          <circle cx="28" cy="34" r="9" fill={color} />
          <circle cx="42" cy="22" r="9" fill={color} />
          <circle cx="58" cy="22" r="9" fill={color} />
          <circle cx="72" cy="34" r="9" fill={color} />
          <circle cx="32" cy="48" r="8" fill={color} />
          <circle cx="68" cy="48" r="8" fill={color} />
          <ellipse cx="50" cy="40" rx="22" ry="18" fill={color} />
        </>
      );
    case "fade":
      return <path d="M24 48 C24 22 76 22 76 48 C76 36 24 36 24 48" fill={color} />;
    case "crop":
      return <ellipse cx="50" cy="36" rx="25" ry="20" fill={color} />;
    default:
      return <ellipse cx="50" cy="38" rx="26" ry="22" fill={color} />;
  }
}

function FaceShapePath({
  face,
  skin,
}: {
  face: CrewMember["portrait"]["face"];
  skin: string;
}) {
  if (face === "round") return <ellipse cx="50" cy="54" rx="22" ry="24" fill={skin} />;
  if (face === "long") return <ellipse cx="50" cy="56" rx="18" ry="26" fill={skin} />;
  if (face === "square")
    return <rect x="30" y="36" width="40" height="44" rx="14" fill={skin} />;
  return <ellipse cx="50" cy="54" rx="20" ry="25" fill={skin} />;
}

export function PersonMark({
  person,
  variant,
  size = 64,
  className,
  showId = false,
}: {
  person: CrewMember;
  variant: "crew" | "observer";
  size?: number;
  className?: string;
  showId?: boolean;
}) {
  const p = person.portrait;
  const greyscale = variant === "observer";

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={cn("shrink-0", className)}
      aria-hidden="true"
      style={
        greyscale
          ? { filter: "grayscale(1) contrast(1.05)", borderRadius: 2 }
          : { borderRadius: 16 }
      }
    >
      <rect
        width="100"
        height="100"
        fill={variant === "crew" ? "#1b3554" : "#262626"}
        rx={variant === "crew" ? 16 : 2}
      />
      <Hair style={p.hair} color={p.hairColor} />
      <FaceShapePath face={p.face} skin={p.skin} />
      <ellipse cx="42" cy="52" rx="2.2" ry="2.6" fill={p.eyes} />
      <ellipse cx="58" cy="52" rx="2.2" ry="2.6" fill={p.eyes} />
      <path
        d="M46 64 Q50 68 54 64"
        fill="none"
        stroke={p.skin === "#6b3d28" ? "#4a2818" : "#8a5a40"}
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      {p.facialHair === "beard" ? (
        <path d="M36 66 Q50 86 64 66 Q50 74 36 66" fill={p.hairColor} opacity="0.85" />
      ) : null}
      {p.facialHair === "stubble" ? (
        <ellipse cx="50" cy="72" rx="12" ry="8" fill={p.hairColor} opacity="0.35" />
      ) : null}
      <path
        d="M28 92 C28 72 72 72 72 92"
        fill={variant === "crew" ? "#152a45" : "#1a1a1a"}
      />
      <path
        d="M40 80 H60"
        stroke={variant === "crew" ? "#c9a27c" : "#5c5c5c"}
        strokeWidth="2"
      />
      {showId || variant === "observer" ? (
        <text
          x="50"
          y="96"
          textAnchor="middle"
          fill={variant === "crew" ? "#c9a27c" : "#8a8a8a"}
          fontSize="8"
          fontFamily="IBM Plex Mono, ui-monospace, monospace"
        >
          {person.id}
        </text>
      ) : null}
    </svg>
  );
}
