import React, { useState, useRef, useCallback } from "react";
import { Loader2, ChevronUp } from "lucide-react";
import { Recipe } from "@/types";
import { useApp } from "@/context/AppContext";
import RecipeCard from "@/components/SearchPage/RecipeCard";
import { Button } from "@/components/ui/button";
import BackToTopButton from "../BackToTopButton";

interface SearchResultsProps {
  recipes: Recipe[]
  loading: boolean;
  error: string | null;
  displayCount: number;
  setDisplayCount: React.Dispatch<React.SetStateAction<number>>;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  recipes,
  loading,
  error,
  displayCount,
  setDisplayCount,
}) => {
  const { ingredients } = useApp();
  const [showBackToTop, setShowBackToTop] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);

  const lastRecipeElementRef = useCallback((node: HTMLDivElement | null) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && displayCount < recipes.length) {
        setDisplayCount(prevCount => prevCount + 12);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, displayCount, recipes.length, setDisplayCount]);

  React.useEffect(() => {
    const toggleBackToTop = () => {
      setShowBackToTop(window.pageYOffset > 300);
    };

    window.addEventListener('scroll', toggleBackToTop);
    return () => window.removeEventListener('scroll', toggleBackToTop);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
      <div className="text-center px-8 py-24">
        <h2 className="text-2xl font-semibold mb-4">Ready to cook?</h2>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          Start by adding ingredients you have on hand,<br /> and we&apos;ll find matching
          recipes for you.
        </p>
        <Button variant="secondary" onClick={() => document.querySelector("input")?.focus()}>
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
          We couldn&apos;t find any recipes with the current ingredients. Try adding
          more or adjusting your search.
        </p>
        <Button onClick={() => document.querySelector("input")?.focus()}>
          Add More Ingredients
        </Button>
      </div>
    );
  }

  const displayedRecipes = recipes.slice(0, displayCount);
  const hasMore = recipes.length > displayCount;

  return (
    <div className="">
      {recipes.length > 0 && (
        <p className="text-sm text-gray-600 mb-4">
          Showing {Math.min(displayCount, recipes.length)} of {recipes.length} results
        </p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedRecipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
      {hasMore && (
        <div className="mt-6 text-center">
          <Button
            onClick={() => setDisplayCount(prevCount => prevCount + 12)}
          >
            Show More
          </Button>
        </div>
      )}
      {showBackToTop && (
        <BackToTopButton />
      )}
    </div>
  );
};

export default SearchResults;
