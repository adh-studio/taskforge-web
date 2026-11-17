import { describe, expect, it, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FilterBar } from "./FilterBar";
import { Board } from "./Board";
import { renderWithProviders } from "@/test/renderBoard";
import type { Task } from "@/features/tasks/types";

const seed: Task[] = [
  {
    id: "alpha",
    title: "Alpha haute",
    description: "",
    status: "todo",
    priority: "high",
    assignee: "Heni",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "beta",
    title: "Beta basse",
    description: "",
    status: "todo",
    priority: "low",
    assignee: "Rina",
    createdAt: "2026-01-02T00:00:00.000Z",
  },
];

describe("FilterBar", () => {
  it("filtre les cartes affichees par priorite", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <>
        <FilterBar />
        <Board onEdit={vi.fn()} />
      </>,
      seed,
    );

    expect(await screen.findByText("Alpha haute")).toBeInTheDocument();
    expect(screen.getByText("Beta basse")).toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText("Priorite"), "high");

    await waitFor(() => {
      expect(screen.queryByText("Beta basse")).not.toBeInTheDocument();
    });
    expect(screen.getByText("Alpha haute")).toBeInTheDocument();
  });
});
