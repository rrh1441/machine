/* eslint-disable no-console ---------------------------------------------- */
/*  Generates circular QR codes for seattleballmachine.com court signage.
 *  White modules + ring on #1D2B53. PNGs written to public/qr/.
 *  Each QR points at https://www.seattleballmachine.com/q/{slug}
 *  which redirects to /courts/{slug} with UTM tracking.
 */

/*  1. DOM & canvas polyfill (qr-code-styling-node, Node ≥20) ───────────── */
const { JSDOM } = require("jsdom");
const {
  Canvas, createCanvas,
  CanvasRenderingContext2D, Image, ImageData
} = require("@napi-rs/canvas");

const dom = new JSDOM("<!doctype html><html><body></body></html>");
global.window   = dom.window;
global.document = dom.window.document;
global.self     = global;
dom.window.navigator = { userAgent: "node.js" };

global.HTMLCanvasElement = class extends Canvas {
  constructor(w = 300, h = 150) { return createCanvas(w, h); }
};
const orig = dom.window.document.createElement.bind(dom.window.document);
dom.window.document.createElement = (t) =>
  t.toLowerCase() === "canvas" ? createCanvas(300, 150) : orig(t);

global.CanvasRenderingContext2D = CanvasRenderingContext2D;
global.Image     = Image;
global.ImageData = ImageData;

/*  2. Libs ─────────────────────────────────────────────────────────────── */
const QRCodeStyling     = require("qr-code-styling-node");
const sharp             = require("sharp");
const path              = require("node:path");
const fs                = require("node:fs/promises");
const { parse: json2csv } = require("json2csv");

/*  3. Geometry & paths ─────────────────────────────────────────────────── */
const FINAL  = 800;                  /* finished PNG */
const QR     = 560;                  /* real square QR (fits with quiet-zone) */
const MARGIN = (FINAL - QR) / 2;     /* 120 px on all sides */
const OUT_DIR = path.resolve(__dirname, "..", "public", "qr");
const CSV     = path.resolve(__dirname, "..", "qr_manifest.csv");

/*  4. Colours ──────────────────────────────────────────────────────────── */
const BG = "#1D2B53";   /* dark fill */
const FG = "#FFFFFF";   /* white modules / ring */

/*  5. Courts (qr-slug, display, copies) ────────────────────────────────── */
/*  qr-slug appears in the encoded URL. lower-woodland-upper-courts is a
 *  distinct QR target even though it aliases the same court page via
 *  app/q/[slug]/route.ts. */
const COURTS = [
  { slug: "observatory-courts",             label: "Observatory",                copies: 2 },
  { slug: "david-rodgers-park",             label: "David Rodgers Park",         copies: 3 },
  { slug: "lower-woodland-playfield",       label: "Lower Woodland",             copies: 10 },
  { slug: "lower-woodland-upper-courts",    label: "Lower Woodland Upper Courts", copies: 4 },
  { slug: "wallingford-playfield",          label: "Wallingford Playfield",      copies: 2 },
  { slug: "magnolia-playfield",             label: "Magnolia Playfield",         copies: 4 },
  { slug: "magnolia-park",                  label: "Magnolia Park",              copies: 2 },
];

/*  6. SVG helpers ──────────────────────────────────────────────────────── */
const svgCircle = (fill, stroke, w = 4) =>
  Buffer.from(`<svg width="${FINAL}" height="${FINAL}">
    <circle cx="${FINAL / 2}" cy="${FINAL / 2}" r="${FINAL / 2 - w / 2}"
            ${fill   ? `fill="${fill}"`   : 'fill="none"'}
            ${stroke ? `stroke="${stroke}" stroke-width="${w}"` : ""}/>
  </svg>`);

/*  7. Decorative dots in the annulus around the QR ─────────────────────── */
function makeDecorativeDots(col) {
  const DOT_R   = 5;
  const STEP    = 14;
  const INNER   = MARGIN - 2;
  const R2_MAX  = (FINAL / 2 - DOT_R) ** 2;

  let circles = "";
  for (let y = DOT_R; y < FINAL; y += STEP) {
    for (let x = DOT_R; x < FINAL; x += STEP) {
      const dx = x - FINAL / 2, dy = y - FINAL / 2;
      if (dx * dx + dy * dy > R2_MAX) continue;
      if (
        x >= INNER && x <= FINAL - INNER &&
        y >= INNER && y <= FINAL - INNER
      ) continue;
      if (Math.random() < 0.45) continue;
      circles += `<circle cx="${x}" cy="${y}" r="${DOT_R}" />`;
    }
  }
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg"
         width="${FINAL}" height="${FINAL}" fill="${col}">${circles}</svg>`);
}

/*  8. Build ─────────────────────────────────────────────────────────────── */
(async () => {
  await fs.mkdir(OUT_DIR, { recursive: true });

  const manifest = [];

  for (const court of COURTS) {
    const url = `https://www.seattleballmachine.com/q/${court.slug}`;

    const qr = new QRCodeStyling({
      width: QR,
      height: QR,
      data: url,
      qrOptions: { errorCorrectionLevel: "H", margin: 4 },
      dotsOptions: { color: FG, type: "dots" },
      backgroundOptions: { color: "transparent" }
    });
    const qrBuf = await qr.getRawData("png");

    const final = await sharp({
      create: {
        width: FINAL,
        height: FINAL,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      }
    })
      .composite([
        { input: svgCircle(BG) },
        { input: qrBuf, top: MARGIN, left: MARGIN },
        { input: makeDecorativeDots(FG) },
        { input: svgCircle("none", FG, 4) }
      ])
      .png()
      .toBuffer();

    const file = `${court.slug}.png`;
    await fs.writeFile(path.join(OUT_DIR, file), final);
    console.log("✓", file, "→", url);

    manifest.push({
      slug: court.slug,
      label: court.label,
      file,
      copies: court.copies,
      url
    });
  }

  await fs.writeFile(
    CSV,
    json2csv(manifest, { fields: ["slug", "label", "file", "copies", "url"] }),
    "utf8"
  );
  console.log("→", CSV, "written");
})();
