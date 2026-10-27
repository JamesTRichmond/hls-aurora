import { VIEWER, VOYAGE } from "@/lib/mission";
import { playInteract } from "@/lib/station/audio";
import { interactCopy, nearestFocus, type Focus } from "@/lib/station/sim";
import { WATCH_TASKS } from "@/lib/station/world";
import { useConsole } from "@/lib/store";

function clip(text: string, n = 96) {
  const t = text.replace(/\s+/g, " ").trim();
  return t.length <= n ? t : `${t.slice(0, n - 1)}…`;
}

export function performInteract(target?: Focus) {
  const s = useConsole.getState();
  const focus = target ?? nearestFocus();
  playInteract();
  if (!focus) {
    s.setCard({
      title: s.layer === "crew" ? "Empty air" : "No target",
      body:
        s.layer === "crew"
          ? "Nothing in reach. Walk to a board, a person, a window."
          : "No interactable in range.",
    });
    return;
  }
  const copy = interactCopy(s.layer, s.intent, focus, s.pulledOnce, s.letterTaken);
  s.setCard({
    title: copy.title,
    body: copy.body,
    personId: focus.type === "npc" ? focus.id : undefined,
    itemsLabel: copy.itemsLabel,
    items: copy.items,
  });
  s.pushRadio({
    channel: copy.channel,
    speaker: copy.speaker ?? (s.layer === "crew" ? VIEWER.given : "S-21"),
    text: clip(copy.radio ?? copy.body),
    layer: s.layer,
  });
  const wasComplete = s.watchComplete;
  if (s.intent === "use" && copy.task) s.markDone(copy.task);
  if (!wasComplete && useConsole.getState().watchComplete) {
    s.pushRadio({
      channel: s.layer === "crew" ? "watch" : "PX-04",
      speaker: s.layer === "crew" ? VIEWER.given : "ops",
      text:
        s.layer === "crew"
          ? "The watch is quiet. Batch E is down. You have the ship."
          : "S-21 close-out complete. Cycle 12 may proceed.",
      layer: s.layer,
    });
    s.setCard({
      title: s.layer === "crew" ? "Watch complete" : "Close-out",
      body:
        s.layer === "crew"
          ? s.pulledOnce
            ? "Five kindnesses done. The corridor is still holding. You have seen the other holding. The brass will keep."
            : "Five kindnesses done. The corridor is still holding. If you need to know more, the brass on the right is not part of the voyage."
          : `All ${WATCH_TASKS.length} assigned tasks ticked. Arm Cycle 12 from the workstation when ready.`,
    });
  }
  if (s.intent === "ask" && !s.asked[focus.id]) {
    s.markAsked(focus.id);
    s.pushRadio({
      channel: s.layer === "crew" ? "uplink" : "anomaly",
      speaker: s.layer === "crew" ? VIEWER.given : "flag",
      text:
        s.layer === "crew"
          ? `Outbound queued. Earth delay ${VOYAGE.commsDelay}.`
          : `Flag on ${focus.id} held.`,
      layer: s.layer,
    });
  }
  if (s.intent === "examine" && focus.type === "thing" && focus.id === "letter") {
    s.markLetterRead();
  }
  if (s.intent === "use" && focus.type === "thing" && (focus.id === "radio" || focus.id === "letter")) {
    s.setScreen("message");
    s.setPdaOpen(true);
  }
}
