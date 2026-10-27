import { createFileRoute } from "@tanstack/react-router";
import { Archive } from "@/components/archive/Archive";

const TABS = ["spec", "table", "systems", "contact", "degrees", "thesis"] as const;
type Tab = (typeof TABS)[number];

function isTab(v: unknown): v is Tab {
  return typeof v === "string" && (TABS as readonly string[]).includes(v);
}

export const Route = createFileRoute("/archive")({
  validateSearch: (search: Record<string, unknown>): { tab: Tab } => ({
    tab: isTab(search.tab) ? search.tab : "spec",
  }),
  component: ArchivePage,
});

function ArchivePage() {
  const { tab } = Route.useSearch();
  return <Archive tab={tab} />;
}
