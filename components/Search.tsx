"use client";
import React, { useState, useEffect } from "react";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Settings } from "lucide-react";

const RecipeSearch: React.FC = () => {
  const { user } = useAuth();
  const { subscription } = useApp();
  const router = useRouter();
  const { recipes, setRecipes, ingredients, setIngredients } = useApp();
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([]);
  const [maxCookTime, setMaxCookTime] = useState<number>(60);
  const [minRating, setMinRating] = useState<number>(3);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      addIngredient(inputValue.trim());
    }
  };

  const addIngredient = (ingredient: string) => {
    if (!user) {
      router.push("/login");
      return;
    }
    setIngredients([...ingredients, ingredient]);
    setInputValue("");
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const clearAllIngredients = () => {
    setIngredients([]);
  };

  const searchRecipes = async () => {
    if (!user) {
      router.push("/");
      return;
    }
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
          dietaryRestrictions:
            subscription?.status === "active" ? dietaryRestrictions : [],
          maxCookTime: subscription?.status === "active" ? maxCookTime : null,
          minRating: subscription?.status === "active" ? minRating : null,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch recipes");
      }
      const data = await response.json();
      setRecipes(data);
    } catch (err) {
      setError("An error occurred while fetching recipes. Please try again.");
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ingredients.length > 0 && user) {
      searchRecipes();
    } else if (ingredients.length === 0) {
      setRecipes([]);
    }
  }, [ingredients]);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Recipe Finder</h1>

      <div className="mb-6 w-full flex flex-col items-center">
        <div className="flex w-full justify-center max-w-md">
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
            className="whitespace-nowrap"
          >
            <SearchIcon className="mr-2 h-4 w-4" /> Add
          </Button>
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
            <div className="flex items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllIngredients}
                className="mr-2"
              >
                Clear All
              </Button>
              {subscription?.status === "active" && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="ml-2">
                      <Settings className="mr-2 h-4 w-4" />
                      Filters
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Advanced Filters</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <div className="w-full">
                        <label className="block text-sm font-medium mb-1">
                          Dietary Restrictions
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {["vegetarian", "vegan", "gluten-free", "dairy-free"].map(
                            (restriction) => (
                              <label key={restriction} className="flex items-center">
                                <Checkbox
                                  checked={dietaryRestrictions.includes(restriction)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setDietaryRestrictions([
                                        ...dietaryRestrictions,
                                        restriction,
                                      ]);
                                    } else {
                                      setDietaryRestrictions(
                                        dietaryRestrictions.filter(
                                          (r) => r !== restriction
                                        )
                                      );
                                    }
                                  }}
                                />
                                <span className="ml-2 capitalize">{restriction}</span>
                              </label>
                            )
                          )}
                        </div>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <div className="w-full">
                        <label className="block text-sm font-medium mb-1">
                          Max Cook Time: {maxCookTime} minutes
                        </label>
                        <Slider
                          value={[maxCookTime]}
                          onValueChange={(value) => setMaxCookTime(value[0])}
                          max={120}
                          step={5}
                        />
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <div className="w-full">
                        <label className="block text-sm font-medium mb-1">
                          Minimum Rating: {minRating}
                        </label>
                        <Slider
                          value={[minRating]}
                          onValueChange={(value) => setMinRating(value[0])}
                          max={5}
                          step={0.5}
                        />
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          )}
        </div>
      </div>

      <SearchResults recipes={recipes} loading={loading} error={error} />
    </div>
  );
};

export default RecipeSearch;
