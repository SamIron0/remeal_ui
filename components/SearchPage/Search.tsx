"use client";
import React, { useState, useEffect, useCallback } from "react";
import { XCircle, Search as SearchIcon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import SearchResults from "./SearchResults";
import { Recipe } from "@/types";
import { useApp } from "@/context/AppContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Settings } from "lucide-react";
import RecipeFilter from "./RecipeFilter";

interface FilterOptions {
  dietaryRestrictions: string[];
  maxCookTime: number | null;
}

const RecipeSearch: React.FC = () => {
  const { user } = useAuth();
  const { subscription } = useApp();
  const router = useRouter();
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
            dietaryRestrictions: [],
            maxCookTime: 120,
            minRating: 0,
          };
    }
    return {
      dietaryRestrictions: [],
      maxCookTime: 120,
      minRating: 0,
    };
  });

  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    localStorage.setItem(
      "dietaryRestrictions",
      JSON.stringify(filterOptions.dietaryRestrictions)
    );
  }, [filterOptions.dietaryRestrictions]);

  useEffect(() => {
    localStorage.setItem(
      "maxCookTime",
      filterOptions.maxCookTime !== null
        ? filterOptions.maxCookTime.toString()
        : "null"
    );
  }, [filterOptions.maxCookTime]);

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
      .split(',')
      .map(item => item.trim())
      .filter(item => item !== '');
  
    setIngredients([...ingredients, ...newIngredients]);
    setInputValue("");
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const clearAllIngredients = () => {
    setIngredients([]);
  };

  const searchRecipes = async () => {
   
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

  useEffect(() => {
    if (ingredients.length > 0 ) {
      searchRecipes();
    } else if (ingredients.length === 0) {
      setRecipes([]);
      setFilteredRecipes([]);
    }
  }, [ingredients]);

  const applyFilters = useCallback(
    (newOptions: FilterOptions) => {
      setFilterOptions(newOptions);
      const filtered = recipes.filter((recipe) => {
        if (
          newOptions.maxCookTime &&
          (recipe.cook_time || 0) > newOptions.maxCookTime
        ) {
          return false;
        }

        if (newOptions.dietaryRestrictions.length > 0) {
          const recipeDiets: string[] = [];
          return newOptions.dietaryRestrictions.every((diet) =>
            recipeDiets.includes(diet)
          );
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
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Recipe Finder</h1>

      <div className="mb-6 w-full flex flex-col items-center">
        <div className="flex w-full justify-center max-w-md mb-4">
          <Input
            type="text"
            placeholder="Enter an ingredient"
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleInputKeyPress}
            className="w-full mr-2"
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
