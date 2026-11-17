import { describe, expect, it } from "vitest";
import {
  boardReducer,
  initialBoardState,
  type BoardState,
} from "./boardReducer";
import type { Task } from "@/features/tasks/types";

const task: Task = {
  id: "a1",
  title: "Tache A",
  description: "",
  status: "todo",
  priority: "medium",
  assignee: "Heni",
  createdAt: "2026-01-01T00:00:00.000Z",
};

describe("boardReducer", () => {
  it("charge les taches avec load_success", () => {
    const next = boardReducer(initialBoardState, {
      type: "load_success",
      tasks: [task],
    });
    expect(next.status).toBe("ready");
    expect(next.tasks).toHaveLength(1);
  });

  it("deplace une tache en changeant son statut", () => {
    const base: BoardState = { ...initialBoardState, tasks: [task] };
    const next = boardReducer(base, {
      type: "task_moved",
      id: "a1",
      status: "in_progress",
    });
    expect(next.tasks[0]?.status).toBe("in_progress");
  });

  it("ajoute une tache absente avec task_upserted", () => {
    const base: BoardState = { ...initialBoardState, tasks: [] };
    const next = boardReducer(base, { type: "task_upserted", task });
    expect(next.tasks).toHaveLength(1);
  });

  it("met a jour une tache existante avec task_upserted", () => {
    const base: BoardState = { ...initialBoardState, tasks: [task] };
    const next = boardReducer(base, {
      type: "task_upserted",
      task: { ...task, title: "Renomme" },
    });
    expect(next.tasks).toHaveLength(1);
    expect(next.tasks[0]?.title).toBe("Renomme");
  });

  it("retire une tache avec task_removed", () => {
    const base: BoardState = { ...initialBoardState, tasks: [task] };
    const next = boardReducer(base, { type: "task_removed", id: "a1" });
    expect(next.tasks).toHaveLength(0);
  });

  it("met a jour le filtre de priorite", () => {
    const next = boardReducer(initialBoardState, {
      type: "set_filter_priority",
      priority: "high",
    });
    expect(next.filters.priority).toBe("high");
  });
});
