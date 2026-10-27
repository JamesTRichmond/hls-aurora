import { useRef, type PointerEvent } from "react";

export function usePointerDrag(onMove: (nx: number, ny: number) => void, onEnd: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  const pid = useRef<number | null>(null);

  const read = (e: PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
    const ny = ((e.clientY - r.top) / r.height) * 2 - 1;
    onMove(nx, ny);
  };

  return {
    ref,
    onDown: (e: PointerEvent<HTMLDivElement>) => {
      pid.current = e.pointerId;
      e.currentTarget.setPointerCapture(e.pointerId);
      read(e);
    },
    onMove: (e: PointerEvent<HTMLDivElement>) => {
      if (pid.current !== e.pointerId) return;
      read(e);
    },
    onUp: (e: PointerEvent<HTMLDivElement>) => {
      if (pid.current !== e.pointerId) return;
      pid.current = null;
      onEnd();
    },
  };
}