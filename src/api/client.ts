import type { Task, TaskDraft } from "@/features/tasks/types";
import { demoTasks } from "./demoData";

// Contrat du client de donnees. Deux implementations le respectent :
// un client HTTP reel et un client demo en memoire. Le reste de
// l'application ne depend que de cette interface (inversion de dependance).
export interface TaskApi {
  readonly mode: "http" | "demo";
  list(): Promise<Task[]>;
  create(draft: TaskDraft): Promise<Task>;
  update(id: string, patch: Partial<TaskDraft>): Promise<Task>;
  remove(id: string): Promise<void>;
}

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function genId(): string {
  // crypto.randomUUID est disponible dans les navigateurs modernes ;
  // repli simple pour les environnements qui ne l'exposent pas.
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `tf-${Math.random().toString(36).slice(2, 10)}`;
}

// Client HTTP type s'appuyant sur fetch et une API REST externe.
export class HttpTaskApi implements TaskApi {
  readonly mode = "http" as const;

  constructor(private readonly baseUrl: string) {}

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    let response: Response;
    try {
      response = await fetch(`${this.baseUrl}${path}`, {
        headers: { "Content-Type": "application/json" },
        ...init,
      });
    } catch {
      throw new ApiError("Reseau indisponible.", undefined);
    }
    if (!response.ok) {
      throw new ApiError(
        `Requete echouee (${response.status}).`,
        response.status,
      );
    }
    if (response.status === 204) {
      return undefined as T;
    }
    return (await response.json()) as T;
  }

  list(): Promise<Task[]> {
    return this.request<Task[]>("/tasks");
  }

  create(draft: TaskDraft): Promise<Task> {
    return this.request<Task>("/tasks", {
      method: "POST",
      body: JSON.stringify(draft),
    });
  }

  update(id: string, patch: Partial<TaskDraft>): Promise<Task> {
    return this.request<Task>(`/tasks/${id}`, {
      method: "PATCH",
      body: JSON.stringify(patch),
    });
  }

  async remove(id: string): Promise<void> {
    await this.request<void>(`/tasks/${id}`, { method: "DELETE" });
  }
}

// Client demo en memoire, garde l'etat pendant la session pour que la
// demonstration fonctionne sans backend. La latence simule un vrai reseau.
export class DemoTaskApi implements TaskApi {
  readonly mode = "demo" as const;
  private tasks: Task[];

  constructor(seed: Task[] = demoTasks) {
    this.tasks = seed.map((task) => ({ ...task }));
  }

  private delay<T>(value: T): Promise<T> {
    return new Promise((resolve) => setTimeout(() => resolve(value), 120));
  }

  list(): Promise<Task[]> {
    return this.delay(this.tasks.map((task) => ({ ...task })));
  }

  create(draft: TaskDraft): Promise<Task> {
    const task: Task = {
      ...draft,
      id: genId(),
      createdAt: new Date().toISOString(),
    };
    this.tasks = [task, ...this.tasks];
    return this.delay({ ...task });
  }

  update(id: string, patch: Partial<TaskDraft>): Promise<Task> {
    const current = this.tasks.find((task) => task.id === id);
    if (!current) {
      return Promise.reject(new ApiError("Tache introuvable.", 404));
    }
    const next: Task = { ...current, ...patch };
    this.tasks = this.tasks.map((task) => (task.id === id ? next : task));
    return this.delay({ ...next });
  }

  remove(id: string): Promise<void> {
    this.tasks = this.tasks.filter((task) => task.id !== id);
    return this.delay(undefined);
  }
}

// Fabrique le client adapte a l'environnement. Si VITE_API_URL est absent,
// on bascule automatiquement en mode demo.
export function createTaskApi(apiUrl: string | undefined): TaskApi {
  const trimmed = apiUrl?.trim();
  if (trimmed) {
    return new HttpTaskApi(trimmed.replace(/\/$/, ""));
  }
  return new DemoTaskApi();
}
