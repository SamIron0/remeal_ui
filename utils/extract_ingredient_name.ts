import { callLLM } from "./helpers";
import { normalizeIngredient } from "./helpers";

export async function extractIngredientName(input: string): Promise<string> {
  const prompt = `
    Extract the main ingredient name from the following ingredient description:
    "${input}"

    Respond with ONLY the single main ingredient name, nothing else. If there are multiple ingredients, choose the most prominent one.
  `;

  try {
    const response = await callLLM(prompt);
    console.log("LLM response:", response);

    const extractedIngredient = response;
    const normalizedIngredient = normalizeIngredient(extractedIngredient);

    console.log("Normalized ingredient:", normalizedIngredient);
    return normalizedIngredient;
  } catch (error) {
    console.error("Error extracting ingredient name:", error);
    return normalizeIngredient(input); // Normalize the original input if extraction fails
  }
}
