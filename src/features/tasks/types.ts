// Modele de domaine partage par le tableau Kanban.

export const STATUSES = ["todo", "in_progress", "review", "done"] as const;
export type Status = (typeof STATUSES)[number];

export const PRIORITIES = ["low", "medium", "high", "urgent"] as const;
export type Priority = (typeof PRIORITIES)[number];

export interface Task {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  assignee: string;
  createdAt: string;
}

// Donnees saisies dans le formulaire de creation ou d'edition.
export interface TaskDraft {
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  assignee: string;
}

export const STATUS_LABELS: Record<Status, string> = {
  todo: "A faire",
  in_progress: "En cours",
  review: "En revue",
  done: "Termine",
};

export const PRIORITY_LABELS: Record<Priority, string> = {
  low: "Basse",
  medium: "Moyenne",
  high: "Haute",
  urgent: "Urgente",
};

// Ordre de tri des priorites (urgent en premier).
export const PRIORITY_ORDER: Record<Priority, number> = {
  urgent: 0,
  high: 1,
  medium: 2,
  low: 3,
};
