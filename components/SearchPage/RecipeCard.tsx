import React from "react";
import Link from "next/link";
import { Recipe } from "@/types";
import { Button } from "@/components/ui/button";
import NutritionInfo from "@/components/NutritionInfo";

interface RecipeCardProps {
  recipe: Recipe;
  isPremium: boolean;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, isPremium }) => {
  return (
    <Link href={`/recipe/${recipe.name}`}>
      <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
        <h3 className="text-lg font-semibold mb-2">{recipe.name}</h3>
        <p className="text-sm text-gray-600 mb-2">{recipe.description}</p>
        <IngredientsList ingredients={recipe.recipe_ingredients} />
        <NutritionInfo nutritionInfo={recipe.nutrition_info} isPremium={isPremium} />
      </div>
    </Link>
  );
};

const IngredientsList: React.FC<{ ingredients: Recipe['recipe_ingredients'] }> = ({ ingredients }) => (
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
