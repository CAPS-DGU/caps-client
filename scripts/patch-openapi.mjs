import fs from "node:fs/promises";

const RAW = "openapi.raw.json";
const PATCHED = "openapi.patched.json";

const rawText = await fs.readFile(RAW, "utf8");
const spec = JSON.parse(rawText);

// Fix common Springdoc mis-shapes for JWT security scheme so orval validation passes.
spec.components ??= {};
spec.components.securitySchemes ??= {};

const jwt = spec.components.securitySchemes.JWT;
if (jwt && typeof jwt === "object") {
  // `name` is only valid for apiKey schemes; http(bearer) must not have it.
  if (jwt.type === "http") {
    delete jwt.name;
    jwt.scheme ??= "bearer";
    jwt.bearerFormat ??= "JWT";
  }
}

await fs.writeFile(PATCHED, JSON.stringify(spec, null, 2) + "\n", "utf8");
console.log(`Patched OpenAPI written to ${PATCHED}`);


