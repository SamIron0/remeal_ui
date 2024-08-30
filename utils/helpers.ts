export function normalizeIngredient(ingredient: string): string {
  return ingredient
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\b(s|es)$/, "") // Remove trailing 's' or 'es'
    .trim();
}
export async function callLLM(prompt: string): Promise<string> {
  const response = await fetch(
    "https://api.deepinfra.com/v1/openai/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.DEEP_INFRA_API_KEY}`,
      },
      body: JSON.stringify({
        model: "meta-llama/Meta-Llama-3.1-70B-Instruct",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`LLM API error: ${response.statusText}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content;

  return content;
}

export async function callLLMJson(prompt: string): Promise<string> {
  const response = await fetch(
    "https://api.deepinfra.com/v1/openai/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.DEEP_INFRA_API_KEY}`,
      },
      body: JSON.stringify({
        model: "meta-llama/Meta-Llama-3.1-70B-Instruct",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant that must respond only with valid JSON. Do not include any other text or formatting.",
          },
          { 
            role: "user",
            content: prompt,
          },
        ],
        response_format: { type: "json_object" },
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`LLM API error: ${response.statusText}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content;

  // Ensure the content is valid JSON
  try {
    JSON.parse(content);
    return content;
  } catch (error) {
    console.error("LLM returned invalid JSON:", content);
    throw error;
  }
}

export function levenshteinDistance(a: string, b: string): number {
  const matrix = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

