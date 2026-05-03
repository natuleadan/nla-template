import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

const SRC_DIR = path.resolve(__dirname, "../..");

type KeyMap = Record<string, string>;

function isNumeric(s: string): boolean {
  return /^\d+$/.test(s);
}

function collectStringKeys(obj: unknown, prefix = ""): KeyMap {
  const keys: KeyMap = {};
  if (typeof obj !== "object" || obj === null) return keys;
  for (const [k, v] of Object.entries(obj)) {
    const keyPath = prefix ? `${prefix}.${k}` : k;
    if (isNumeric(k)) continue;
    if (typeof v === "string") {
      keys[keyPath] = v;
    } else if (typeof v === "function") {
      keys[keyPath] = "fn";
    } else if (typeof v === "object" && v !== null) {
      if (Array.isArray(v)) continue;
      Object.assign(keys, collectStringKeys(v, keyPath));
    }
  }
  return keys;
}

function getAllTsFiles(dir: string): string[] {
  const results: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (
      entry.isDirectory() &&
      !entry.name.startsWith(".") &&
      entry.name !== "node_modules"
    ) {
      results.push(...getAllTsFiles(full));
    } else if (entry.isFile() && /\.(ts|tsx)$/.test(entry.name)) {
      results.push(full);
    }
  }
  return results;
}

