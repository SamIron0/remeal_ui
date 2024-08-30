import { NextResponse } from "next/server";
import { callLLMJson } from "@/utils/helpers";

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();
    const recipePrompt = `Generate a recipe based on the following prompt: "${prompt}". 
    Return a JSON object with the following structure:
    {
      "name": "Recipe Name",
      "description": "Brief description",
      "ingredients": ["ingredient 1", "ingredient 2", ...],
      "instructions": "Step-by-step instructions",
      "cook_time": number (in minutes),
      "prep_time": number (in minutes),
      "servings": number
    }`;

    const generatedRecipe = await callLLMJson(recipePrompt);
    return NextResponse.json(JSON.parse(generatedRecipe));
  } catch (error: any) {
    console.error("Error in AI recipe generation:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
