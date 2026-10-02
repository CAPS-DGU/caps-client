import fs from "node:fs/promises";

const url = process.env.OPENAPI_URL ?? "https://api.dgucaps.kr/v3/api-docs";
const out = "openapi.raw.json";

const res = await fetch(url);
if (!res.ok) {
  throw new Error(`Failed to fetch OpenAPI: ${res.status} ${res.statusText}`);
}

const text = await res.text();
await fs.writeFile(out, text.endsWith("\n") ? text : text + "\n", "utf8");
console.log(`OpenAPI fetched from ${url} -> ${out}`);


