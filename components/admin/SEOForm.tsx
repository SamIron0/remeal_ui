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
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const { data, error } = await supabase.from("page_metadata").upsert(
        {
          url,
          title,
          description,
          keywords: keywords.split(",").map((k) => k.trim()),
          ingredients: ingredients.split(",").map((i) => i.trim()),
        },
        { onConflict: "url" }
      );

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
          placeholder="e.g., https://example.com"
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
