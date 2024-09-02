import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import Image from "next/image";

export default async function RecipePage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient(cookies());
  const { data: recipe, error } = await supabase
    .from("recipes")
    .select(
      `
  *,
  nutrition_info(*),
  recipe_images(file_path, file_name),
  recipe_ingredients(
    quantity,
    unit,
    ingredients(name)
  )
`
    )
    .eq("id", params.id)
    .single();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{recipe?.name}</h1>
      {recipe?.recipe_images[0] && (
        <div className="mb-6 relative h-64 md:h-96">
          <Image
            src={recipe?.recipe_images[0].file_path}
            alt={recipe?.name}
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
          />
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <p className="mb-4">{recipe?.description}</p>
          <h2 className="text-xl font-semibold mb-2">Instructions</h2>
          <ol className="list-decimal list-inside space-y-2">
            {recipe?.instructions
              .split("\n")
              .map((step: string, index: number) => (
                <li key={index}>{step}</li>
              ))}
          </ol>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Ingredients</h2>
          <ul className="list-disc list-inside space-y-1 mb-4">
            {recipe?.recipe_ingredients.map(
              (ingredient: any, index: number) => (
                <li key={index}>{ingredient.ingredients.name}</li>
              )
            )}
          </ul>
          <h2 className="text-xl font-semibold mb-2">Nutrition Information</h2>
          {recipe?.nutrition_info ? (
            <ul className="space-y-1">
              <li>Calories: {recipe.nutrition_info.calories}</li>
              <li>Protein: {recipe?.nutrition_info.protein}g</li>
              <li>Fat: {recipe?.nutrition_info.fat}g</li>
              <li>Carbohydrates: {recipe?.nutrition_info.carbohydrates}g</li>
            </ul>
          ) : (
            <p>Nutrition information not available</p>
          )}
          <div className="mt-4">
            <p>Prep Time: {recipe?.prep_time} minutes</p>
            <p>Cook Time: {recipe?.cook_time} minutes</p>
            <p>Servings: {recipe?.servings}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
