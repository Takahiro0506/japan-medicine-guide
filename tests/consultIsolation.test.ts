import fs from "node:fs";
import path from "node:path";
import { describe, expect, test } from "vitest";

// アーキテクチャテスト: /consult が商品データに触れていないことを import グラフで検査する。
// 新しい依存パッケージは使わず、正規表現でファイルを読んで import 文を辿るだけの簡易実装。

const ROOT = path.resolve(__dirname, "..");
const EXTENSIONS = [".ts", ".tsx", ".js", ".jsx"];

const LIB_DATA = path.join(ROOT, "lib", "data.ts");
const FORBIDDEN_MODULES = [
  path.join(ROOT, "data", "products.ts"),
  path.join(ROOT, "data", "productIngredients.ts"),
  path.join(ROOT, "data", "foreignBrands.ts"),
];

// /consult が lib/data.ts 経由で呼んでよい商品系以外のシンボルだけを許可する
const ALLOWED_LIB_DATA_NAMES = new Set(["getConsultOptions", "ConsultOption"]);

interface ImportInfo {
  specifier: string;
  names: string[];
}

function extractImports(filePath: string): ImportInfo[] {
  const content = fs.readFileSync(filePath, "utf8");
  const importRegex = /import\s+(?:type\s+)?([^;]*?)\s+from\s+["']([^"']+)["']/g;
  const results: ImportInfo[] = [];
  let match: RegExpExecArray | null;
  while ((match = importRegex.exec(content))) {
    const clause = match[1];
    const specifier = match[2];
    const namedMatch = clause.match(/\{([^}]*)\}/);
    const names = namedMatch
      ? namedMatch[1]
          .split(",")
          .map((s) => s.replace(/^\s*type\s+/, "").trim())
          .map((s) => s.split(/\s+as\s+/)[0].trim())
          .filter(Boolean)
      : [];
    results.push({ specifier, names });
  }
  return results;
}

function resolveModule(specifier: string, fromFile: string): string | null {
  let base: string;
  if (specifier.startsWith(".")) {
    base = path.resolve(path.dirname(fromFile), specifier);
  } else if (specifier.startsWith("@/")) {
    base = path.resolve(ROOT, specifier.slice(2));
  } else {
    // 外部パッケージ (react, next/link 等) はプロジェクト内ファイルではないので辿らない
    return null;
  }

  if (fs.existsSync(base) && fs.statSync(base).isFile()) return base;
  for (const ext of EXTENSIONS) {
    if (fs.existsSync(base + ext)) return base + ext;
  }
  for (const ext of EXTENSIONS) {
    const indexPath = path.join(base, "index" + ext);
    if (fs.existsSync(indexPath)) return indexPath;
  }
  return null;
}

function consultEntryFiles(): string[] {
  const dir = path.join(ROOT, "app", "consult");
  return fs
    .readdirSync(dir)
    .filter((f) => /\.(ts|tsx)$/.test(f))
    .map((f) => path.join(dir, f));
}

function walkConsultImportGraph() {
  const visited = new Set<string>();
  const forbiddenHits: string[] = [];
  const libDataNamesSeen = new Set<string>();
  const queue = [...consultEntryFiles()];

  while (queue.length > 0) {
    const file = queue.shift()!;
    if (visited.has(file)) continue;
    visited.add(file);

    for (const imp of extractImports(file)) {
      const resolved = resolveModule(imp.specifier, file);
      if (!resolved) continue;

      if (FORBIDDEN_MODULES.includes(resolved)) {
        forbiddenHits.push(`${path.relative(ROOT, file)} -> ${path.relative(ROOT, resolved)}`);
        continue;
      }

      if (resolved === LIB_DATA) {
        // lib/data.ts は唯一の許可された参照口。その先の data/ 内部までは辿らない。
        // ここではどの名前を import しているかだけを記録する
        imp.names.forEach((n) => libDataNamesSeen.add(n));
        continue;
      }

      if (!visited.has(resolved)) {
        queue.push(resolved);
      }
    }
  }

  return { visited, forbiddenHits, libDataNamesSeen };
}

describe("/consult never reaches product data", () => {
  test("no direct or indirect import of data/products, data/productIngredients or data/foreignBrands", () => {
    const { forbiddenHits } = walkConsultImportGraph();
    expect(forbiddenHits).toEqual([]);
  });

  test("lib/data.ts is only used for getConsultOptions / the ConsultOption type", () => {
    const { libDataNamesSeen } = walkConsultImportGraph();

    // lib/data.ts を経由していること自体は確認する（空振りテストにしないため）
    expect(libDataNamesSeen.size).toBeGreaterThan(0);

    const disallowed = [...libDataNamesSeen].filter((name) => !ALLOWED_LIB_DATA_NAMES.has(name));
    expect(disallowed).toEqual([]);
  });
});
