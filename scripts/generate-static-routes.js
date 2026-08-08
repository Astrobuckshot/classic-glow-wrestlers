// scripts/generate-static-routes.js
//
// WHAT THIS DOES:
// After Vite builds the site into dist/, this script creates a real HTML
// file at every route listed in your sitemap.xml — e.g.
// dist/wrestler/hollywood/index.html, dist/skits/index.html, and so on.
// Each of these is just a copy of your normal dist/index.html, so the app
// still loads and behaves exactly the same. The only difference is that
// GitHub Pages now has a genuine file to serve at each of these paths, so
// it can return an honest 200 OK immediately.
//
// WHY THIS IS NEEDED:
// The 404.html redirect trick works great for real browsers (they run the
// JavaScript that quietly restores the correct URL), but Google's crawler
// judges the very first HTTP response, before that trick ever gets a
// chance to run. Without this, Google sees a real 404 for every page
// except the homepage, even though visitors never notice a problem.
//
// This script reads dist/sitemap.xml (which Vite copies there
// automatically from your public/ folder) so the exact same route list
// used for SEO also drives this — no need to maintain the list twice.
//
// This runs AFTER `vite build`, since it depends on dist/index.html and
// dist/sitemap.xml already existing.

const fs = require("fs");
const path = require("path");

const DIST_DIR = path.join(__dirname, "..", "dist");
const SITEMAP_PATH = path.join(DIST_DIR, "sitemap.xml");
const INDEX_HTML_PATH = path.join(DIST_DIR, "index.html");

function main() {
  if (!fs.existsSync(INDEX_HTML_PATH)) {
    console.error("ERROR: dist/index.html not found — run `vite build` before this script.");
    process.exit(1);
  }
  if (!fs.existsSync(SITEMAP_PATH)) {
    console.error("ERROR: dist/sitemap.xml not found — make sure sitemap.xml is in your public/ folder.");
    process.exit(1);
  }

  const indexHtml = fs.readFileSync(INDEX_HTML_PATH, "utf8");
  const sitemapXml = fs.readFileSync(SITEMAP_PATH, "utf8");

  const locMatches = [...sitemapXml.matchAll(/<loc>(.*?)<\/loc>/g)];
  const urls = locMatches.map((m) => m[1]);

  if (urls.length === 0) {
    console.error("ERROR: No <loc> entries found in sitemap.xml — nothing to generate.");
    process.exit(1);
  }

  let created = 0;
  let skipped = 0;

  for (const url of urls) {
    let routePath;
    try {
      routePath = new URL(url).pathname; // e.g. "/wrestler/hollywood" or "/"
    } catch {
      console.warn(`Skipping invalid URL in sitemap: ${url}`);
      continue;
    }

    // The root "/" already has dist/index.html — nothing to do there.
    if (routePath === "/" || routePath === "") {
      continue;
    }

    const segments = routePath.replace(/^\/+|\/+$/g, "").split("/");
    const outDir = path.join(DIST_DIR, ...segments);
    const outFile = path.join(outDir, "index.html");

    // Don't clobber something that's already a real file at this exact
    // path (shouldn't normally happen, but better safe than sorry).
    if (fs.existsSync(outFile)) {
      skipped++;
      continue;
    }

    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(outFile, indexHtml);
    created++;
  }

  console.log(`✓ Generated ${created} static route file(s) for crawlers (${skipped} skipped, already existed).`);
}

main();
