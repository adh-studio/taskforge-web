import type { Task } from "@/features/tasks/types";

// Jeu de donnees du mode demo, utilise quand aucune API n'est configuree.
export const demoTasks: Task[] = [
  {
    id: "tf-101",
    title: "Cadrer le MVP du tableau Kanban",
    description:
      "Lister les colonnes, les champs d'une tache et les criteres d'acceptation.",
    status: "done",
    priority: "high",
    assignee: "Heni",
    createdAt: "2026-01-04T09:00:00.000Z",
  },
  {
    id: "tf-102",
    title: "Implementer le glisser deposer accessible",
    description:
      "Deplacement a la souris et au clavier, annonces pour lecteur d'ecran.",
    status: "in_progress",
    priority: "urgent",
    assignee: "Heni",
    createdAt: "2026-01-06T10:30:00.000Z",
  },
  {
    id: "tf-103",
    title: "Brancher le client API REST type",
    description:
      "Client fetch type avec bascule automatique vers le mode demo si absent.",
    status: "in_progress",
    priority: "medium",
    assignee: "Rina",
    createdAt: "2026-01-07T08:15:00.000Z",
  },
  {
    id: "tf-104",
    title: "Theme clair et sombre",
    description: "Respect des preferences systeme et contraste AA.",
    status: "review",
    priority: "low",
    assignee: "Rina",
    createdAt: "2026-01-08T14:45:00.000Z",
  },
  {
    id: "tf-105",
    title: "Filtres priorite, assigne et recherche",
    description: "Barre de filtres avec compteurs par colonne.",
    status: "todo",
    priority: "high",
    assignee: "Fanja",
    createdAt: "2026-01-09T11:20:00.000Z",
  },
  {
    id: "tf-106",
    title: "Couvrir le board par des tests",
    description: "Vitest et Testing Library sur les parcours critiques.",
    status: "todo",
    priority: "medium",
    assignee: "Heni",
    createdAt: "2026-01-10T16:05:00.000Z",
  },
];
