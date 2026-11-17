import { Suspense, lazy, useState } from "react";
import { Board } from "@/features/board/components/Board";
import { FilterBar } from "@/features/board/components/FilterBar";
import type { Task } from "@/features/tasks/types";
import { useBoard } from "@/state/BoardContext";
import { useTheme } from "@/theme/ThemeProvider";

// Le panneau n'est charge qu'a la premiere ouverture (code splitting).
const TaskPanel = lazy(() =>
  import("@/features/tasks/TaskPanel").then((module) => ({
    default: module.TaskPanel,
  })),
);

export function App() {
  const { mode } = useBoard();
  const { theme, toggle } = useTheme();
  const [panelOpen, setPanelOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);

  function openCreate() {
    setEditing(null);
    setPanelOpen(true);
  }

  function openEdit(task: Task) {
    setEditing(task);
    setPanelOpen(true);
  }

  return (
    <div className="app">
      <a className="skip-link" href="#contenu">
        Aller au contenu
      </a>
      <header className="app__header">
        <div className="app__brand">
          <h1>TaskForge</h1>
          {mode === "demo" && (
            <span className="badge badge--demo">Mode demo</span>
          )}
        </div>
        <div className="app__actions">
          <button
            type="button"
            className="btn btn--ghost"
            onClick={toggle}
            aria-pressed={theme === "dark"}
          >
            {theme === "dark" ? "Theme clair" : "Theme sombre"}
          </button>
          <button
            type="button"
            className="btn btn--primary"
            onClick={openCreate}
          >
            Nouvelle tache
          </button>
        </div>
      </header>

      <main id="contenu" className="app__main">
        <FilterBar />
        <Board onEdit={openEdit} />
      </main>

      <Suspense fallback={null}>
        <TaskPanel
          open={panelOpen}
          task={editing}
          onClose={() => setPanelOpen(false)}
        />
      </Suspense>
    </div>
  );
}
