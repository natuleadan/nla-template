import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

const SRC_DIR = path.resolve(__dirname, "../..");

const ALLOWED_FILES = [
  "locale/config.ts",
  "slug-resolver.ts",
  "lang-switcher.tsx",
  "/config/",
  ".test.",
  "no-hardcoded-strings",
];

function getAllFiles(dir: string, ext: string): string[] {
  const results: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory() && !entry.name.startsWith(".") && entry.name !== "node_modules") {
      results.push(...getAllFiles(full, ext));
    } else if (entry.isFile() && entry.name.endsWith(ext)) {
      results.push(full);
    }
  }
  return results;
}

describe("no hardcoded user-facing strings", () => {
  const tsxFiles = getAllFiles(SRC_DIR, ".tsx").filter(
    (f) => !ALLOWED_FILES.some((a) => f.includes(a)),
  );
  const tsFiles = getAllFiles(SRC_DIR, ".ts").filter(
    (f) => !ALLOWED_FILES.some((a) => f.includes(a)),
  );
  const apiFiles = getAllFiles(path.join(SRC_DIR, "app/api"), ".ts").filter(
    (f) => !ALLOWED_FILES.some((a) => f.includes(a)),
  );

  it("should not have hardcoded error strings in API routes", () => {
    const violations: string[] = [];
    const ERROR_PATTERNS = [
      /Error al obtener/,
      /Slug inválido/,
      /no encontrado/,
      /deshabilitado/,
      /configurada/,
      /requeridos?/,
      /Inténtalo/,
      /Demasiados (mensajes|solicitudes)/,
      /Has alcanzado/,
      /Error desconocido/,
      /Faltan parámetros/,
    ];

    for (const file of apiFiles) {
      const content = fs.readFileSync(file, "utf-8");
      const lines = content.split("\n");
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.includes("console.") || line.includes("isDev")) continue;
        for (const pattern of ERROR_PATTERNS) {
          if (pattern.test(line)) {
            const rel = path.relative(SRC_DIR, file);
            violations.push(`${rel}:${i + 1}: ${line.trim()}`);
          }
        }
      }
    }

    if (violations.length > 0) {
      console.log("\nHardcoded Spanish error strings in API routes (use config keys instead):");
      for (const v of violations) console.log(`  ${v}`);
    }
    expect(violations).toEqual([]);
  });

  it("should not have hardcoded alt/aria texts in components", () => {
    const violations: string[] = [];

    for (const file of tsxFiles) {
      const content = fs.readFileSync(file, "utf-8");
      const lines = content.split("\n");
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        if (/alt="(?:Logo|logo|background)"/.test(line)) {
          const rel = path.relative(SRC_DIR, file);
          violations.push(`${rel}:${i + 1}: ${line.trim()}`);
        }
      }
    }

    if (violations.length > 0) {
      console.log("\nHardcoded alt texts found (use cfg.ui.og.* instead):");
      for (const v of violations) console.log(`  ${v}`);
    }
    expect(violations).toEqual([]);
  });

  it("should not have hardcoded metadata not-found titles in catch blocks", () => {
    const violations: string[] = [];

    for (const file of tsxFiles) {
      const content = fs.readFileSync(file, "utf-8");
      const lines = content.split("\n");
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (/return\s*\{\s*title:\s*"(?:Product|Article|Page) not found"/.test(line)) {
          const rel = path.relative(SRC_DIR, file);
          violations.push(`${rel}:${i + 1}: ${line.trim()}`);
        }
      }
    }

    if (violations.length > 0) {
      console.log("\nHardcoded not-found titles found (use getConfig().ui.notFound.* instead):");
      for (const v of violations) console.log(`  ${v}`);
    }
    expect(violations).toEqual([]);
  });
});
