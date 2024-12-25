"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Recipe } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { slugify } from "@/utils/helpers";
interface SimilarRecipesProps {
  recipeId: number;
}

const SimilarRecipes: React.FC<SimilarRecipesProps> = ({ recipeId }) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    fetch(`/api/similar_recipes?recipeId=${recipeId}`)
      .then((res) => res.json())
      .then((data) => setRecipes(data));
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Similar Recipes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4">
          {recipes.map((recipe) => (
            <Link
              key={recipe.id}
              href={`/recipe/${slugify(recipe.name || "")}`}
            >
              <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold">{recipe.name}</h3>
                <p className="text-sm text-gray-600">{recipe.description}</p>
                <p className="text-sm mt-2">
                  Cook time: {recipe.cook_time} mins
                </p>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SimilarRecipes;
