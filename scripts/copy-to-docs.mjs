// Copie le build Vite (dist) vers docs/ pour une publication GitHub Pages
// depuis la branche main. Ajoute un fichier .nojekyll pour servir les
// dossiers commencant par un point et le bundle tel quel.
import { cp, rm, mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const docs = join(root, "docs");

if (!existsSync(dist)) {
  console.error("Le dossier dist est absent. Lancez d'abord npm run build.");
  process.exit(1);
}

await rm(docs, { recursive: true, force: true });
await mkdir(docs, { recursive: true });
await cp(dist, docs, { recursive: true });
await writeFile(join(docs, ".nojekyll"), "");

console.log("Build copie dans docs/ pour GitHub Pages.");
