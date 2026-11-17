import { PRIORITIES, STATUSES, type TaskDraft } from "./types";

export type FieldErrors = Partial<Record<keyof TaskDraft, string>>;

// Validation pure et testable du formulaire de tache.
// Retourne un dictionnaire d'erreurs vide si le brouillon est valide.
export function validateDraft(draft: TaskDraft): FieldErrors {
  const errors: FieldErrors = {};

  const title = draft.title.trim();
  if (title.length === 0) {
    errors.title = "Le titre est obligatoire.";
  } else if (title.length > 120) {
    errors.title = "Le titre ne doit pas depasser 120 caracteres.";
  }

  if (draft.description.length > 2000) {
    errors.description = "La description est trop longue.";
  }

  if (!STATUSES.includes(draft.status)) {
    errors.status = "Statut invalide.";
  }

  if (!PRIORITIES.includes(draft.priority)) {
    errors.priority = "Priorite invalide.";
  }

  if (draft.assignee.trim().length > 80) {
    errors.assignee = "Le nom de l'assigne est trop long.";
  }

  return errors;
}

export function isDraftValid(draft: TaskDraft): boolean {
  return Object.keys(validateDraft(draft)).length === 0;
}
