const { createClient } = require("@supabase/supabase-js");
const axios = require('axios');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function generateRecipeSEOPages() {
  try {
    // Fetch all recipes that don't have metadata
    let { data, error } = await supabase
      .from("recipe_page_metadata")
      .select("recipe_id");
    if (error) throw error;
    const recipeIds = data.map(r => r.recipe_id);
    // Format recipeIds for SQL query
    const formattedRecipeIds = `(${recipeIds.join(",")})`;
    console.log("formattedRecipeIds", formattedRecipeIds);

    const { data: recipes, error: recipeError } = await supabase
      .from("recipes")
      .select(
        "id, name, description, ingredients:recipe_ingredients(ingredients(name))"
      )
      .not("id", "in", formattedRecipeIds);

    if (recipeError) throw recipeError;
    console.log("recipes", recipes.length);
    
    const batchSize = 10; // Adjust this value based on your needs
    const batches = [];

    for (let i = 0; i < recipes.length; i += batchSize) {
      batches.push(recipes.slice(i, i + batchSize));
    }

    for (const batch of batches) {
      await Promise.all(batch.map(async recipe => {
        const { tags, description } = await callLLMForMetadata(recipe);

        // Format the tags as a PostgreSQL array literal
        const formattedTags = `{${tags.map(tag => `"${tag.replace(/"/g, '\\"')}"`).join(',')}}`;

        const seoMetadata = {
          title: recipe.name,
          description: description,
          keywords: formattedTags,
          changefreq: 4,
          priority: 0.8,
          slug: slugify(recipe.name)
        };

        // Insert or update the recipe_page_metadata
        const { error: upsertError } = await supabase
          .from("recipe_page_metadata")
          .insert({
            recipe_id: recipe.id,
            ...seoMetadata,
          });

        if (upsertError) {
          console.error(
            `Error upserting metadata for recipe ${recipe.id}:`,
            upsertError
          );
        } else {
          console.log(`Generated and saved metadata for recipe ${recipe.id}`);
        }
      }));
    }

    console.log("SEO page generation completed");
  } catch (error) {
    console.error("Error generating SEO pages:", error);
  }
}

async function callLLMForMetadata(recipe) {
  const prompt = `Generate SEO metadata for the following recipe:
Recipe Name: ${recipe.name}
Description: ${recipe.description}
Ingredients: ${recipe.ingredients.map(ing => ing.ingredients.name).join(", ")}

Provide the following in a JSON object:
1. tags: An array of 5-10 SEO-friendly tags as strings.
2. description: A compelling SEO description (150-160 characters) that includes key ingredients and entices readers.

Output the JSON object without any additional text or formatting.`;

  try {
    const response = await axios.post('https://api.deepinfra.com/v1/openai/chat/completions', {
      model: "meta-llama/Meta-Llama-3.1-70B-Instruct",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that must respond only with valid JSON. Do not include any other text or formatting."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" }
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.DEEP_INFRA_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const content = response.data.choices[0].message.content;
    const parsedContent = JSON.parse(content);

    if (Array.isArray(parsedContent.tags) && typeof parsedContent.description === 'string') {
      return {
        tags: parsedContent.tags,
        description: parsedContent.description
      };
    } else {
      console.warn("LLM response didn't contain expected data:", parsedContent);
      return { tags: [], description: '' };
    }
  } catch (error) {
    console.error("Error calling LLM API or parsing response:", error);
    return { tags: [], description: '' };
  }
}

// Run the function
generateRecipeSEOPages();
