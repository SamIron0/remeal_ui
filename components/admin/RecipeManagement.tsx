'use client'
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function RecipeManagement() {
  const [name, setName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [description, setDescription] = useState('');
  const [cookTime, setCookTime] = useState('');
  const [prepTime, setPrepTime] = useState('');
  const [servings, setServings] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let recipeData;
      if (!name && !ingredients && !instructions && !description && !cookTime && !prepTime && !servings) {
        // Use sample recipe if form is empty
        recipeData = {
          name: "Sample Pasta Dish",
          ingredients: [
            "200g spaghetti",
          
          ],
          instructions: "1. Cook spaghetti according to package instructions.",
          description: "A simple and delicious pasta dish with garlic and Parmesan.",
          cook_time: 15,
          prep_time: 10,
          servings: 2,
        };
      } else {
        recipeData = {
          name,
          ingredients: ingredients.split('\n').map(ingredient => ingredient.trim()),
          instructions,
          description,
          cook_time: parseInt(cookTime),
          prep_time: parseInt(prepTime),
          servings: parseInt(servings),
        };
      }

      const response = await fetch('/api/recipe_ingestion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recipeData),
      });

      if (!response.ok) {
        throw new Error('Failed to save recipe');
      }

      toast.success('Recipe saved successfully');
      // Reset form fields
      setName('');
      setIngredients('');
      setInstructions('');
      setDescription('');
      setCookTime('');
      setPrepTime('');
      setServings('');
    } catch (error) {
      toast.error('Error saving recipe');
      console.error('Error:', error);
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">Add New Recipe</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Recipe Name</label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            
          />
        </div>
        <div>
          <label htmlFor="ingredients" className="block text-sm font-medium text-gray-700">Ingredients (one per line)</label>
          <Textarea
            id="ingredients"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            
            rows={5}
          />
        </div>
        <div>
          <label htmlFor="instructions" className="block text-sm font-medium text-gray-700">Instructions</label>
          <Textarea
            id="instructions"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            
            rows={5}
          />
        </div>
        <div>
          <label htmlFor="cookTime" className="block text-sm font-medium text-gray-700">Cook Time (minutes)</label>
          <Input
            id="cookTime"
            type="number"
            value={cookTime}
            onChange={(e) => setCookTime(e.target.value)}
            
          />
        </div>
        <div>
          <label htmlFor="prepTime" className="block text-sm font-medium text-gray-700">Prep Time (minutes)</label>
          <Input
            id="prepTime"
            type="number"
            value={prepTime}
            onChange={(e) => setPrepTime(e.target.value)}
            
          />
        </div>
        <div>
          <label htmlFor="servings" className="block text-sm font-medium text-gray-700">Servings</label>
          <Input
            id="servings"
            type="number"
            value={servings}
            onChange={(e) => setServings(e.target.value)}
            
          />
        </div>
        <Button type="submit">Save Recipe</Button>
      </form>
    </div>
  );
}
