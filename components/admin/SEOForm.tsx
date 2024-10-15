import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/utils/supabase/client";

export default function SEOForm() {
  const [jsonInput, setJsonInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const supabase = createClient();

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJsonInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // Parse the JSON input
      const formData = JSON.parse(jsonInput);

      // Validate the required fields
      const requiredFields = ['url', 'ingredients', 'title', 'description', 'keywords'];
      for (const field of requiredFields) {
        if (!formData[field]) {
          throw new Error(`Missing required field: ${field}`);
        }
      }

      // Fetch recipes based on ingredients
      const response = await fetch("/api/recipe_search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ingredients: formData.ingredients.split(",").map((i: string) => i.trim()),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch recipes");
      }

      const recipes = await response.json();
      const recipeIds = recipes.map((recipe: any) => recipe.id);

      // Prepare data for insertion with default values
      const dataToInsert = {
        ...formData,
        ingredients: formData.ingredients.split(",").map((i: string) => i.trim()),
        keywords: formData.keywords.split(",").map((k: string) => k.trim()),
        recipe_ids: recipeIds,
        changefreq: "4",
        priority: 0.8,
      };

      // Insert data into Supabase
      const { data, error } = await supabase.from("page_metadata").insert(dataToInsert);

      if (error) {
        throw new Error("Error saving SEO metadata: " + error.message);
      } else {
        setMessage("SEO metadata saved successfully!");
        setJsonInput("");
      }
    } catch (error: any) {
      console.error("Error saving SEO metadata:", error);
      setMessage("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="jsonInput" className="block mb-2">
          SEO Metadata JSON
        </label>
        <Textarea
          id="jsonInput"
          value={jsonInput}
          onChange={handleInputChange}
          placeholder={`Enter JSON data, e.g.:
{
  "url": "recipes-with-tomato",
  "ingredients": "tomato, cheese, basil",
  "title": "Delicious Tomato Recipes",
  "description": "Discover tasty recipes using tomatoes",
  "keywords": "tomato, recipes, healthy"
}`}
          required
          rows={10}
        />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Save SEO Metadata"}
      </Button>
      {message && (
        <p
          className={
            message.includes("Error") ? "text-red-500" : "text-green-500"
          }
        >
          {message}
        </p>
      )}
    </form>
  );
}
