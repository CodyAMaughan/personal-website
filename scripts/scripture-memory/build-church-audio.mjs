#!/usr/bin/env node
import { copyFile, mkdir, rm, stat, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { execFileSync, spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SCRIPTURE_PASSAGES } from "../../src/data/scriptureMemory.ts";

const ROOT_DIR = path.resolve(fileURLToPath(new URL("../..", import.meta.url)));
const CACHE_DIR = path.join(ROOT_DIR, ".cache", "scripture-memory", "church-audio");
const ZIP_DIR = path.join(CACHE_DIR, "zips");
const TMP_DIR = path.join(CACHE_DIR, "tmp");
const OUTPUT_DIR = path.join(ROOT_DIR, "public", "audio", "scripture-memory", "church");
const MANIFEST_PATH = path.join(ROOT_DIR, "src", "data", "scripture-memory", "churchAudioManifest.ts");

const VOICES = ["female", "male"];

const VOLUME_CONFIGS = {
  "old-testament": {
    title: "Old Testament",
    sourceSlugs: ["ot"],
    prefixes: ["ot"],
    urls: {
      female:
        "https://media2.ldscdn.org/assets/scriptures/the-old-testament/2015-11-0000-old-testament-female-voice-daisy-eng.zip",
      male:
        "https://media2.ldscdn.org/assets/scriptures/the-old-testament/2015-11-0000-old-testament-male-voice-daisy-eng.zip",
    },
  },
  "new-testament": {
    title: "New Testament",
    sourceSlugs: ["nt"],
    prefixes: ["nt"],
    urls: {
      female:
        "https://media2.ldscdn.org/assets/scriptures/the-new-testament/2015-11-0000-new-testament-female-voice-daisy-eng.zip",
      male:
        "https://media2.ldscdn.org/assets/scriptures/the-new-testament/2015-11-0000-new-testament-male-voice-daisy-eng.zip",
    },
  },
  "book-of-mormon": {
    title: "Book of Mormon",
    sourceSlugs: ["bofm"],
    prefixes: ["bofm"],
    urls: {
      female:
        "https://media2.ldscdn.org/assets/scriptures/the-book-of-mormon-another-testament-of-jesus-christ/2015-11-0000-the-book-of-mormon-female-voice-daisy-eng.zip",
      male:
        "https://media2.ldscdn.org/assets/scriptures/the-book-of-mormon-another-testament-of-jesus-christ/2015-11-0000-the-book-of-mormon-male-voice-daisy-eng.zip",
    },
  },
  "doctrine-and-covenants": {
    title: "Doctrine and Covenants",
    sourceSlugs: ["dc-testament"],
    prefixes: ["dc", "dandc"],
    urls: {
      female:
        "https://media2.ldscdn.org/assets/scriptures/the-doctrine-and-covenants/2015-11-0000-the-doctrine-and-covenants-female-voice-daisy-eng.zip",
      male:
        "https://media2.ldscdn.org/assets/scriptures/the-doctrine-and-covenants/2015-11-0000-the-doctrine-and-covenants-male-voice-daisy-eng.zip",
    },
  },
  "pearl-of-great-price": {
    title: "Pearl of Great Price",
    sourceSlugs: ["pgp"],
    prefixes: ["pgp"],
    urls: {
      female:
        "https://media2.ldscdn.org/assets/scriptures/the-pearl-of-great-price/2015-11-0000-pearl-of-great-price-female-voice-daisy-eng.zip",
      male:
        "https://media2.ldscdn.org/assets/scriptures/the-pearl-of-great-price/2015-11-0000-pearl-of-great-price-male-voice-daisy-eng.zip",
    },
  },
};

const BOOK_CODE_CANDIDATES = {
  "1-cor": ["1cor", "1co", "1-cor", "1_cor", "1corinthians"],
  "1-ne": ["1ne", "1-ne", "1_ne", "1nephi"],
  "1-pet": ["1pet", "1pe", "1-pet", "1_pet", "1peter"],
  "2-ne": ["2ne", "2-ne", "2_ne", "2nephi"],
  "2-thes": ["2thes", "2thess", "2-thes", "2_thes", "2thessalonians"],
  "2-tim": ["2tim", "2ti", "2-tim", "2_tim", "2timothy"],
  "3-ne": ["3ne", "3-ne", "3_ne", "3nephi"],
  abr: ["abr", "2abr", "abraham"],
  alma: ["alma"],
  amos: ["amos"],
  dan: ["dan", "daniel"],
  dc: ["dc", "dandc", "d-c", "d_c", "sec", "section"],
  eph: ["eph", "ephesians"],
  ether: ["ether"],
  ex: ["ex", "exo", "exod", "exodus"],
  ezek: ["ezek", "ezekiel"],
  gen: ["gen", "genesis"],
  heb: ["heb", "hebrews"],
  hel: ["hel", "helaman"],
  isa: ["isa", "isaiah"],
  james: ["james", "jas"],
  jer: ["jer", "jeremiah"],
  john: ["john", "jhn"],
  josh: ["josh", "joshua"],
  "js-h": ["jsh", "4jsh", "js-h", "js_h", "jshist", "josephsmithhistory"],
  luke: ["luke", "luk"],
  mal: ["mal", "malachi"],
  matt: ["matt", "mat", "matthew"],
  moro: ["moro", "moroni"],
  mosiah: ["mosiah"],
  moses: ["mos", "1mos", "moses"],
  prov: ["prov", "proverbs"],
  ps: ["ps", "psalm", "psalms", "psa"],
  rev: ["rev", "revelation"],
};

function requireCommand(command) {
  try {
    if (command === "unzip") {
      execFileSync(command, ["-v"], { stdio: "ignore" });
      return;
    }

    if (command === "zipinfo") {
      execFileSync(command, ["-h"], { stdio: "ignore" });
      return;
    }

    if (command === "ffmpeg" || command === "ffprobe") {
      execFileSync(command, ["-version"], { stdio: "ignore" });
      return;
    }

    execFileSync(command, ["--version"], { stdio: "ignore" });
  } catch {
    throw new Error(`Missing required command: ${command}`);
  }
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: ROOT_DIR,
    encoding: options.encoding ?? "utf8",
    maxBuffer: options.maxBuffer ?? 1024 * 1024 * 200,
    stdio: options.stdio ?? ["ignore", "pipe", "pipe"],
  });

  if (result.status !== 0) {
    throw new Error(
      `${command} ${args.join(" ")} failed\n${result.stderr?.toString() ?? ""}`,
    );
  }

  return result.stdout;
}

