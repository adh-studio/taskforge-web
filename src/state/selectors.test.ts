import { describe, expect, it } from "vitest";
import { distinctAssignees, filterTasks, groupByStatus } from "./selectors";
import { initialFilters } from "./boardReducer";
import type { Task } from "@/features/tasks/types";

const tasks: Task[] = [
  {
    id: "1",
    title: "Brancher l'API",
    description: "client fetch",
    status: "todo",
    priority: "high",
    assignee: "Heni",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "2",
    title: "Theme sombre",
    description: "contraste",
    status: "todo",
    priority: "low",
    assignee: "Rina",
    createdAt: "2026-01-02T00:00:00.000Z",
  },
  {
    id: "3",
    title: "Tests",
    description: "vitest",
    status: "done",
    priority: "urgent",
    assignee: "Heni",
    createdAt: "2026-01-03T00:00:00.000Z",
  },
];

describe("filterTasks", () => {
  it("filtre par priorite", () => {
    const result = filterTasks(tasks, { ...initialFilters, priority: "high" });
    expect(result).toHaveLength(1);
    expect(result[0]?.id).toBe("1");
  });

  it("filtre par assigne", () => {
    const result = filterTasks(tasks, {
      ...initialFilters,
      assignee: "Heni",
    });
    expect(result.map((t) => t.id)).toEqual(["1", "3"]);
  });

  it("filtre par recherche texte insensible a la casse", () => {
    const result = filterTasks(tasks, { ...initialFilters, search: "API" });
    expect(result).toHaveLength(1);
    expect(result[0]?.id).toBe("1");
  });
});

describe("groupByStatus", () => {
  it("regroupe par colonne et trie par priorite", () => {
    const groups = groupByStatus(tasks);
    expect(groups.todo.map((t) => t.id)).toEqual(["1", "2"]);
    expect(groups.done).toHaveLength(1);
    expect(groups.in_progress).toHaveLength(0);
  });
});

describe("distinctAssignees", () => {
  it("retourne la liste unique et triee", () => {
    expect(distinctAssignees(tasks)).toEqual(["Heni", "Rina"]);
  });
});
