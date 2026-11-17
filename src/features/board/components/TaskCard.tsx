import { type KeyboardEvent } from "react";
import {
  PRIORITY_LABELS,
  STATUS_LABELS,
  type Task,
} from "@/features/tasks/types";

interface TaskCardProps {
  task: Task;
  grabbed: boolean;
  onEdit: (task: Task) => void;
  onGrabToggle: (task: Task) => void;
  onKeyMove: (task: Task, direction: "prev" | "next") => void;
  onDragStart: (task: Task) => void;
  onDragEnd: () => void;
}

// Carte de tache. Deplacable a la souris (HTML5 drag) et au clavier
// (saisir avec Entree ou Espace, puis fleches gauche et droite).
export function TaskCard({
  task,
  grabbed,
  onEdit,
  onGrabToggle,
  onKeyMove,
  onDragStart,
  onDragEnd,
}: TaskCardProps) {
  function handleKeyDown(event: KeyboardEvent<HTMLLIElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onGrabToggle(task);
      return;
    }
    if (!grabbed) {
      return;
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      onKeyMove(task, "next");
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      onKeyMove(task, "prev");
    } else if (event.key === "Escape") {
      event.preventDefault();
      onGrabToggle(task);
    }
  }

  return (
    <li
      className="card"
      data-grabbed={grabbed}
      draggable
      tabIndex={0}
      aria-roledescription="Carte deplacable"
      aria-grabbed={grabbed}
      aria-label={`${task.title}, priorite ${PRIORITY_LABELS[task.priority]}, colonne ${STATUS_LABELS[task.status]}`}
      onKeyDown={handleKeyDown}
      onDragStart={(event) => {
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", task.id);
        onDragStart(task);
      }}
      onDragEnd={onDragEnd}
    >
      <div className="card__head">
        <span className={`badge badge--${task.priority}`}>
          {PRIORITY_LABELS[task.priority]}
        </span>
        <button
          type="button"
          className="card__edit"
          onClick={() => onEdit(task)}
          aria-label={`Modifier la tache ${task.title}`}
        >
          Modifier
        </button>
      </div>
      <h3 className="card__title">{task.title}</h3>
      {task.description.length > 0 && (
        <p className="card__desc">{task.description}</p>
      )}
      <div className="card__foot">
        <span className="card__assignee">
          {task.assignee.trim().length > 0 ? task.assignee : "Non assigne"}
        </span>
        <span className="card__id">{task.id}</span>
      </div>
    </li>
  );
}
