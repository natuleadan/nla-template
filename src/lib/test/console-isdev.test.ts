import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

const SRC_DIR = path.resolve(__dirname, "../..");

function getAllSourceFiles(dir: string): string[] {
  const results: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!entry.name.startsWith(".") && entry.name !== "node_modules") {
        results.push(...getAllSourceFiles(full));
      }
    } else if (entry.isFile() && /\.(ts|tsx)$/.test(entry.name)) {
      results.push(full);
    }
  }
  return results;
}

const allSourceFiles = getAllSourceFiles(SRC_DIR).filter(
  (f) =>
    !f.includes(".test.") &&
    !f.includes("/config/") &&
    !f.includes("node_modules"),
);

const CONSOLE_PATTERN = /\bconsole\.(log|error|warn|info|debug|trace)\s*\(/;

const isDevGuardPattern = (method: string) =>
  new RegExp(`if\\s*\\(\\s*isDev\\s*\\)\\s*console\\.${method}\\s*\\(`);

describe("console.* calls must be wrapped in isDev guard", () => {
  for (const file of allSourceFiles) {
    it(`no bare console.* in ${path.relative(SRC_DIR, file)}`, () => {
      const content = fs.readFileSync(file, "utf-8");
      const lines = content.split("\n");
      const violations: { line: number; text: string }[] = [];

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const match = line.match(CONSOLE_PATTERN);
        if (!match) continue;

        const method = match[1];
        const guardRe = isDevGuardPattern(method);

        // Check if the current line has the guard, or the previous line ends with `if (isDev)`
        const prevLine = i > 0 ? lines[i - 1] : "";
        const isGuarded =
          guardRe.test(line) || /if\s*\(\s*isDev\s*\)\s*$/.test(prevLine);

        if (!isGuarded) {
          violations.push({ line: i + 1, text: line.trim() });
        }
      }

      expect(
        violations,
        [
          `Found bare console. calls in ${path.relative(SRC_DIR, file)}:`,
          ...violations.map((v) => `  line ${v.line}: ${v.text}`),
        ].join("\n"),
      ).toEqual([]);
    });
  }
});
