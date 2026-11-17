import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { BoardProvider } from "@/state/BoardContext";
import { ThemeProvider } from "@/theme/ThemeProvider";
import { DemoTaskApi } from "@/api/client";
import type { Task } from "@/features/tasks/types";

// Rendu d'un composant dans les contextes applicatifs avec un client
// demo isole, ce qui rend chaque test independant et deterministe.
export function renderWithProviders(ui: ReactElement, seed?: Task[]) {
  const api = new DemoTaskApi(seed);
  const result = render(
    <ThemeProvider>
      <BoardProvider api={api}>{ui}</BoardProvider>
    </ThemeProvider>,
  );
  return { ...result, api };
}
