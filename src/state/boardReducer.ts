import type { Priority, Status, Task } from "@/features/tasks/types";

export interface Filters {
  priority: Priority | "all";
  assignee: string | "all";
  search: string;
}

export interface BoardState {
  tasks: Task[];
  status: "idle" | "loading" | "ready" | "error";
  error: string | null;
  filters: Filters;
}

export const initialFilters: Filters = {
  priority: "all",
  assignee: "all",
  search: "",
};

export const initialBoardState: BoardState = {
  tasks: [],
  status: "idle",
  error: null,
  filters: initialFilters,
};

export type BoardAction =
  | { type: "load_start" }
  | { type: "load_success"; tasks: Task[] }
  | { type: "load_error"; message: string }
  | { type: "task_upserted"; task: Task }
  | { type: "task_removed"; id: string }
  | { type: "task_moved"; id: string; status: Status }
  | { type: "set_filter_priority"; priority: Priority | "all" }
  | { type: "set_filter_assignee"; assignee: string | "all" }
  | { type: "set_search"; search: string };

// Reducer pur : aucune dependance externe, entierement testable.
export function boardReducer(
  state: BoardState,
  action: BoardAction,
): BoardState {
  switch (action.type) {
    case "load_start":
      return { ...state, status: "loading", error: null };

    case "load_success":
      return { ...state, status: "ready", error: null, tasks: action.tasks };

    case "load_error":
      return { ...state, status: "error", error: action.message };

    case "task_upserted": {
      const exists = state.tasks.some((task) => task.id === action.task.id);
      const tasks = exists
        ? state.tasks.map((task) =>
            task.id === action.task.id ? action.task : task,
          )
        : [action.task, ...state.tasks];
      return { ...state, tasks };
    }

    case "task_removed":
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.id),
      };

    case "task_moved":
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.id ? { ...task, status: action.status } : task,
        ),
      };

    case "set_filter_priority":
      return {
        ...state,
        filters: { ...state.filters, priority: action.priority },
      };

    case "set_filter_assignee":
      return {
        ...state,
        filters: { ...state.filters, assignee: action.assignee },
      };

    case "set_search":
      return { ...state, filters: { ...state.filters, search: action.search } };

    default:
      return state;
  }
}
