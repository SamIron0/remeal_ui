const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

const sitemapPath = path.join(process.cwd(), "public", "sitemap.xml");
const baseUrl = "https://www.remeal.xyz";

async function generateSitemap() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Fetch search page metadata
    const { data: searchPages, error: searchError } = await supabase
      .from("search_page_metadata")
      .select("url, changefreq, priority")
      .order("url");

    if (searchError) {
      console.error("Error fetching search pages:", searchError);
      return;
    }

    // Fetch recipe page metadata
    const { data: recipePages, error: recipeError } = await supabase
      .from("recipe_page_metadata")
      .select("recipe_id, changefreq, priority, slug")
      .order("recipe_id");

    if (recipeError) {
      console.error("Error fetching recipe pages:", recipeError);
      return;
    }
    const recipeIds = recipePages.map((page) => page.recipe_id);
    const { data: recipes, error: recipesError } = await supabase
      .from("recipes")
      .select("id, name")
      .in("id", recipeIds);

    if (recipesError) {
      console.error("Error fetching recipe names:", recipesError);
      return;
    }

    const today = new Date().toISOString().split("T")[0];

    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/search</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  ${searchPages
    .map(
      (page) => `
  <url>
    <loc>${baseUrl}/search/${page.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${page.priority || "0.5"}</priority>
  </url>`
    )
    .join("")}
  ${recipePages
    .map(
      (page) => `
  <url>
    <loc>${baseUrl}/recipe/${page.slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${page.priority || "0.5"}</priority>
  </url>`
    )
    .join("")}
</urlset>`;

    fs.writeFileSync(sitemapPath, xmlContent, "utf8");
    console.log("sitemap.xml generated successfully");
  } catch (error) {
    console.error("Error generating sitemap:", error);
  }
}

generateSitemap();
