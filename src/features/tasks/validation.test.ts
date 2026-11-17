import { describe, expect, it } from "vitest";
import { isDraftValid, validateDraft } from "./validation";
import type { TaskDraft } from "./types";

const valid: TaskDraft = {
  title: "Titre correct",
  description: "",
  status: "todo",
  priority: "medium",
  assignee: "Heni",
};

describe("validateDraft", () => {
  it("accepte un brouillon valide", () => {
    expect(validateDraft(valid)).toEqual({});
    expect(isDraftValid(valid)).toBe(true);
  });

  it("refuse un titre vide", () => {
    const errors = validateDraft({ ...valid, title: "   " });
    expect(errors.title).toBeDefined();
    expect(isDraftValid({ ...valid, title: "" })).toBe(false);
  });

  it("refuse un titre trop long", () => {
    const errors = validateDraft({ ...valid, title: "x".repeat(121) });
    expect(errors.title).toBeDefined();
  });
});
