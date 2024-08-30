import {  callLLMJson } from "./helpers";

export async function getNutritionInfo(ingredient: string): Promise<{
  calories: number;
  protein: number;
  fat: number;
  carbohydrates: number;
}> {
  console.log(`Getting nutrition info for: ${ingredient}`);
  const prompt = `
    Provide the nutritional information for 100 grams of ${ingredient}.
    Return only a JSON object with the following properties:
    {
      "calories": number,
      "protein": number (in grams),
      "fat": number (in grams),
      "carbohydrates": number (in grams)
    }
    Do not include any explanations or additional text.
  `;

  try {
    console.log("Calling LLM for nutrition info");
    const response = await callLLMJson(prompt);
    console.log("LLM response:", JSON.stringify(response));
    
    // Parse the JSON string into an object
    const parsedResponse = JSON.parse(response);
    console.log("Parsed response:", JSON.stringify(parsedResponse));

    if (isNutritionInfo(parsedResponse)) {
      console.log("Valid nutrition info received");
      return parsedResponse;
    }
    console.error("Invalid nutrition info format:", JSON.stringify(parsedResponse));
    throw new Error('Invalid nutrition info format');
  } catch (error) {
    console.error(`Error getting nutrition info for ${ingredient}:`, error);
    return {
      calories: 0,
      protein: 0,
      fat: 0,
      carbohydrates: 0,
    };
  }
}

// Update the type guard function
function isNutritionInfo(obj: any): obj is { calories: number; protein: number; fat: number; carbohydrates: number } {
  console.log("Checking if object is valid nutrition info:", JSON.stringify(obj));
  const isValid = typeof obj === 'object' && obj !== null &&
    typeof obj.calories === 'number' &&
    typeof obj.protein === 'number' &&
    typeof obj.fat === 'number' &&
    typeof obj.carbohydrates === 'number';
  console.log("Is valid nutrition info:", isValid);
  return isValid;
}
