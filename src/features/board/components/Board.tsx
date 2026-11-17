import { useMemo, useRef, useState } from "react";
import {
  STATUS_LABELS,
  STATUSES,
  type Status,
  type Task,
} from "@/features/tasks/types";
import { useBoard } from "@/state/BoardContext";
import { filterTasks, groupByStatus } from "@/state/selectors";
import { adjacentStatus } from "../statusNav";
import { Column } from "./Column";

interface BoardProps {
  onEdit: (task: Task) => void;
}

// Orchestration du tableau : filtrage, regroupement par colonne,
// deplacement souris et clavier, annonces pour lecteur d'ecran.
export function Board({ onEdit }: BoardProps) {
  const { state, moveTask } = useBoard();
  const [grabbedId, setGrabbedId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const draggingRef = useRef<Task | null>(null);

  const groups = useMemo(() => {
    const visible = filterTasks(state.tasks, state.filters);
    return groupByStatus(visible);
  }, [state.tasks, state.filters]);

  function announce(text: string) {
    setMessage(text);
  }

  function move(task: Task, target: Status) {
    void moveTask(task.id, target);
    announce(
      `${task.title} deplacee vers la colonne ${STATUS_LABELS[target]}.`,
    );
  }

  function handleGrabToggle(task: Task) {
    if (grabbedId === task.id) {
      setGrabbedId(null);
      announce(`${task.title} deposee.`);
    } else {
      setGrabbedId(task.id);
      announce(
        `${task.title} saisie. Utilisez les fleches gauche et droite pour changer de colonne, Entree pour deposer.`,
      );
    }
  }

  function handleKeyMove(task: Task, direction: "prev" | "next") {
    const target = adjacentStatus(task.status, direction);
    if (!target) {
      announce("Bord du tableau atteint.");
      return;
    }
    move(task, target);
  }

  function handleDropTask(target: Status) {
    const task = draggingRef.current;
    draggingRef.current = null;
    if (task && task.status !== target) {
      move(task, target);
    }
  }

  if (state.status === "loading" || state.status === "idle") {
    return (
      <p className="board__state" role="status">
        Chargement du tableau...
      </p>
    );
  }

  if (state.status === "error") {
    return (
      <p className="board__state board__state--error" role="alert">
        {state.error}
      </p>
    );
  }

  return (
    <>
      <div className="board" role="list" aria-label="Tableau Kanban des taches">
        {STATUSES.map((status) => (
          <Column
            key={status}
            status={status}
            tasks={groups[status]}
            grabbedId={grabbedId}
            onEdit={onEdit}
            onGrabToggle={handleGrabToggle}
            onKeyMove={handleKeyMove}
            onDropTask={handleDropTask}
            onDragStart={(task) => {
              draggingRef.current = task;
            }}
            onDragEnd={() => {
              draggingRef.current = null;
            }}
          />
        ))}
      </div>
      <div className="visually-hidden" role="status" aria-live="polite">
        {message}
      </div>
    </>
  );
}