function normalizeId(value) {
  return value
    .toLowerCase()
    .replace(/&amp;/g, "and")
    .replace(/(?:[_\-\s]+)(?:bruce|david|hillary|kim|laura|lloyd|n|nathan|stephanie|v)$/, "")
    .replace(/[^a-z0-9]/g, "");
}

function decodeEntities(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function parseSourceUrl(sourceUrl) {
  const url = new URL(sourceUrl);
  const parts = url.pathname.split("/").filter(Boolean);
  const scripturesIndex = parts.indexOf("scriptures");
  const sourceSlug = parts[scripturesIndex + 1];
  const bookSlug = parts[scripturesIndex + 2];
  const chapter = parts[scripturesIndex + 3];
  const volumeId = Object.entries(VOLUME_CONFIGS).find(([, config]) =>
    config.sourceSlugs.includes(sourceSlug),
  )?.[0];

  if (!volumeId || !bookSlug || !chapter) {
    throw new Error(`Could not derive source metadata from ${sourceUrl}`);
  }

  return { volumeId, sourceSlug, bookSlug, chapter };
}

function getVerseNumbers(passage) {
  return passage.chunks.map((chunk) => {
    const match = chunk.verse.match(/\d+/);
    if (!match) throw new Error(`Could not parse verse "${chunk.verse}" for ${passage.reference}`);
    return match[0];
  });
}

function buildCandidateNorms(volumeConfig, bookSlug, chapter, verse) {
  const bookCodes = BOOK_CODE_CANDIDATES[bookSlug] ?? [bookSlug];
  const chapterForms = [chapter, chapter.padStart(2, "0"), chapter.padStart(3, "0")];
  const verseForms = [verse, verse.padStart(2, "0"), verse.padStart(3, "0")];
  const candidates = new Set();

  for (const prefix of volumeConfig.prefixes) {
    for (const bookCode of bookCodes) {
      for (const chapterForm of chapterForms) {
        for (const verseForm of verseForms) {
          candidates.add(normalizeId(`${prefix}_${bookCode}${chapterForm}_${verseForm}`));
          candidates.add(normalizeId(`${prefix}_${bookCode}_${chapterForm}_${verseForm}`));
          candidates.add(normalizeId(`${prefix}_${bookCode}${chapterForm}${verseForm}`));
          candidates.add(normalizeId(`${prefix}_${bookCode}_b_${chapterForm}_${verseForm}`));
          candidates.add(normalizeId(`${prefix}_${bookCode}_${verseForm}`));
          candidates.add(normalizeId(`${prefix}_${bookCode}${verseForm}`));
        }
      }
    }
  }

  for (const bookCode of bookCodes) {
    for (const chapterForm of chapterForms) {
      for (const verseForm of verseForms) {
        candidates.add(normalizeId(`${bookCode}${chapterForm}_${verseForm}`));
      candidates.add(normalizeId(`${bookCode}_${chapterForm}_${verseForm}`));
      candidates.add(normalizeId(`${bookCode}${chapterForm}${verseForm}`));
      candidates.add(normalizeId(`${bookCode}_b_${chapterForm}_${verseForm}`));
      candidates.add(normalizeId(`${bookCode}_${verseForm}`));
      candidates.add(normalizeId(`${bookCode}${verseForm}`));
    }
  }
  }

  return [...candidates];
}

function parseNcc(nccHtml) {
  const entries = [];
  const anchorPattern = /<a\s+href="([^"]+)">([\s\S]*?)<\/a>/g;
  let match;

  while ((match = anchorPattern.exec(nccHtml)) !== null) {
    const href = decodeEntities(match[1]);
    const label = decodeEntities(match[2].replace(/<[^>]+>/g, "").trim());
    const smilFile = href.split("#")[0];
    entries.push({
      index: entries.length,
      href,
      label,
      normalized: normalizeId(label),
      smilFile,
    });
  }

  return entries;
}

