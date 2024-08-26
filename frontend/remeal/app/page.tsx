import React, { useState, useEffect } from 'react';
import { XCircle, Search, ChevronDown } from 'lucide-react';

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      setIngredients([...ingredients, inputValue.trim()]);
      setInputValue('');
    }
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const searchRecipes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/recipes/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ingredients }),
      });
      if (!response.ok) {
        throw new Error('Failed to fetch recipes');
      }
      const data = await response.json();
      setRecipes(data);
    } catch (err) {
      setError('An error occurred while fetching recipes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ingredients.length > 0) {
      searchRecipes();
    } else {
      setRecipes([]);
    }
  }, [ingredients]);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Recipe Finder</h1>
      
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <input
            type="text"
            placeholder="Enter an ingredient"
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleInputKeyPress}
            className="flex-grow mr-2 p-2 border border-gray-300 rounded"
          />
          <button 
            onClick={() => inputValue.trim() && setIngredients([...ingredients, inputValue.trim()])}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add
          </button>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-2">
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