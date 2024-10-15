import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/utils/supabase/client";

export default function SEOForm() {
  const [url, setUrl] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [keywords, setKeywords] = useState("");
  const [changefreq, setChangefreq] = useState("monthly");
  const [priority, setPriority] = useState("1");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const supabase = createClient();

  const changefreqMap: { [key: string]: number } = {
    always: 1,
    hourly: 2,
    daily: 3,
    weekly: 4,
    monthly: 5,
    yearly: 6,
    never: 7
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // First, search for recipes using the ingredients
      const response = await fetch("/api/recipe_search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ingredients: ingredients.split(",").map((i) => i.trim()),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch recipes");
      }

      const recipes = await response.json();
      const recipeIds = recipes.map((recipe: any) => recipe.id);

      // Now insert the SEO metadata along with the recipe IDs
      const { data, error } = await supabase.from("page_metadata").insert({
        url,
        title,
        description,
        keywords: keywords.split(",").map((k) => k.trim()),
        ingredients: ingredients.split(",").map((i) => i.trim()),
        recipe_ids: recipeIds,
        changefreq: changefreqMap[changefreq],
        priority: parseFloat(priority),
      });

      if (error) {
        console.error("Error saving SEO metadata:", error);
        setMessage("Error saving SEO metadata. Please try again.");
      } else {
        setMessage("SEO metadata saved successfully!");
        // Clear form
        setUrl("");
        setIngredients("");
        setTitle("");
        setDescription("");
        setKeywords("");
        setChangefreq("weekly");
        setPriority("0.5");
      }
    } catch (error) {
      console.error("Error saving SEO metadata:", error);
      setMessage("Error saving SEO metadata. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="url" className="block mb-2">
          URL
        </label>
        <Input
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="recipes-with-tomato"
          required
        />
      </div>
      <div>
        <label htmlFor="ingredients" className="block mb-2">
          Ingredients (comma-separated)
        </label>
        <Input
          id="ingredients"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          placeholder="e.g., tomato, cheese, basil"
          required
        />
      </div>
      <div>
        <label htmlFor="title" className="block mb-2">
          Page Title
        </label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="SEO-optimized title"
          required
        />
      </div>
      <div>
        <label htmlFor="description" className="block mb-2">
          Meta Description
        </label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief description for search results"
          required
        />
      </div>
      <div>
        <label htmlFor="keywords" className="block mb-2">
          Keywords (comma-separated)
        </label>
        <Input
          id="keywords"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          placeholder="e.g., recipe, healthy, quick"
          required
        />
      </div>
      <div>
        <label htmlFor="changefreq" className="block mb-2">
          Change Frequency
        </label>
        <select
          id="changefreq"
          value={changefreq}
          onChange={(e) => setChangefreq(e.target.value)}
          className="w-full p-2 border rounded"
          required
        >
          <option value="always">Always</option>
          <option value="hourly">Hourly</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
          <option value="never">Never</option>
        </select>
      </div>
      <div>
        <label htmlFor="priority" className="block mb-2">
          Priority
        </label>
        <Input
          id="priority"
          type="number"
          min="0"
          max="1"
          step="0.1"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          placeholder="0.5"
          required
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
