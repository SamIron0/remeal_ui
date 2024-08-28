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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          ingredients: ingredients.split('\n'),
          instructions,
        }),
      });

      if (response.status === 401) {
        toast.error('You must be logged in to save recipes');
        // Redirect to login page
        window.location.href = '/login';
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to save recipe');
      }

      toast.success('Recipe saved successfully');
      setName('');
      setIngredients('');
      setInstructions('');
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
            required
          />
        </div>
        <div>
          <label htmlFor="ingredients" className="block text-sm font-medium text-gray-700">Ingredients (one per line)</label>
          <Textarea
            id="ingredients"
            value={ingredients}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setIngredients(e.target.value)}
            required
            rows={5}
          />
        </div>
        <div>
          <label htmlFor="instructions" className="block text-sm font-medium text-gray-700">Instructions</label>
          <Textarea
            id="instructions"
            value={instructions}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInstructions(e.target.value)}
            required
            rows={5}
          />
        </div>
        <Button type="submit">Save Recipe</Button>
      </form>
    </div>
  );
}