function getTrailingNumber(label) {
  const match = label.match(/(\d+)\s*$/);
  return match ? String(Number(match[1])) : null;
}

function isChapterMarker(entry, bookSlug, chapter) {
  const bookCodes = BOOK_CODE_CANDIDATES[bookSlug] ?? [bookSlug];
  const chapterForms = [chapter, chapter.padStart(2, "0"), chapter.padStart(3, "0")];
  return bookCodes.some((bookCode) => {
    return chapterForms.some((chapterForm) => {
      const base = normalizeId(`${bookCode} ${chapterForm}`);
      return (
        entry.normalized === `${base}title` ||
        entry.normalized === `${base}intro` ||
        entry.normalized === `${base}headintro` ||
        entry.normalized.endsWith(`${base}title`) ||
        entry.normalized.endsWith(`${base}intro`) ||
        entry.normalized.endsWith(`${base}headintro`)
      );
    });
  });
}

function isAnyChapterMarker(entry, bookSlug) {
  const bookCodes = BOOK_CODE_CANDIDATES[bookSlug] ?? [bookSlug];
  return bookCodes.some((bookCode) => {
    const bookNorm = normalizeId(bookCode);
    return (
      entry.normalized.includes(bookNorm) &&
      /(?:title|intro)$/.test(entry.normalized) &&
      /\d/.test(entry.normalized.slice(entry.normalized.indexOf(bookNorm) + bookNorm.length))
    );
  });
}

function findScopedVerseEntry({ entries, bookSlug, chapter, verse }) {
  const chapterStartIndex = entries.reduce((latest, entry, index) => {
    return isChapterMarker(entry, bookSlug, chapter) ? index : latest;
  }, -1);

  if (chapterStartIndex === -1) return null;

  const chapterEndIndex = entries.findIndex((entry, index) => {
    return index > chapterStartIndex && isAnyChapterMarker(entry, bookSlug);
  });
  const scopedEntries = entries.slice(
    chapterStartIndex + 1,
    chapterEndIndex === -1 ? undefined : chapterEndIndex,
  );
  const verseNumber = String(Number(verse));
  const matches = scopedEntries.filter((entry) => getTrailingNumber(entry.label) === verseNumber);

  return matches[0] ?? null;
}

