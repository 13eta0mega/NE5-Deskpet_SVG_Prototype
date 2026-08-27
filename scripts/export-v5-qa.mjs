import fs from "node:fs";
import path from "node:path";
import { EMOTIONS, PART_IDS, STATES } from "../src/v5-model.js";

const esc = s => String(s).replace(/[&<>\"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[c]));
const attrs = obj => Object.entries(obj).filter(([k,v]) => k !== "tag" && v != null).map(([k,v]) => {
  const key = k === "strokeWidth" ? "stroke-width" : k === "strokeLinecap" ? "stroke-linecap" : k === "strokeLinejoin" ? "stroke-linejoin" : k;
  return `${key}="${esc(v)}"`;
}).join(" ");

function renderPart(part) {
  if (part.tag === "path") return `<path ${attrs(part)}/>`;
  if (part.tag === "rect") return `<rect ${attrs(part)}/>`;
  if (part.tag === "circle") return `<circle ${attrs(part)}/>`;
  if (part.tag === "ellipse") return `<ellipse ${attrs(part)}/>`;
  throw new Error(`Unknown tag ${part.tag}`);
}

const width = 920, height = 920, step = 225;
const out = [`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`, `<rect width="100%" height="100%" fill="#F7F4EE"/>`];
EMOTIONS.forEach((emotion, i) => {
  const x = 20 + (i % 4) * step, y = 20 + Math.floor(i / 4) * step;
  out.push(`<g transform="translate(${x} ${y})"><rect width="200" height="200" rx="24" fill="#fff"/>`);
  for (const id of PART_IDS) out.push(renderPart(STATES[emotion.key][id]));
  out.push(`<text x="100" y="216" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" font-weight="700" fill="#3B3D43">${esc(emotion.english)}</text></g>`);
});
out.push(`</svg>`);
const target = path.resolve("public/v5-emotion-contact-sheet.svg");
fs.mkdirSync(path.dirname(target), { recursive: true });
fs.writeFileSync(target, out.join(""));
console.log(target);
