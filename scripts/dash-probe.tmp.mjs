import { chromium } from "playwright-core";

const TOKEN = process.argv[2];
const OUT = "C:/Users/HP/AppData/Local/Temp/opencode";

const browser = await chromium.launch({
  channel: "msedge",
  headless: true,
});

async function probe(name, viewport) {
  const context = await browser.newContext({
    viewport,
    deviceScaleFactor: 2,
  });
  await context.addCookies([
    {
      name: "artblush_session",
      value: TOKEN,
      url: "https://admin.artblush.in",
    },
  ]);
  const page = await context.newPage();
  const errors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  await page.goto("https://admin.artblush.in/admin", { waitUntil: "networkidle" });
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: true });

  const diag = await page.evaluate(() => {
    const doc = document.scrollingElement;
    const offenders = [];
    document.querySelectorAll("*").forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.right > doc.clientWidth + 1 && el.offsetParent !== null) {
        const cls = (el.className && el.className.baseVal !== undefined ? el.className.baseVal : el.className) || "";
        offenders.push(`${el.tagName}.${String(cls).split(" ")[0]} right=${Math.round(r.right)} w=${Math.round(r.width)}`);
      }
    });
    return {
      viewport: doc.clientWidth,
      scrollWidth: doc.scrollWidth,
      bodyScrollW: document.body.scrollWidth,
      offenders: offenders.slice(0, 12),
    };
  });
  console.log(`--- ${name} (${viewport.width}x${viewport.height}) ---`);
  console.log(JSON.stringify(diag, null, 1));
  if (errors.length) console.log("console errors:", errors.slice(0, 5));
  await context.close();
}

await probe("dash-mobile-390", { width: 390, height: 844 });
await probe("dash-mobile-360", { width: 360, height: 800 });
await probe("dash-tablet-768", { width: 768, height: 1024 });
await probe("dash-desktop-1440", { width: 1440, height: 900 });

await browser.close();