import React from "react";
import { Loader2 } from "lucide-react";
import { Recipe } from "@/types";
import { useApp } from "@/context/AppContext";
import RecipeCard from "@/components/SearchPage/RecipeCard";
import { Button } from "@/components/ui/button";

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
  const { user, subscription, ingredients } = useApp();
  const isPremium = subscription?.status === "active" || subscription?.status === "trialing";

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

  if (ingredients.length === 0) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-semibold mb-4">Ready to cook?</h2>
        <p className="text-gray-600 mb-6">
          Start by adding ingredients you have on hand, and we'll find matching recipes for you.
        </p>
        <Button onClick={() => document.querySelector('input')?.focus()}>
          Add Ingredients
        </Button>
      </div>
    );
  }

  if (recipes.length === 0) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-semibold mb-4">No recipes found</h2>
        <p className="text-gray-600 mb-6">
          We couldn't find any recipes with the current ingredients. Try adding more or adjusting your search.
        </p>
        <Button onClick={() => document.querySelector('input')?.focus()}>
          Add More Ingredients
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} isPremium={isPremium} />
      ))}
    </div>
  );
};

export default SearchResults;
