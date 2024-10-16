import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Clock, Users } from "lucide-react";
import NutritionCard from "@/components/RecipePage/NutritionCard";
import IngredientList from "@/components/RecipePage/IngredientList";
import InstructionSteps from "@/components/RecipePage/InstructionSteps";
import SaveRecipeButton from "@/components/RecipePage/SaveRecipeButton";
import SchemaMarkup from "@/components/SchemaMarkup";
import Breadcrumbs from "@/components/Breadcrumbs";
import SEOMetaTags from "@/components/SEOMetaTags";

export default async function RecipePage({
  params,
}: {
  params: { slug: string };
}) {
  const supabase = createClient(cookies());

  const {
    data: { user },
  } = await supabase.auth.getUser();
  
  const decodedSlug = decodeURIComponent(params.slug);

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
    .eq("name", decodedSlug)
    .single();

  if (error || !recipe) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-12">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Search", href: "/search" },
          { label: recipe.name, href: `/recipe/${recipe.name}` },
        ]}
      />
      <SchemaMarkup
        type="Recipe"
        data={{
          name: recipe.name,
          image: recipe.recipe_images[0]?.file_path,
          description: recipe.description,
          recipeIngredient: recipe.recipe_ingredients.map(
            (ing) =>
              `${ing.quantity} ${ing.unit} ${ing.ingredients?.name ?? ""}`
          ),
          recipeInstructions: recipe.instructions,
          cookTime: `PT${recipe.cook_time}M`,
          prepTime: `PT${recipe.prep_time ?? 0}M`,
          totalTime: `PT${(recipe.cook_time ?? 0) + (recipe.prep_time ?? 0)}M`,
          recipeYield: `${recipe.servings} servings`,
          nutrition: recipe.nutrition_info
            ? {
                "@type": "NutritionInformation",
                calories: `${recipe.nutrition_info.calories} calories`,
                fatContent: `${recipe.nutrition_info.fat}g`,
                carbohydrateContent: `${recipe.nutrition_info.carbohydrates}g`,
                proteinContent: `${recipe.nutrition_info.protein}g`,
              }
            : undefined,
        }}
      />
      <SEOMetaTags
        title={`${recipe.name} | Remeal Recipe`}
        description={recipe.description ?? ""}
        canonicalUrl={`https://remeal.xyz/recipe/${recipe.name}`}
        ogImage={recipe.recipe_images[0]?.file_path}
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <h1 className="text-4xl font-bold mb-4">{recipe.name}</h1>
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              <span>
                {(recipe.prep_time ?? 0) + (recipe.cook_time ?? 0)} mins
              </span>
            </div>
            <div className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              <span>{recipe.servings} servings</span>
            </div>
          </div>

          {recipe.recipe_images[0] && (
            <div className="relative h-96 mb-8 rounded-lg overflow-hidden">
              <Image
                src={recipe.recipe_images[0].file_path}
                alt={`${recipe.name} - A delicious recipe by Remeal`}
                layout="fill"
                objectFit="cover"
                className="transition-transform duration-300 hover:scale-105"
                priority
              />
            </div>
          )}

          <div className="flex space-x-4 mb-8">
            <SaveRecipeButton recipeId={recipe.id} userId={user?.id} />
         
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Description</h2>
            <p className="text-gray-700 max-w-2xl">{recipe.description}</p>
          </div>

          <IngredientList ingredients={recipe.recipe_ingredients} />
          <InstructionSteps instructions={recipe.instructions} />
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <NutritionCard nutritionInfo={recipe.nutrition_info} />

            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Recipe Details</h3>
              <div className="bg-gray-100 rounded-lg p-4">
                <div className="flex justify-between mb-2">
                  <span>Prep Time:</span>
                  <span>{recipe.prep_time} mins</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Cook Time:</span>
                  <span>{recipe.cook_time} mins</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Time:</span>
                  <span>
                    {(recipe.prep_time ?? 0) + (recipe.cook_time ?? 0)} mins
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
