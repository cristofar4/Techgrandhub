/**
 * Screenshot every live project into public/images/projects.
 *
 * Run it with:
 *
 *   npm install --no-save playwright
 *   npx playwright install chromium
 *   npm run capture
 *
 * Playwright is deliberately not a dependency of this project, so it never
 * slows a deployment down. The two commands above are only needed on the
 * machine where you take the screenshots, and only once.
 *
 * Add a project here whenever you add one to src/data/projects.ts. The `id`
 * must match the key used in projectImages inside src/data/images.ts.
 */

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.join(HERE, "..", "public", "images", "projects");

/** The websites to capture. Keep this in step with src/data/projects.ts. */
const TARGETS = [
  { id: "forge", url: "https://forge-ewi7.onrender.com" },
  { id: "horizon", url: "https://horizon-children-foundation.onrender.com" },
  { id: "ocmedical", url: "https://ocmedical.netlify.app" },
  { id: "cabello", url: "https://salon-cabello-lounge-1.onrender.com" },
  { id: "specdec", url: "https://specdec.vercel.app" },
  { id: "lcci", url: "https://lcci-center.vercel.app" },
  { id: "duryplaza", url: "https://duryplazahotelsanatonia.onrender.com" },
];

/** Matches the 16 by 10 ratio the project images are displayed at. */
const VIEWPORT = { width: 1600, height: 1000 };

/** Free hosting sleeps when idle, so a first request can be slow to wake. */
const NAVIGATION_TIMEOUT = 90_000;

/** Time given to fonts, images, and entrance animations before the shot. */
const SETTLE_MS = 4_000;

async function loadPlaywright() {
  try {
    return await import("playwright");
  } catch {
    console.error(
      [
        "",
        "Playwright is not installed.",
        "",
        "Run these two commands, then try again:",
        "",
        "  npm install --no-save playwright",
        "  npx playwright install chromium",
        "",
      ].join("\n"),
    );
    process.exit(1);
  }
}

async function capture(page, target) {
  process.stdout.write(`  ${target.id.padEnd(12)} ${target.url}\n`);

  await page.goto(target.url, {
    waitUntil: "domcontentloaded",
    timeout: NAVIGATION_TIMEOUT,
  });

  // Let the network go quiet, but never hang on a page that keeps polling.
  await page.waitForLoadState("networkidle", { timeout: 20_000 }).catch(() => {});
  await page.waitForTimeout(SETTLE_MS);

  // Nudge the page down and back, which triggers any scroll based reveals so
  // the screenshot does not catch a half animated hero.
  await page.evaluate(() => window.scrollTo(0, 400));
  await page.waitForTimeout(700);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(900);

  const buffer = await page.screenshot({ type: "jpeg", quality: 82 });
  await writeFile(path.join(OUTPUT_DIR, `${target.id}.jpg`), buffer);

  const kilobytes = Math.round(buffer.length / 1024);
  process.stdout.write(`  ${" ".repeat(12)} saved ${target.id}.jpg, ${kilobytes} KB\n\n`);
}

async function main() {
  const { chromium } = await loadPlaywright();
  await mkdir(OUTPUT_DIR, { recursive: true });

  console.log(`\nCapturing ${TARGETS.length} websites into public/images/projects\n`);

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 1.5,
    // Some hosts serve a reduced page to unknown clients.
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  });

  const failed = [];

  for (const target of TARGETS) {
    const page = await context.newPage();
    try {
      await capture(page, target);
    } catch (error) {
      failed.push({ id: target.id, reason: error.message.split("\n")[0] });
      process.stdout.write(`  ${" ".repeat(12)} failed: ${error.message.split("\n")[0]}\n\n`);
    } finally {
      await page.close();
    }
  }

  await browser.close();

  const captured = TARGETS.length - failed.length;
  console.log(`Done. ${captured} of ${TARGETS.length} captured.`);

  if (failed.length > 0) {
    console.log("\nThese did not work:");
    for (const item of failed) console.log(`  ${item.id}: ${item.reason}`);
    console.log(
      "\nFree hosting often sleeps. Open the address in your browser once to wake it, then run this again.\n",
    );
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
