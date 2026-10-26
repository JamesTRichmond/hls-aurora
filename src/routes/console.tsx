import { createFileRoute } from "@tanstack/react-router";
import { ConsoleStage } from "@/components/console/ConsoleStage";

export const Route = createFileRoute("/console")({ component: ConsoleStage });
