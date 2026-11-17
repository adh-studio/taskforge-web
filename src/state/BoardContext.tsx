import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import type { Priority, Status, TaskDraft } from "@/features/tasks/types";
import { createTaskApi, type TaskApi } from "@/api/client";
import {
  boardReducer,
  initialBoardState,
  type BoardState,
} from "./boardReducer";

// Operations exposees aux composants. L'etat brut reste encapsule et
// les composants declenchent les mutations via ces methodes.
export interface BoardContextValue {
  state: BoardState;
  mode: TaskApi["mode"];
  reload: () => Promise<void>;
  createTask: (draft: TaskDraft) => Promise<void>;
  updateTask: (id: string, patch: Partial<TaskDraft>) => Promise<void>;
  removeTask: (id: string) => Promise<void>;
  moveTask: (id: string, status: Status) => Promise<void>;
  setPriorityFilter: (priority: Priority | "all") => void;
  setAssigneeFilter: (assignee: string | "all") => void;
  setSearch: (search: string) => void;
}

const BoardContext = createContext<BoardContextValue | null>(null);

interface BoardProviderProps {
  children: ReactNode;
  // Injection possible d'un client (utile pour les tests). Par defaut on
  // fabrique le client en fonction de VITE_API_URL.
  api?: TaskApi;
}

export function BoardProvider({ children, api }: BoardProviderProps) {
  const client = useMemo(
    () => api ?? createTaskApi(import.meta.env.VITE_API_URL),
    [api],
  );
  const [state, dispatch] = useReducer(boardReducer, initialBoardState);

  const reload = useCallback(async () => {
    dispatch({ type: "load_start" });
    try {
      const tasks = await client.list();
      dispatch({ type: "load_success", tasks });
    } catch (error) {
      dispatch({
        type: "load_error",
        message:
          error instanceof Error
            ? error.message
            : "Chargement des taches impossible.",
      });
    }
  }, [client]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const createTask = useCallback(
    async (draft: TaskDraft) => {
      const task = await client.create(draft);
      dispatch({ type: "task_upserted", task });
    },
    [client],
  );

  const updateTask = useCallback(
    async (id: string, patch: Partial<TaskDraft>) => {
      const task = await client.update(id, patch);
      dispatch({ type: "task_upserted", task });
    },
    [client],
  );

  const removeTask = useCallback(
    async (id: string) => {
      await client.remove(id);
      dispatch({ type: "task_removed", id });
    },
    [client],
  );

  const moveTask = useCallback(
    async (id: string, status: Status) => {
      // Mise a jour optimiste : on deplace tout de suite puis on confirme.
      dispatch({ type: "task_moved", id, status });
      try {
        const task = await client.update(id, { status });
        dispatch({ type: "task_upserted", task });
      } catch (error) {
        // En cas d'echec on recharge pour revenir a l'etat serveur.
        void reload();
        throw error;
      }
    },
    [client, reload],
  );

  const value = useMemo<BoardContextValue>(
    () => ({
      state,
      mode: client.mode,
      reload,
      createTask,
      updateTask,
      removeTask,
      moveTask,
      setPriorityFilter: (priority) =>
        dispatch({ type: "set_filter_priority", priority }),
      setAssigneeFilter: (assignee) =>
        dispatch({ type: "set_filter_assignee", assignee }),
      setSearch: (search) => dispatch({ type: "set_search", search }),
    }),
    [state, client.mode, reload, createTask, updateTask, removeTask, moveTask],
  );

  return (
    <BoardContext.Provider value={value}>{children}</BoardContext.Provider>
  );
}

export function useBoard(): BoardContextValue {
  const ctx = useContext(BoardContext);
  if (!ctx) {
    throw new Error("useBoard doit etre utilise dans un BoardProvider.");
  }
  return ctx;
}
