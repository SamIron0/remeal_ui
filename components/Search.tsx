'use client'
import React, { useState, useEffect } from 'react';
import { XCircle, Search, ChevronDown } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

interface Recipe {
  id: number;
  name: string;
  description: string;
  ingredients: string[];
}

const RecipeSearch: React.FC = () => {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const router = useRouter();

  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([]);
  const [maxCookTime, setMaxCookTime] = useState<number | null>(null);
  const [minRating, setMinRating] = useState<number | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      addIngredient(inputValue.trim());
    }
  };

  const addIngredient = (ingredient: string) => {
    if (!user) {
      router.push('/login');
      return;
    }
    setIngredients([...ingredients, ingredient]);
    setInputValue('');
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const searchRecipes = async () => {
    if (!user) {
      router.push('/');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/recipe_search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ingredients,
          dietaryRestrictions: user.is_premium ? dietaryRestrictions : [],
          maxCookTime: user.is_premium ? maxCookTime : null,
          minRating: user.is_premium ? minRating : null,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to fetch recipes');
      }
      const data = await response.json();
      setRecipes(data);
    } catch (err) {
      setError('An error occurred while fetching recipes. Please try again.');
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (ingredients.length > 0 && user) {
      searchRecipes();
    } else {
      setRecipes([]);
    }
  }, [ingredients, user, dietaryRestrictions, maxCookTime, minRating]);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Recipe Finder</h1>
      
      <div className="mb-6 w-full flex flex-col items-center">
        <div className="flex w-full justify-center max-w-md">
          <input
            type="text"
            placeholder="Enter an ingredient"
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleInputKeyPress}
            className="w-64 mr-2 p-2 border border-gray-300 rounded"
          />
          <button 
            onClick={() => inputValue.trim() && addIngredient(inputValue.trim())}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 whitespace-nowrap"
          >
            Add
          </button>
        </div>
        
        <div className="flex flex-wrap justify-center gap-2 mt-4">
          {ingredients.map((ingredient, index) => (
            <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center">
              {ingredient}
              <XCircle 
                className="ml-1 cursor-pointer" 
                size={16} 
                onClick={() => removeIngredient(index)}
              />
            </span>
          ))}
        </div>
      </div>

      {user?.is_premium && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Advanced Filters</h3>
          <div className="space-y-2">
            <div>
              <label className="block text-sm font-medium">Dietary Restrictions</label>
              <select
                multiple
                value={dietaryRestrictions}
                onChange={(e) => setDietaryRestrictions(Array.from(e.target.selectedOptions, option => option.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              >
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="gluten-free">Gluten-free</option>
                <option value="dairy-free">Dairy-free</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Max Cook Time (minutes)</label>
              <input
                type="number"
                value={maxCookTime || ''}
                onChange={(e) => setMaxCookTime(e.target.value ? parseInt(e.target.value) : null)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Minimum Rating</label>
              <input
                type="number"
                min="1"
                max="5"
                step="0.1"
                value={minRating || ''}
                onChange={(e) => setMinRating(e.target.value ? parseFloat(e.target.value) : null)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
          </div>
        </div>
      )}

      {loading && <p className="text-center">Searching for recipes...</p>}
      
      {error && <p className="text-red-500 text-center">{error}</p>}
      
      {recipes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recipes.map((recipe) => (
            <div key={recipe.id} className="border rounded-lg p-4 shadow-sm">
              <h2 className="text-xl font-semibold mb-2">{recipe.name}</h2>
              <p className="text-gray-600 mb-4">{recipe.description}</p>
              <h4 className="font-semibold mb-2">Ingredients:</h4>
              <ul className="list-disc list-inside">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
      
      {recipes.length === 0 && ingredients.length > 0 && !loading && (
        <p className="text-center">No recipes found with these ingredients. Try adding more!</p>
      )}
    </div>
  );
};

export default RecipeSearch;