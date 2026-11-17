import { describe, expect, it, vi } from "vitest";
import { fireEvent, screen, waitFor, within } from "@testing-library/react";
import { Board } from "./Board";
import { renderWithProviders } from "@/test/renderBoard";
import type { Task } from "@/features/tasks/types";

const seed: Task[] = [
  {
    id: "alpha",
    title: "Alpha",
    description: "premiere tache",
    status: "todo",
    priority: "high",
    assignee: "Heni",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "beta",
    title: "Beta",
    description: "seconde tache",
    status: "done",
    priority: "low",
    assignee: "Rina",
    createdAt: "2026-01-02T00:00:00.000Z",
  },
];

describe("Board", () => {
  it("rend les quatre colonnes et les cartes", async () => {
    renderWithProviders(<Board onEdit={vi.fn()} />, seed);

    expect(await screen.findByText("Alpha")).toBeInTheDocument();
    expect(
      screen.getByRole("list", { name: /Tableau Kanban/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("region", { name: /Colonne A faire/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("region", { name: /Colonne Termine/ }),
    ).toBeInTheDocument();
  });

  it("deplace une carte vers la colonne suivante au clavier", async () => {
    renderWithProviders(<Board onEdit={vi.fn()} />, seed);

    const card = await screen.findByRole("listitem", { name: /^Alpha/ });
    expect(card).toHaveAttribute(
      "aria-label",
      expect.stringContaining("colonne A faire"),
    );

    // Saisir la carte puis la pousser d'une colonne vers la droite.
    fireEvent.keyDown(card, { key: " " });
    fireEvent.keyDown(card, { key: "ArrowRight" });

    await waitFor(() => {
      expect(screen.getByRole("listitem", { name: /^Alpha/ })).toHaveAttribute(
        "aria-label",
        expect.stringContaining("colonne En cours"),
      );
    });

    // La carte se trouve desormais dans la colonne En cours.
    const inProgress = screen.getByRole("region", { name: /Colonne En cours/ });
    expect(within(inProgress).getByText("Alpha")).toBeInTheDocument();
  });
});
