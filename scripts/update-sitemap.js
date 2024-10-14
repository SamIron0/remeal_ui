const fs = require("fs")
const path = require("path")

const sitemapPath = path.join(__dirname, "..", "public", "sitemap.xml")
const today = new Date().toISOString().split("T")[0]

fs.readFile(sitemapPath, "utf8", (err, data) => {
  if (err) throw err

  const updatedSitemap = data.replace(
    /<lastmod>.*<\/lastmod>/,
    `<lastmod>${today}</lastmod>`
  )

  fs.writeFile(sitemapPath, updatedSitemap, "utf8", err => {
    if (err) throw err
    console.log("sitemap.xml updated with today's date")
  })
})