function findNccEntry({ entries, volumeConfig, passage, bookSlug, chapter, verse }) {
  const candidateNorms = buildCandidateNorms(volumeConfig, bookSlug, chapter, verse);
  const exact = entries.find((entry) => candidateNorms.includes(entry.normalized));
  if (exact) return exact;

  const scoped = findScopedVerseEntry({ entries, bookSlug, chapter, verse });
  if (scoped) return scoped;

  const bookCodes = BOOK_CODE_CANDIDATES[bookSlug] ?? [bookSlug];
  const fuzzyMatches = entries.filter((entry) => {
    return bookCodes.some((bookCode) => {
      const bookNorm = normalizeId(bookCode);
      const chapterVerseNorms = [
        normalizeId(`${chapter}${verse}`),
        normalizeId(`${chapter}${verse.padStart(2, "0")}`),
        normalizeId(`${chapter}_${verse}`),
        normalizeId(`${chapter}_${verse.padStart(2, "0")}`),
      ];
      return entry.normalized.includes(bookNorm) && chapterVerseNorms.some((target) => entry.normalized.includes(target));
    });
  });

  if (fuzzyMatches.length === 1) return fuzzyMatches[0];

  const nearby = entries
    .filter((entry) => entry.normalized.includes(normalizeId(chapter)))
    .slice(0, 12)
    .map((entry) => entry.label)
    .join(", ");

  throw new Error(
    `Could not map ${passage.reference} verse ${verse}. Tried: ${candidateNorms
      .slice(0, 12)
      .join(", ")}. Fuzzy matches: ${fuzzyMatches
      .map((entry) => entry.label)
      .join(", ")}. Nearby: ${nearby}`,
  );
}

function parseAttributes(tag) {
  const attributes = {};
  const attrPattern = /([\w:-]+)="([^"]*)"/g;
  let match;
  while ((match = attrPattern.exec(tag)) !== null) {
    attributes[match[1]] = decodeEntities(match[2]);
  }
  return attributes;
}

function parseNpt(value) {
  const match = value?.match(/npt=([\d.]+)s/);
  if (!match) throw new Error(`Unsupported clip value: ${value}`);
  return Number(match[1]);
}

function parseSmilAudio(smilXml) {
  const segments = [];
  const audioPattern = /<audio\s+([^>]+?)\/?>/g;
  let match;

  while ((match = audioPattern.exec(smilXml)) !== null) {
    const attrs = parseAttributes(match[1]);
    segments.push({
      src: attrs.src,
      clipBegin: parseNpt(attrs["clip-begin"]),
      clipEnd: parseNpt(attrs["clip-end"]),
    });
  }

  if (segments.length === 0) {
    throw new Error("SMIL file did not contain audio segments");
  }

  const textSegments = segments.length > 1 ? segments.slice(1) : segments;
  const src = textSegments[0].src;
  if (!textSegments.every((segment) => segment.src === src)) {
    throw new Error(`SMIL uses multiple source files: ${textSegments.map((segment) => segment.src).join(", ")}`);
  }

  return {
    src,
    clipBegin: textSegments[0].clipBegin,
    clipEnd: textSegments[textSegments.length - 1].clipEnd,
  };
}

async function ensureDir(dir) {
  await mkdir(dir, { recursive: true });
}

async function downloadZip({ volumeId, voice, url }) {
  const destination = path.join(ZIP_DIR, `${volumeId}-${voice}.zip`);
  if (existsSync(destination)) {
    const { size } = await stat(destination);
    if (size > 0) {
      console.log(`Using cached ${path.relative(ROOT_DIR, destination)}`);
      return destination;
    }
  }

  console.log(`Downloading ${volumeId} ${voice}`);
  run(
    "curl",
    ["-L", "--fail", "--continue-at", "-", "--progress-bar", "--output", destination, url],
    { stdio: "inherit" },
  );
  return destination;
}

function listZipFiles(zipPath) {
  return run("zipinfo", ["-1", zipPath], { maxBuffer: 1024 * 1024 * 80 })
    .trim()
    .split(/\r?\n/)
    .filter(Boolean);
}

function readZipText(zipPath, internalPath) {
  return run("unzip", ["-p", zipPath, internalPath], { maxBuffer: 1024 * 1024 * 50 });
}

async function extractZipBinary(zipPath, internalPath, outputPath) {
  if (existsSync(outputPath)) return;
  const output = run("unzip", ["-p", zipPath, internalPath], {
    encoding: "buffer",
    maxBuffer: 1024 * 1024 * 40,
  });
  await writeFile(outputPath, output);
}

