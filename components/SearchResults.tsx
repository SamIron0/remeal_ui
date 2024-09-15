import React from "react";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Recipe } from "@/types";
interface SearchResultsProps {
  recipes: Recipe[];
  loading: boolean;
  error: string | null;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  recipes,
  loading,
  error,
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Searching for recipes...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4 bg-red-100 rounded-lg">
        {error}
      </div>
    );
  }

  if (recipes.length === 0) {
    return (
      <div className="text-center p-4 bg-gray-100 rounded-lg">
        No recipes found with these ingredients. Try adding more!
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {recipes.map((recipe) => (
        <Link href={`/recipe/${recipe.id}`} key={recipe.id}>
          <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold mb-2">{recipe.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{recipe.description}</p>
            <div className="mb-2">
              <strong>Ingredients:</strong>
              <ul className="list-disc list-inside">
                {recipe.recipe_ingredients &&
                  recipe.recipe_ingredients
                    .slice(0, 3)
                    .map((ingredient, index) => (
                      <li key={index}>
                        {ingredient.quantity} {ingredient.unit}{" "}
                        {ingredient.ingredients?.name}
                      </li>
                    ))}
                {recipe.recipe_ingredients &&
                  recipe.recipe_ingredients.length > 3 && (
                    <li className="text-sm text-gray-500">
                      + {recipe.recipe_ingredients.length - 3} more
                    </li>
                  )}
              </ul>
            </div>
            {recipe.nutrition_info && (
              <div className="text-sm">
                <strong>Nutrition:</strong> {recipe.nutrition_info.calories}{" "}
                cal,
                {recipe.nutrition_info.protein}g protein,
                {recipe.nutrition_info.fat}g fat,
                {recipe.nutrition_info.carbohydrates}g carbs
              </div>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
};

export default SearchResults;
