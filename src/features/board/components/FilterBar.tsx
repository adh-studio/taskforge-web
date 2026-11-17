import { useMemo } from "react";
import {
  PRIORITIES,
  PRIORITY_LABELS,
  type Priority,
} from "@/features/tasks/types";
import { useBoard } from "@/state/BoardContext";
import { distinctAssignees } from "@/state/selectors";

// Barre de filtres : recherche plein texte, priorite et assigne.
export function FilterBar() {
  const { state, setPriorityFilter, setAssigneeFilter, setSearch } = useBoard();
  const assignees = useMemo(
    () => distinctAssignees(state.tasks),
    [state.tasks],
  );

  return (
    <div className="filters" role="search">
      <div className="filters__field">
        <label htmlFor="filter-search">Recherche</label>
        <input
          id="filter-search"
          type="search"
          placeholder="Titre ou description"
          value={state.filters.search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      <div className="filters__field">
        <label htmlFor="filter-priority">Priorite</label>
        <select
          id="filter-priority"
          value={state.filters.priority}
          onChange={(event) =>
            setPriorityFilter(event.target.value as Priority | "all")
          }
        >
          <option value="all">Toutes</option>
          {PRIORITIES.map((priority) => (
            <option key={priority} value={priority}>
              {PRIORITY_LABELS[priority]}
            </option>
          ))}
        </select>
      </div>

      <div className="filters__field">
        <label htmlFor="filter-assignee">Assigne</label>
        <select
          id="filter-assignee"
          value={state.filters.assignee}
          onChange={(event) => setAssigneeFilter(event.target.value)}
        >
          <option value="all">Tous</option>
          {assignees.map((assignee) => (
            <option key={assignee} value={assignee}>
              {assignee}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
