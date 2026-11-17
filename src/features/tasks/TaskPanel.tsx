import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  PRIORITIES,
  PRIORITY_LABELS,
  STATUS_LABELS,
  STATUSES,
  type Priority,
  type Status,
  type Task,
  type TaskDraft,
} from "./types";
import { validateDraft, type FieldErrors } from "./validation";
import { useBoard } from "@/state/BoardContext";

interface TaskPanelProps {
  open: boolean;
  // Tache a editer, ou null pour une creation.
  task: Task | null;
  onClose: () => void;
}

const emptyDraft: TaskDraft = {
  title: "",
  description: "",
  status: "todo",
  priority: "medium",
  assignee: "",
};

function toDraft(task: Task | null): TaskDraft {
  if (!task) {
    return { ...emptyDraft };
  }
  const { title, description, status, priority, assignee } = task;
  return { title, description, status, priority, assignee };
}

// Panneau lateral de creation et d'edition d'une tache.
export function TaskPanel({ open, task, onClose }: TaskPanelProps) {
  const { createTask, updateTask, removeTask } = useBoard();
  const [draft, setDraft] = useState<TaskDraft>(() => toDraft(task));
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);

  // Synchronise le formulaire a l'ouverture et met le focus sur le titre.
  useEffect(() => {
    if (open) {
      setDraft(toDraft(task));
      setErrors({});
      const id = window.setTimeout(() => titleRef.current?.focus(), 0);
      return () => window.clearTimeout(id);
    }
    return undefined;
  }, [open, task]);

  if (!open) {
    return null;
  }

  function patch<K extends keyof TaskDraft>(key: K, value: TaskDraft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const found = validateDraft(draft);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      return;
    }
    setSubmitting(true);
    try {
      const payload: TaskDraft = { ...draft, title: draft.title.trim() };
      if (task) {
        await updateTask(task.id, payload);
      } else {
        await createTask(payload);
      }
      onClose();
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!task) {
      return;
    }
    setSubmitting(true);
    try {
      await removeTask(task.id);
      onClose();
    } finally {
      setSubmitting(false);
    }
  }

  const titleId = "task-panel-title";

  return (
    <div className="panel-overlay" onClick={onClose}>
      <aside
        className="panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            onClose();
          }
        }}
      >
        <header className="panel__head">
          <h2 id={titleId}>{task ? "Modifier la tache" : "Nouvelle tache"}</h2>
          <button
            type="button"
            className="panel__close"
            onClick={onClose}
            aria-label="Fermer le panneau"
          >
            Fermer
          </button>
        </header>

        <form className="panel__form" onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="task-title">Titre</label>
            <input
              id="task-title"
              ref={titleRef}
              type="text"
              value={draft.title}
              aria-invalid={Boolean(errors.title)}
              aria-describedby={errors.title ? "err-title" : undefined}
              onChange={(event) => patch("title", event.target.value)}
            />
            {errors.title && (
              <p id="err-title" className="field__error" role="alert">
                {errors.title}
              </p>
            )}
          </div>

          <div className="field">
            <label htmlFor="task-desc">Description</label>
            <textarea
              id="task-desc"
              rows={4}
              value={draft.description}
              onChange={(event) => patch("description", event.target.value)}
            />
            {errors.description && (
              <p className="field__error" role="alert">
                {errors.description}
              </p>
            )}
          </div>

          <div className="field field--row">
            <div>
              <label htmlFor="task-status">Statut</label>
              <select
                id="task-status"
                value={draft.status}
                onChange={(event) =>
                  patch("status", event.target.value as Status)
                }
              >
                {STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {STATUS_LABELS[status]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="task-priority">Priorite</label>
              <select
                id="task-priority"
                value={draft.priority}
                onChange={(event) =>
                  patch("priority", event.target.value as Priority)
                }
              >
                {PRIORITIES.map((priority) => (
                  <option key={priority} value={priority}>
                    {PRIORITY_LABELS[priority]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="field">
            <label htmlFor="task-assignee">Assigne</label>
            <input
              id="task-assignee"
              type="text"
              value={draft.assignee}
              onChange={(event) => patch("assignee", event.target.value)}
            />
          </div>

          <div className="panel__actions">
            {task && (
              <button
                type="button"
                className="btn btn--danger"
                onClick={handleDelete}
                disabled={submitting}
              >
                Supprimer
              </button>
            )}
            <button
              type="submit"
              className="btn btn--primary"
              disabled={submitting}
            >
              {task ? "Enregistrer" : "Creer la tache"}
            </button>
          </div>
        </form>
      </aside>
    </div>
  );
}
