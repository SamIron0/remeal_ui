const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

const sitemapPath = path.join(process.cwd(), "public", "sitemap.xml");
const baseUrl = "https://remeal.xyz";
async function generateSitemap() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    const { data: pages, error } = await supabase
      .from("page_metadata")
      .select("url, changefreq, priority")
      .order("url");

    if (error){
      console.error("Error fetching pages:", error);
      return;
    }
    const today = new Date().toISOString().split("T")[0];

    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages
    .map(
      (page) => `
  <url>
    <loc>${baseUrl}/search/${page.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq || "weekly"}</changefreq>
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
