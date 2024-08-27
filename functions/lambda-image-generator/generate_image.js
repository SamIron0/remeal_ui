import { TextToImage } from "deepinfra";
import { createClient } from "@supabase/supabase-js";
import fetch from "node-fetch";

const DEEPINFRA_API_KEY = process.env.DEEPINFRA_API_KEY;
const MODEL = "black-forest-labs/FLUX-1-schnell";
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export const handler = async (event) => {
  const { recipeId, prompt } = JSON.parse(event.body);

  try {
    const model = new TextToImage(MODEL, DEEPINFRA_API_KEY);
    const response = await model.generate({
      prompt: prompt,
    });

    const imageUrl = response.images[0];
    const imageResponse = await fetch(imageUrl);
    const imageBuffer = await imageResponse.buffer();

    const { data, error } = await supabase.storage
      .from("recipe-images")
      .upload(`${recipeId}.png`, imageBuffer, {
        contentType: "image/png",
        upsert: true,
      });

    if (error) throw error;

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, data }),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to generate or upload image" }),
    };
  }
};