function findImportFiles(allFiles: string[], configName: string): string[] {
  const sitePattern = new RegExp(
    `from\\s+["']@/lib/config/site["']|import\\s+\\{.*\\b${configName}\\b.*\\}\\s+from\\s+["']@/lib/config/site`,
  );
  const localePattern = /from\s+["']@\/lib\/locale\/config["']/;
  return allFiles.filter((f) => {
    const content = fs.readFileSync(f, "utf-8");
    return sitePattern.test(content) || localePattern.test(content);
  });
}

const configModules: Record<string, () => Promise<Record<string, unknown>>> = {
  agenda: () => import("@/lib/config/site/agenda").then((m) => m.agenda),
  blog: () => import("@/lib/config/site/blog").then((m) => m.blog),
  brand: () => import("@/lib/config/data/brand").then((m) => m.brand),
  form: () => import("@/lib/config/site/form").then((m) => m.form),
  home: () => import("@/lib/config/data/home").then((m) => m.home),
  nav: () => import("@/lib/config/data/nav").then((m) => m.nav),
  pages: () => import("@/lib/config/data/contacto").then((m) => m.pages),
  paginas: () => import("@/lib/config/site/paginas").then((m) => m.paginas),
  store: () => import("@/lib/config/site/store").then((m) => m.store),
  ui: () => import("@/lib/config/site/ui").then((m) => m.ui),
};

const allFiles = getAllTsFiles(SRC_DIR).filter(
  (f) =>
    !f.includes("node_modules") &&
    !f.includes(".test.") &&
    !f.includes("/config/site/") &&
    !f.includes("/config/data/"),
);

describe("config keys coverage", () => {
  for (const [name, loader] of Object.entries(configModules)) {
    it(`no dead keys in ${name}`, async () => {
      const config = await loader();
      const definedKeys = collectStringKeys(config);
      const definedPaths = Object.keys(definedKeys);

      const importFiles = findImportFiles(allFiles, name);

      const deadKeys: string[] = [];
      for (const kp of definedPaths) {
        const escaped = kp
          .split(".")
          .map((seg) => seg.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
          .join("\\.");

        const refPattern = new RegExp(`\\b${name}\\.${escaped}\\b`);
        const cfgPattern = new RegExp(`\\bcfg\\.${name}\\.${escaped}\\b`);
        let found = false;

        for (const file of importFiles) {
          const content = fs.readFileSync(file, "utf-8");
          if (refPattern.test(content) || cfgPattern.test(content)) {
            found = true;
            break;
          }
        }

        if (!found) {
          const parts = kp.split(".");
          for (let i = parts.length - 1; i >= 1; i--) {
            const parentPath = parts.slice(0, i).join(".");
            const parentPattern = new RegExp(
              `\\b${name}\\.${parentPath
                .split(".")
                .map((seg) => seg.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
                .join("\\.")}\\b`,
            );
            const parentCfgPattern = new RegExp(
              `\\bcfg\\.${name}\\.${parentPath
                .split(".")
                .map((seg) => seg.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
                .join("\\.")}\\b`,
            );
            for (const file of importFiles) {
              const content = fs.readFileSync(file, "utf-8");
              if (
                parentPattern.test(content) ||
                parentCfgPattern.test(content)
              ) {
                found = true;
                break;
              }
            }
            if (found) break;
          }
        }

        if (!found) deadKeys.push(kp);
      }

      if (deadKeys.length > 0) {
        console.log(`\nDead keys in ${name}:`);
        for (const k of deadKeys) {
          console.log(`  - ${name}.${k} = "${definedKeys[k]}"`);
        }
      }

      expect(deadKeys).toEqual([]);
    });
  }
});

describe("config keys reverse check", () => {
  for (const [name, loader] of Object.entries(configModules)) {
    it(`no missing key references in ${name}`, async () => {
      const config = await loader();
      const definedKeys = collectStringKeys(config);
      const allDefined = new Set(Object.keys(definedKeys));

      function addArrayProps(obj: unknown, prefix = "") {
        if (typeof obj !== "object" || obj === null) return;
        for (const [k, v] of Object.entries(obj)) {
          const keyPath = prefix ? `${prefix}.${k}` : k;
          if (Array.isArray(v)) {
            allDefined.add(keyPath);
          } else if (typeof v === "object" && v !== null) {
            addArrayProps(v, keyPath);
          }
        }
      }
      addArrayProps(config);

      const importFiles = findImportFiles(allFiles, name);
      const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const refPattern = new RegExp(
        `\\b${escapedName}\\.([a-zA-Z0-9_.]+)`,
        "g",
      );
      const cfgRefPattern = new RegExp(
        `\\bcfg\\.${escapedName}\\.([a-zA-Z0-9_.]+)`,
        "g",
      );

      const JS_METHODS = new Set([
        "length",
        "map",
        "find",
        "filter",
        "slice",
        "splice",
        "push",
        "pop",
        "shift",
        "unshift",
        "forEach",
        "reduce",
        "some",
        "every",
        "includes",
        "indexOf",
        "findIndex",
        "flatMap",
        "flat",
        "keys",
        "values",
        "entries",
        "get",
        "set",
        "clear",
        "delete",
        "has",
        "sort",
        "reverse",
        "concat",
        "join",
        "toString",
        "split",
      ]);

      const missing: string[] = [];
      const checked = new Set<string>();

      for (const file of importFiles) {
        const content = fs.readFileSync(file, "utf-8");

        for (const pattern of [refPattern, cfgRefPattern]) {
          pattern.lastIndex = 0;
          let match: RegExpExecArray | null;
          while ((match = pattern.exec(content)) !== null) {
            const suffix = match[1];
            if (!suffix || checked.has(suffix)) continue;
            checked.add(suffix);

            const parts = suffix.split(".");
            const lastPart = parts[parts.length - 1];
            if (JS_METHODS.has(lastPart)) continue;

            if (allDefined.has(suffix)) continue;

            const isKnown = [...allDefined].some(
              (d) => suffix.startsWith(d + ".") || d.startsWith(suffix),
            );
            if (isKnown) continue;

            const relPath = path.relative(SRC_DIR, file);
            missing.push(`  ${name}.${suffix} \u2192 ${relPath}`);
          }
        }
      }

      if (missing.length > 0) {
        console.log(`\nUndefined references in ${name}:`);
        for (const m of missing) console.log(m);
      }

      expect(missing).toEqual([]);
    });
  }
});
