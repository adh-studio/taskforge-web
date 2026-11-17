import {
  PRIORITY_ORDER,
  STATUSES,
  type Status,
  type Task,
} from "@/features/tasks/types";
import type { Filters } from "./boardReducer";

// Applique les filtres actifs a la liste des taches. Fonction pure.
export function filterTasks(tasks: Task[], filters: Filters): Task[] {
  const search = filters.search.trim().toLowerCase();
  return tasks.filter((task) => {
    if (filters.priority !== "all" && task.priority !== filters.priority) {
      return false;
    }
    if (filters.assignee !== "all" && task.assignee !== filters.assignee) {
      return false;
    }
    if (search.length > 0) {
      const haystack = `${task.title} ${task.description}`.toLowerCase();
      if (!haystack.includes(search)) {
        return false;
      }
    }
    return true;
  });
}

// Regroupe les taches par statut, triees par priorite decroissante.
export function groupByStatus(tasks: Task[]): Record<Status, Task[]> {
  const groups = Object.fromEntries(
    STATUSES.map((status) => [status, [] as Task[]]),
  ) as Record<Status, Task[]>;

  for (const task of tasks) {
    groups[task.status].push(task);
  }

  for (const status of STATUSES) {
    groups[status].sort(
      (a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority],
    );
  }

  return groups;
}

// Liste unique et triee des assignes presents dans les taches.
export function distinctAssignees(tasks: Task[]): string[] {
  const set = new Set<string>();
  for (const task of tasks) {
    if (task.assignee.trim().length > 0) {
      set.add(task.assignee);
    }
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b, "fr"));
}
