"use client";
import React, { useState, useEffect, useCallback } from "react";
import { XCircle, Search as SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SearchResults from "./SearchResults";
import { Recipe } from "@/types";
import { useApp } from "@/context/AppContext";
import RecipeFilter from "./RecipeFilter";

interface FilterOptions {
  maxCookTime: number | null;
}

interface SearchProps {
  initialIngredients?: string[];
  initialRecipes?: Recipe[];
}

const RecipeSearch: React.FC<SearchProps> = ({ initialIngredients = [], initialRecipes = [] }) => {
  const { recipes, setRecipes, ingredients, setIngredients } = useApp();
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>(() => {
    if (typeof window !== "undefined") {
      const savedOptions = localStorage.getItem("filterOptions");
      return savedOptions
        ? JSON.parse(savedOptions)
        : {
            maxCookTime: 120,
          };
    }
    return {
      maxCookTime: 120,
    };
  });

  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    localStorage.setItem(
      "maxCookTime",
      filterOptions.maxCookTime !== null
        ? filterOptions.maxCookTime.toString()
        : "null"
    );

    if (initialIngredients.length > 0) {
      setIngredients(initialIngredients);
    }
    if (initialRecipes.length > 0) {
      setRecipes(initialRecipes);
    }
  }, [initialIngredients, initialRecipes, setIngredients, setRecipes, filterOptions]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      addIngredient(inputValue.trim());
    }
  };

  const addIngredient = (ingredient: string) => {
    const newIngredients = ingredient
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item !== "");

    const newIngredientsList = [...ingredients, ...newIngredients];
    setIngredients(newIngredientsList);

    searchRecipes(newIngredientsList);
    setInputValue("");
  };

  const removeIngredient = (index: number) => {
    const newIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(newIngredients);
    if (newIngredients.length > 0) {
      searchRecipes(newIngredients);
    }
  };

  const clearAllIngredients = () => {
    setIngredients([]);
  };

  const searchRecipes = async (ingredients: string[]) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/recipe_search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ingredients,
          ...filterOptions,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch recipes");
      }
      const data = await response.json();
      setRecipes(data);
    } catch (error) {
      console.error("Error fetching recipes:", error);
      setError("An error occurred while fetching recipes. Please try again.");
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };
  const applyFilters = useCallback(
    (newOptions: FilterOptions) => {
      setFilterOptions(newOptions);
      const filtered = recipes.filter((recipe) => {
        if (
          (recipe.cook_time || 0) > (newOptions.maxCookTime || 0) 
        ) {
          return false;
        }

        return true;
      });
      setFilteredRecipes(filtered);
    },
    [recipes]
  );

  useEffect(() => {
    applyFilters(filterOptions);
  }, [filterOptions, applyFilters]);
  return (
    <div className="max-w-6xl mx-auto py-16">
      <h1 className="text-3xl font-bold py-6 text-center">Recipe Finder</h1>

      <div className="mb-6 w-full flex flex-col items-center max-w-lg mx-auto">
        <div className="flex w-full justify-center mb-4">
          <Input
            type="text"
            placeholder="Enter your ingredients(comma-separated)"
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleInputKeyPress}
            className="w-full mr-2 text-[16px]"
          />
          <Button
            onClick={() =>
              inputValue.trim() && addIngredient(inputValue.trim())
            }
            className="whitespace-nowrap mr-2"
          >
            <SearchIcon className="mr-2 h-4 w-4" /> Add
          </Button>
          <RecipeFilter options={filterOptions} onChange={applyFilters} />
        </div>

        <div className="flex flex-wrap justify-center gap-2 mt-4">
          {ingredients.map((ingredient, index) => (
            <span
              key={index}
              className="bg-primary/10 text-primary px-2 py-1 rounded-full text-sm flex items-center"
            >
              {ingredient}
              <XCircle
                className="ml-1 cursor-pointer"
                size={16}
                onClick={() => removeIngredient(index)}
              />
            </span>
          ))}
          {ingredients.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearAllIngredients}
              className="ml-2"
            >
              Clear All
            </Button>
          )}
        </div>
      </div>

      <SearchResults
        recipes={filteredRecipes}
        loading={loading}
        error={error}
      />
    </div>
  );
};

export default RecipeSearch;
