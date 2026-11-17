import { STATUSES, type Status } from "@/features/tasks/types";

// Statut adjacent dans la direction donnee, ou null si on est au bord.
// Fonction pure, utilisee par le deplacement clavier et les boutons.
export function adjacentStatus(
  status: Status,
  direction: "prev" | "next",
): Status | null {
  const index = STATUSES.indexOf(status);
  const target = direction === "next" ? index + 1 : index - 1;
  if (target < 0 || target >= STATUSES.length) {
    return null;
  }
  return STATUSES[target] as Status;
}
