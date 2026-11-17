import { afterEach, describe, expect, it, vi } from "vitest";
import { ApiError, DemoTaskApi, HttpTaskApi, createTaskApi } from "./client";
import type { Task, TaskDraft } from "@/features/tasks/types";

const draft: TaskDraft = {
  title: "Nouvelle",
  description: "",
  status: "todo",
  priority: "low",
  assignee: "Heni",
};

describe("DemoTaskApi", () => {
  it("liste, cree, met a jour et supprime en memoire", async () => {
    const api = new DemoTaskApi([]);
    expect(await api.list()).toHaveLength(0);

    const created = await api.create(draft);
    expect(created.id).toBeTruthy();
    expect(await api.list()).toHaveLength(1);

    const updated = await api.update(created.id, { status: "done" });
    expect(updated.status).toBe("done");

    await api.remove(created.id);
    expect(await api.list()).toHaveLength(0);
  });

  it("rejette la mise a jour d'une tache inexistante", async () => {
    const api = new DemoTaskApi([]);
    await expect(
      api.update("absent", { status: "done" }),
    ).rejects.toBeInstanceOf(ApiError);
  });
});

describe("HttpTaskApi", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("appelle l'endpoint tasks et renvoie le JSON", async () => {
    const payload: Task[] = [
      {
        id: "x1",
        title: "Depuis API",
        description: "",
        status: "todo",
        priority: "medium",
        assignee: "Heni",
        createdAt: "2026-01-01T00:00:00.000Z",
      },
    ];
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => payload,
    });
    vi.stubGlobal("fetch", fetchMock);

    const api = new HttpTaskApi("https://api.test");
    const tasks = await api.list();

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.test/tasks",
      expect.objectContaining({
        headers: { "Content-Type": "application/json" },
      }),
    );
    expect(tasks[0]?.id).toBe("x1");
  });

  it("leve une ApiError sur reponse non ok", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, status: 500 }),
    );
    const api = new HttpTaskApi("https://api.test");
    await expect(api.list()).rejects.toBeInstanceOf(ApiError);
  });
});

describe("createTaskApi", () => {
  it("retourne un client demo sans URL", () => {
    expect(createTaskApi(undefined).mode).toBe("demo");
    expect(createTaskApi("  ").mode).toBe("demo");
  });

  it("retourne un client http avec une URL", () => {
    expect(createTaskApi("https://api.test").mode).toBe("http");
  });
});
