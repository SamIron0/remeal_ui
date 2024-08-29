import axios from "axios";
import { callLLMJson } from "./helpers";
const USDA_API_KEY = process.env.USDA_API_KEY;
const USDA_API_URL = "https://api.nal.usda.gov/fdc/v1/foods/search";

interface USDAResult {
  fdcId: number;
  description: string;
  calories: number;
  protein: number;
  fat: number;
  carbohydrates: number;
}

async function fetchTopResults(query: string): Promise<USDAResult[]> {
  try {
    const response = await axios.get(USDA_API_URL, {
      params: {
        api_key: USDA_API_KEY,
        query: query,
        pageNumber: 1,
        pageSize: 3,
        dataType: "Foundation,SR Legacy",
        sortBy: "dataType.keyword",
        sortOrder: "asc",
      },
    });

    return response.data.foods.map((food: any) => ({
      fdcId: food.fdcId,
      description: food.description,
      calories:
        food.foodNutrients.find(
          (n: any) => n.nutrientName === "Energy (Atwater General Factors)"
        )?.value || 0,
      protein:
        food.foodNutrients.find((n: any) => n.nutrientName === "Protein")
          ?.value || 0,
      fat:
        food.foodNutrients.find(
          (n: any) => n.nutrientName === "Total lipid (fat)"
        )?.value || 0,
      carbohydrates:
        food.foodNutrients.find(
          (n: any) => n.nutrientName === "Carbohydrate, by difference"
        )?.value || 0,
    }));
  } catch (error) {
    console.error("Error fetching from USDA API:");
    throw error;
  }
}

async function analyzeResults(
  results: USDAResult[],
  query: string
): Promise<{ result: USDAResult; score: number }[]> {
    
  const prompt = `
    Analyze the relevance of these USDA food results for the ingredient query "${query}":
    ${results
      .map(
        (r) =>
          `- fdcId: ${r.fdcId}, Description: ${r.description} (Calories: ${r.calories}, Protein: ${r.protein}g, Fat: ${r.fat}g, Carbs: ${r.carbohydrates}g)`
      )
      .join("\n")}

    Rank these results based on their relevance to the query. Consider:
    1. Exact or close matches
    2. Common variations or alternative names
    3. Ingredient forms (e.g., fresh, dried, powdered)
    4. Culinary context

    Respond ONLY with a JSON array of objects, each containing the fdcId and a relevance score between 0 and 1, where 1 is most relevant. Example:
    [
      { "fdcId": 123456, "score": 0.95 },
      { "fdcId": 789012, "score": 0.80 },
      { "fdcId": 345678, "score": 0.65 }
    ]

    Do not include any explanations or additional text. Only the JSON array is allowed in your response.
  `;

  const llmResponse = await callLLMJson(prompt);
  const parsedResponse = JSON.parse(llmResponse);

  return results.map((result) => {
    const matchedResult = parsedResponse.find(
      (r: any) => r.fdcId === result.fdcId
    );
    return {
      result,
      score: matchedResult ? matchedResult.score : 0,
    };
  });
}


function selectBestMatch(
  analyzedResults: { result: USDAResult; score: number }[]
): USDAResult {
  // Select the result with the highest score
  return analyzedResults.reduce((best, current) =>
    current.score > best.score ? current : best
  ).result;
}

export async function getTopNutritionMatch(
  ingredient: string
): Promise<USDAResult> {
  const topResults = await fetchTopResults(ingredient);
  const analyzedResults = await analyzeResults(topResults, ingredient);
  return selectBestMatch(analyzedResults);
}
