import { createFileRoute } from "@tanstack/react-router";
import { RevealPair } from "@/components/reveal/RevealPair";
import { REVEAL_PAIRS } from "@/lib/mission";

export const Route = createFileRoute("/reveal/$pair")({
  component: RevealPage,
});

function RevealPage() {
  const { pair } = Route.useParams();
  const known = REVEAL_PAIRS.some((p) => p.id === pair);
  return <RevealPair pairId={known ? pair : "wake"} />;
}
