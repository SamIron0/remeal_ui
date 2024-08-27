export function normalizeIngredient(ingredient: string): string {
    return ingredient
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .replace(/\b(s|es)$/, "")
      .trim();
  }
  