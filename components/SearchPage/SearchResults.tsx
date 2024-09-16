import React from "react";

import { Loader2 } from "lucide-react";
import { Recipe } from "@/types";
import { useApp } from "@/context/AppContext";
import RecipeCard from "@/components/SearchPage/RecipeCard";

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
  const { user, subscription } = useApp();
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
        <RecipeCard key={recipe.id} recipe={recipe} isPremium={isPremium} />
      ))}
    </div>
  );
};

export default SearchResults;