function trimAudio(inputPath, outputPath, clipBegin, clipEnd) {
  run("ffmpeg", [
    "-y",
    "-hide_banner",
    "-loglevel",
    "error",
    "-ss",
    clipBegin.toFixed(3),
    "-to",
    clipEnd.toFixed(3),
    "-i",
    inputPath,
    "-vn",
    "-ac",
    "1",
    "-ar",
    "44100",
    "-af",
    "aresample=async=1:first_pts=0",
    "-codec:a",
    "libmp3lame",
    "-b:a",
    "96k",
    outputPath,
  ]);
}

function concatAudio(inputPaths, outputPath) {
  const listPath = path.join(TMP_DIR, `concat-${path.basename(outputPath)}.txt`);
  const list = inputPaths.map((inputPath) => `file '${inputPath.replace(/'/g, "'\\''")}'`).join("\n");
  execFileSync("node", ["-e", `require('fs').writeFileSync(${JSON.stringify(listPath)}, ${JSON.stringify(list)})`]);
  run("ffmpeg", [
    "-y",
    "-hide_banner",
    "-loglevel",
    "error",
    "-f",
    "concat",
    "-safe",
    "0",
    "-i",
    listPath,
    "-ac",
    "1",
    "-codec:a",
    "libmp3lame",
    "-b:a",
    "96k",
    outputPath,
  ]);
}

function getDurationSeconds(filePath) {
  const raw = run("ffprobe", [
    "-v",
    "error",
    "-show_entries",
    "format=duration",
    "-of",
    "default=noprint_wrappers=1:nokey=1",
    filePath,
  ]).trim();
  return Math.round(Number(raw) * 1000) / 1000;
}

async function prepareDaisySource(volumeId, voice, zipPath) {
  const files = listZipFiles(zipPath);
  const nccPath = files.find((file) => file.endsWith("/ncc.html") || file === "ncc.html");
  if (!nccPath) throw new Error(`Could not find ncc.html in ${zipPath}`);

  const baseDir = path.posix.dirname(nccPath);
  const nccHtml = readZipText(zipPath, nccPath);
  return {
    volumeId,
    voice,
    zipPath,
    baseDir: baseDir === "." ? "" : baseDir,
    entries: parseNcc(nccHtml),
  };
}

function zipPathFor(source, fileName) {
  return source.baseDir ? path.posix.join(source.baseDir, fileName) : fileName;
}

async function buildVoiceClip({ source, volumeConfig, passage, sourceMeta, voice }) {
  const outputVoiceDir = path.join(OUTPUT_DIR, voice);
  await ensureDir(outputVoiceDir);

  const passageTmpDir = path.join(TMP_DIR, voice, passage.id);
  await rm(passageTmpDir, { force: true, recursive: true });
  await ensureDir(passageTmpDir);

  const piecePaths = [];
  const sourceVerses = [];
  const verseNumbers = getVerseNumbers(passage);

  for (const [index, verse] of verseNumbers.entries()) {
    const entry = findNccEntry({
      entries: source.entries,
      volumeConfig,
      passage,
      bookSlug: sourceMeta.bookSlug,
      chapter: sourceMeta.chapter,
      verse,
    });
    const smilPath = zipPathFor(source, entry.smilFile);
    const smilXml = readZipText(source.zipPath, smilPath);
    const audio = parseSmilAudio(smilXml);
    const audioPath = zipPathFor(source, audio.src);
    const sourceAudioPath = path.join(passageTmpDir, `${index}-${audio.src}`);
    const piecePath = path.join(passageTmpDir, `${index}-${verse}.mp3`);

    await extractZipBinary(source.zipPath, audioPath, sourceAudioPath);
    trimAudio(sourceAudioPath, piecePath, audio.clipBegin, audio.clipEnd);

    piecePaths.push(piecePath);
    sourceVerses.push({
      verse,
      label: entry.label,
      smil: entry.smilFile,
      audio: audio.src,
      clipBegin: audio.clipBegin,
      clipEnd: audio.clipEnd,
    });
  }

  const outputPath = path.join(outputVoiceDir, `${passage.id}.mp3`);
  if (piecePaths.length === 1) {
    await copyFile(piecePaths[0], outputPath);
  } else {
    concatAudio(piecePaths, outputPath);
  }

  return {
    url: `/audio/scripture-memory/church/${voice}/${passage.id}.mp3`,
    durationSeconds: getDurationSeconds(outputPath),
    sourceVerses,
  };
}

