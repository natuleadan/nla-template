import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

const SRC_DIR = path.resolve(__dirname, "../..");

const ALLOWED_PATTERNS = [
  "locale/config.ts",
  "slug-resolver.ts",
  "lang-switcher.tsx",
];

function getAllTsxFiles(dir: string): string[] {
  const results: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory() && !entry.name.startsWith(".") && entry.name !== "node_modules") {
      results.push(...getAllTsxFiles(full));
    } else if (entry.isFile() && /\.(tsx|ts)$/.test(entry.name)) {
      results.push(full);
    }
  }
  return results;
}

describe("no hardcoded locale ternaries", () => {
  const files = getAllTsxFiles(SRC_DIR).filter(
    (f) => !f.includes("node_modules") && !f.includes(".test.") && !f.includes("/config/"),
  );

  it("should not have lang === 'en' or locale === 'en' hardcoded in tsx/ts files", () => {
    const violations: string[] = [];

    for (const file of files) {
      const allowed = ALLOWED_PATTERNS.some((p) => file.includes(p));
      if (allowed) continue;

      const content = fs.readFileSync(file, "utf-8");
      const lines = content.split("\n");

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (
          /lang\s*===\s*['"]en['"]/.test(line) ||
          /locale\s*===\s*['"]en['"]/.test(line)
        ) {
          const rel = path.relative(SRC_DIR, file);
          violations.push(`${rel}:${i + 1}: ${line.trim()}`);
        }
      }
    }

    if (violations.length > 0) {
      console.log("\nHardcoded locale ternaries found (use config keys instead):");
      for (const v of violations) console.log(`  ${v}`);
    }

    expect(violations).toEqual([]);
  });
});
