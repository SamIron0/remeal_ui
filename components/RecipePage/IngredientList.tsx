"use client";
import { useApp } from "@/context/AppContext";
import { Checkbox } from "../ui/checkbox";

export default function IngredientList({
  recipeIngredients,
}: {
  recipeIngredients: any[];
}) {
  const { ingredients } = useApp();

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">Ingredients</h2>
      <ul className="space-y-2">
        {recipeIngredients.map((ingredient, index) => (
          <li key={index} className="flex items-center">
            <Checkbox
              checked={ingredients.includes(ingredient.ingredients.name)}
              className="mr-2"
            />
            <span>
              {ingredient.quantity} {ingredient.unit}{" "}
              {ingredient.ingredients.name}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