function formatManifest(entries) {
  const generatedAt = new Date().toISOString();
  const body = JSON.stringify(entries, null, 2);

  return `// Generated by npm run scripture:audio. Do not edit by hand.
// Source: official Church DAISY scripture audio downloads.
// Generated at: ${generatedAt}

export type ChurchAudioVoice = "female" | "male";

export interface ChurchAudioSourceVerse {
  verse: string;
  label: string;
  smil: string;
  audio: string;
  clipBegin: number;
  clipEnd: number;
}

export interface ChurchAudioManifestEntry {
  passageId: string;
  reference: string;
  sourceVolume: string;
  sourceBook: string;
  sourceChapter: string;
  femaleUrl: string;
  maleUrl: string;
  durationSeconds: Record<ChurchAudioVoice, number>;
  sourceVerses: Record<ChurchAudioVoice, readonly ChurchAudioSourceVerse[]>;
}

export const CHURCH_AUDIO_MANIFEST = ${body} as const satisfies readonly ChurchAudioManifestEntry[];

export const CHURCH_AUDIO_BY_PASSAGE_ID = Object.fromEntries(
  CHURCH_AUDIO_MANIFEST.map((entry) => [entry.passageId, entry]),
) as Record<string, ChurchAudioManifestEntry>;

export function getChurchAudioUrl(passageId: string, voice: ChurchAudioVoice = "female") {
  const entry = CHURCH_AUDIO_BY_PASSAGE_ID[passageId];
  return voice === "male" ? entry?.maleUrl : entry?.femaleUrl;
}
`;
}

async function main() {
  for (const command of ["curl", "zipinfo", "unzip", "ffmpeg", "ffprobe"]) {
    requireCommand(command);
  }

  await ensureDir(ZIP_DIR);
  await ensureDir(TMP_DIR);
  await ensureDir(OUTPUT_DIR);

  const sources = {};
  for (const [volumeId, config] of Object.entries(VOLUME_CONFIGS)) {
    sources[volumeId] = {};
    for (const voice of VOICES) {
      const zipPath = await downloadZip({ volumeId, voice, url: config.urls[voice] });
      sources[volumeId][voice] = await prepareDaisySource(volumeId, voice, zipPath);
    }
  }

  await rm(path.join(OUTPUT_DIR, "female"), { force: true, recursive: true });
  await rm(path.join(OUTPUT_DIR, "male"), { force: true, recursive: true });

  const manifestEntries = [];

  for (const [passageIndex, passage] of SCRIPTURE_PASSAGES.entries()) {
    const sourceMeta = parseSourceUrl(passage.sourceUrl);
    const volumeConfig = VOLUME_CONFIGS[sourceMeta.volumeId];
    console.log(`[${passageIndex + 1}/${SCRIPTURE_PASSAGES.length}] ${passage.reference}`);

    const female = await buildVoiceClip({
      source: sources[sourceMeta.volumeId].female,
      volumeConfig,
      passage,
      sourceMeta,
      voice: "female",
    });
    const male = await buildVoiceClip({
      source: sources[sourceMeta.volumeId].male,
      volumeConfig,
      passage,
      sourceMeta,
      voice: "male",
    });

    manifestEntries.push({
      passageId: passage.id,
      reference: passage.reference,
      sourceVolume: sourceMeta.volumeId,
      sourceBook: sourceMeta.bookSlug,
      sourceChapter: sourceMeta.chapter,
      femaleUrl: female.url,
      maleUrl: male.url,
      durationSeconds: {
        female: female.durationSeconds,
        male: male.durationSeconds,
      },
      sourceVerses: {
        female: female.sourceVerses,
        male: male.sourceVerses,
      },
    });
  }

  const missing = SCRIPTURE_PASSAGES.filter((passage) => {
    const entry = manifestEntries.find((candidate) => candidate.passageId === passage.id);
    return !entry?.femaleUrl || !entry?.maleUrl;
  });

  if (manifestEntries.length !== 96 || missing.length > 0) {
    throw new Error(
      `Audio generation incomplete: ${manifestEntries.length} entries, missing ${missing
        .map((passage) => passage.reference)
        .join(", ")}`,
    );
  }

  await writeFile(MANIFEST_PATH, formatManifest(manifestEntries));
  console.log(`Wrote ${path.relative(ROOT_DIR, MANIFEST_PATH)}`);
  console.log("Generated 96 female clips and 96 male clips.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
