import { useState, type DragEvent } from "react";
import { STATUS_LABELS, type Status, type Task } from "@/features/tasks/types";
import { TaskCard } from "./TaskCard";

interface ColumnProps {
  status: Status;
  tasks: Task[];
  grabbedId: string | null;
  onEdit: (task: Task) => void;
  onGrabToggle: (task: Task) => void;
  onKeyMove: (task: Task, direction: "prev" | "next") => void;
  onDropTask: (status: Status) => void;
  onDragStart: (task: Task) => void;
  onDragEnd: () => void;
}

// Colonne du tableau. Zone de depot pour le glisser deposer souris.
export function Column({
  status,
  tasks,
  grabbedId,
  onEdit,
  onGrabToggle,
  onKeyMove,
  onDropTask,
  onDragStart,
  onDragEnd,
}: ColumnProps) {
  const [over, setOver] = useState(false);

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    if (!over) {
      setOver(true);
    }
  }

  return (
    <section
      className="column"
      aria-label={`Colonne ${STATUS_LABELS[status]}, ${tasks.length} tache(s)`}
    >
      <header className="column__head">
        <h2 className="column__title">{STATUS_LABELS[status]}</h2>
        <span className="column__count" aria-hidden="true">
          {tasks.length}
        </span>
      </header>
      <div
        className="column__body"
        data-over={over}
        onDragOver={handleDragOver}
        onDragLeave={() => setOver(false)}
        onDrop={(event) => {
          event.preventDefault();
          setOver(false);
          onDropTask(status);
        }}
      >
        <ul className="column__list" aria-label={STATUS_LABELS[status]}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              grabbed={grabbedId === task.id}
              onEdit={onEdit}
              onGrabToggle={onGrabToggle}
              onKeyMove={onKeyMove}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
            />
          ))}
        </ul>
        {tasks.length === 0 && <p className="column__empty">Aucune tache.</p>}
      </div>
    </section>
  );
}
