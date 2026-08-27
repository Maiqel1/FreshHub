import { readFileSync } from "node:fs";

const ENTRY =
  /^\s*([\w.-]+)\s*=\s*("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|[^#\r\n]*)/gm;

const UNESCAPE = { n: "\n", r: "\r", t: "\t", '"': '"', "'": "'", "\\": "\\" };

export function loadEnv(file = ".env.local") {
  const raw = readFileSync(file, "utf8");
  const parsed = {};

  for (const [, name, value] of raw.matchAll(ENTRY)) {
    const quote = value[0];
    if (quote === '"') {
      parsed[name] = value
        .slice(1, -1)
        .replace(/\\(.)/g, (match, char) => UNESCAPE[char] ?? match);
    } else if (quote === "'") {
      parsed[name] = value.slice(1, -1);
    } else {
      parsed[name] = value.trim();
    }
  }

  return { ...parsed, ...process.env };
}

export function requireVars(env, names) {
  const missing = names.filter((n) => !env[n]);
  if (missing.length) {
    console.error(`missing in .env.local: ${missing.join(", ")}`);
    process.exit(1);
  }
}

export function privateKey(env) {
  const raw = env.FIREBASE_PRIVATE_KEY ?? "";
  const key = raw.includes("\\n") ? raw.replace(/\\n/g, "\n") : raw;
  if (!key.includes("\n")) {
    console.error(
      "FIREBASE_PRIVATE_KEY has no line breaks — the copy lost its \\n separators. Re-copy private_key from the service account JSON.",
    );
    process.exit(1);
  }
  return key;
}
