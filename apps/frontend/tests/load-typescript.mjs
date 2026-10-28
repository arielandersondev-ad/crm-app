import { readFileSync, existsSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import ts from "typescript";

// Ejecuta los módulos reales (incluido TSX) sin añadir un runtime de pruebas al proyecto.
export function createTypeScriptLoader(overrides = {}) {
  const cache = new Map();
  const src = resolve(import.meta.dirname, "../src");
  function load(filename) {
    filename = resolve(filename);
    if (cache.has(filename)) return cache.get(filename).exports;
    const module = { exports: {} };
    cache.set(filename, module);
    const require = createRequire(filename);
    const localRequire = (specifier) => {
      if (specifier in overrides) return overrides[specifier];
      if (!specifier.startsWith(".") && !specifier.startsWith("@/")) return require(specifier);
      const base = specifier.startsWith("@/") ? resolve(src, specifier.slice(2)) : resolve(dirname(filename), specifier);
      const target = [base, `${base}.ts`, `${base}.tsx`, `${base}/index.ts`].find((file) => existsSync(file) && /\.[cm]?[jt]sx?$/.test(file));
      return target ? load(target) : require(specifier);
    };
    const { outputText } = ts.transpileModule(readFileSync(filename, "utf8"), {
      fileName: filename,
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
    });
    new Function("require", "module", "exports", outputText)(localRequire, module, module.exports);
    return module.exports;
  }
  return load;
}
