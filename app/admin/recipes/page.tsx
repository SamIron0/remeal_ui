'use client'
import { useState, useEffect } from 'react';

interface Recipe {
  id: number;
  name: string;
  ingredients: string[];
  instructions: string;
}

export default function ManageRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const response = await fetch('/api/get_all_recipes');
      if (!response.ok) throw new Error('Failed to fetch recipes');
      const data = await response.json();
      setRecipes(data);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteRecipe = async (id: number) => {
    if (confirm('Are you sure you want to delete this recipe?')) {
      try {
        const response = await fetch(`/api/delete_recipe`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ recipeId: id }),
        });
        if (!response.ok) throw new Error('Failed to delete recipe');
        setRecipes(recipes.filter(recipe => recipe.id !== id));
      } catch (error) {
        console.error('Error deleting recipe:', error);
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Manage Recipes</h1>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {recipes.map(recipe => (
            <tr key={recipe.id}>
              <td className="py-2 px-4 border-b">{recipe.id}</td>
              <td className="py-2 px-4 border-b">{recipe.name}</td>
              <td className="py-2 px-4 border-b">
                <button className="mr-2 text-blue-500" onClick={() => {}}>Edit</button>
                <button className="text-red-500" onClick={() => deleteRecipe(recipe.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
