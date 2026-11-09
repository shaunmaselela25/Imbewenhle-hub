import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const textFile = /\.(ts|tsx|js|jsx|css|mjs)$/;

export type SourceFile = { path: string; content: string };

export function readSourceFiles(folders: string[]): SourceFile[] {
  return folders.filter((folder) => existsSync(folder)).flatMap(readFolder);
}

function readFolder(folder: string): SourceFile[] {
  return readdirSync(folder, { withFileTypes: true }).flatMap((entry) => {
    const path = join(folder, entry.name);
    if (entry.isDirectory()) return readFolder(path);
    return textFile.test(entry.name) ? [{ path, content: readFileSync(path, "utf8") }] : [];
  });
}
