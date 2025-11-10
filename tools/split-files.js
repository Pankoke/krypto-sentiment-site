import { readFileSync, mkdirSync, writeFileSync } from "fs";
import { dirname } from "path";
const src = readFileSync(process.argv[2], "utf8");
const parts = src.split(/^\s*\/\/ FILE:\s+/m).slice(1);
for (const part of parts) {
  const [header, ...rest] = part.split("\n");
  const filepath = header.trim();
  const content = rest.join("\n").replace(/^\n/, "");
  mkdirSync(dirname(filepath), { recursive: true });
  writeFileSync(filepath, content, "utf8");
  console.log("Wrote", filepath);
}
