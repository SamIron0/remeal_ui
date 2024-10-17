import React from "react";
import Link from "next/link";
import { Recipe } from "@/types";
import NutritionInfo from "@/components/SearchPage/NutritionInfo";
import { Badge } from "@/components/ui/badge";
import { slugify } from "@/utils/helpers";

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  const matchedIngredientsCount = recipe.matchedIngredients?.length || 0;
  const seoFriendlyUrl = slugify(recipe.name || '');

  return (
    <Link href={`/recipe/${seoFriendlyUrl}`}>
      <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
        <h3 className="text-lg font-semibold mb-2">{recipe.name}</h3>
        <Badge variant="secondary" className="mb-2">
          {matchedIngredientsCount} matched ingredient{matchedIngredientsCount !== 1 ? 's' : ''}
        </Badge>
        <p className="text-sm text-gray-600 mb-2">{recipe.description}</p>
        <IngredientsList ingredients={recipe.recipe_ingredients} />
        <NutritionInfo nutritionInfo={recipe.nutrition_info} />
      </div>
    </Link>
  );
};

const IngredientsList: React.FC<{
  ingredients: Recipe["recipe_ingredients"];
}> = ({ ingredients }) => (
  <div className="mb-2">
    <strong>Ingredients:</strong>
    <ul className="list-disc list-inside">
      {ingredients?.slice(0, 3).map((ingredient, index) => (
        <li key={index}>
          {ingredient.quantity} {ingredient.unit} {ingredient.ingredients?.name}
        </li>
      ))}
      {ingredients && ingredients.length > 3 && (
        <li className="text-sm text-gray-500">
          + {ingredients.length - 3} more
        </li>
      )}
    </ul>
  </div>
);

export default RecipeCard;
