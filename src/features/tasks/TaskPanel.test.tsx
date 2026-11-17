import { describe, expect, it, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TaskPanel } from "./TaskPanel";
import { renderWithProviders } from "@/test/renderBoard";

describe("TaskPanel", () => {
  it("affiche une erreur quand le titre est vide", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderWithProviders(<TaskPanel open task={null} onClose={onClose} />, []);

    await user.click(screen.getByRole("button", { name: "Creer la tache" }));

    expect(
      await screen.findByText("Le titre est obligatoire."),
    ).toBeInTheDocument();
    expect(onClose).not.toHaveBeenCalled();
  });

  it("cree la tache et ferme le panneau quand le formulaire est valide", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderWithProviders(<TaskPanel open task={null} onClose={onClose} />, []);

    await user.type(screen.getByLabelText("Titre"), "Tache de test");
    await user.click(screen.getByRole("button", { name: "Creer la tache" }));

    await waitFor(() => {
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });
});
