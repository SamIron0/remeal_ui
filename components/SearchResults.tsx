import React from 'react';
import { Loader2 } from 'lucide-react';

interface Recipe {
  id: number;
  name: string;
  description: string;
  ingredients: string[];
}

interface SearchResultsProps {
  recipes: Recipe[];
  loading: boolean;
  error: string | null;
}

const SearchResults: React.FC<SearchResultsProps> = ({ recipes, loading, error }) => {
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
        <div key={recipe.id} className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-2">{recipe.name}</h2>
            <p className="text-gray-600 mb-4">{recipe.description}</p>
            <h4 className="font-semibold mb-2">Ingredients:</h4>
            <ul className="list-disc list-inside">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="text-sm text-gray-700">{ingredient}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SearchResults;