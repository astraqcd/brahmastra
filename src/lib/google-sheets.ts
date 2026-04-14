import type { Tool, ToolsData } from "./types";
import fallbackData from "./data.json";

const SHEET_ID = "14S8ykMw3VkkfeAIKH97O-ohvgJu1n2xFSXbNaftIUzE";
const SHEET_BASE_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv`;

/**
 * Each tab in the spreadsheet maps to a category via its GID.
 */
const SHEET_TABS: { gid: string; categoryId: string }[] = [
  { gid: "275148106", categoryId: "PHONE_EMAIL" },
  { gid: "2138411365", categoryId: "SOCMINT" },
  { gid: "1568434324", categoryId: "MALWARE" },
  { gid: "764635392", categoryId: "GEOINT" },
  { gid: "312278353", categoryId: "WEBINT" },
  { gid: "1537751684", categoryId: "IMINT" },
  { gid: "1936794883", categoryId: "SIGINT" },
  { gid: "1451389906", categoryId: "DARKWEB" },
];

/**
 * Map spreadsheet "Type" column values to internal category IDs.
 * Keys are lowercase for case-insensitive matching.
 */
const TYPE_TO_CATEGORY: Record<string, string> = {
  "geo int": "GEOINT",
  geoint: "GEOINT",
  geospatial: "GEOINT",
  "geo spatial": "GEOINT",
  "geospatial intelligence": "GEOINT",
  image: "IMINT",
  "image int": "IMINT",
  imint: "IMINT",
  imagery: "IMINT",
  "imagery intelligence": "IMINT",
  "social media int": "SOCMINT",
  socmint: "SOCMINT",
  "social media": "SOCMINT",
  "social media intelligence": "SOCMINT",
  website: "WEBINT",
  webint: "WEBINT",
  web: "WEBINT",
  "web intelligence": "WEBINT",
  ai: "WEBINT",
  "search engine": "WEBINT",
  "e mail and phone": "PHONE_EMAIL",
  "email and phone": "PHONE_EMAIL",
  "e-mail and phone": "PHONE_EMAIL",
  "e mail": "PHONE_EMAIL",
  email: "PHONE_EMAIL",
  phone_email: "PHONE_EMAIL",
  "phone email": "PHONE_EMAIL",
  "phone & email": "PHONE_EMAIL",
  "phone & email intelligence": "PHONE_EMAIL",
  "dark web": "DARKWEB",
  darkweb: "DARKWEB",
  "dark web intelligence": "DARKWEB",
  sigint: "SIGINT",
  signals: "SIGINT",
  "signals intelligence": "SIGINT",
  malware: "MALWARE",
  "malware intelligence": "MALWARE",
};

/**
 * Static category definitions — these don't change with the sheet.
 */
const CATEGORIES = fallbackData.categories;

/**
 * Lookup map: tool URL → existing tool data (for descriptions & tags).
 */
const existingToolsByUrl = new Map(
  fallbackData.tools.map((t) => [t.url.replace(/\/$/, ""), t])
);
const existingToolsByName = new Map(
  fallbackData.tools.map((t) => [t.name.toLowerCase(), t])
);

/**
 * Very small CSV parser that handles quoted fields and newlines within quotes.
 */
function parseCSV(csv: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = "";
  let inQuotes = false;

  for (let i = 0; i < csv.length; i++) {
    const ch = csv[i];
    const next = csv[i + 1];

    if (inQuotes) {
      if (ch === '"' && next === '"') {
        currentField += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        currentField += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ",") {
        currentRow.push(currentField.trim());
        currentField = "";
      } else if (ch === "\r" && next === "\n") {
        currentRow.push(currentField.trim());
        currentField = "";
        rows.push(currentRow);
        currentRow = [];
        i++;
      } else if (ch === "\n") {
        currentRow.push(currentField.trim());
        currentField = "";
        rows.push(currentRow);
        currentRow = [];
      } else {
        currentField += ch;
      }
    }
  }

  // Last field / row
  if (currentField || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    rows.push(currentRow);
  }

  return rows;
}

function resolveCategory(raw: string): string {
  const key = raw.toLowerCase().trim();
  return TYPE_TO_CATEGORY[key] || "WEBINT";
}

function generateTags(name: string, category: string): string[] {
  const tags: string[] = [];
  const lower = name.toLowerCase();

  // Category-based tags
  const catTags: Record<string, string[]> = {
    GEOINT: ["geolocation", "maps"],
    IMINT: ["image", "analysis"],
    SOCMINT: ["social-media", "osint"],
    WEBINT: ["search", "web"],
    PHONE_EMAIL: ["email", "phone"],
    DARKWEB: ["dark-web", "tor"],
    SIGINT: ["signals", "recon"],
    MALWARE: ["malware", "security"],
  };

  tags.push(...(catTags[category] || ["osint"]));

  // Name-based hints
  if (lower.includes("map")) tags.push("maps");
  if (lower.includes("search")) tags.push("search");
  if (lower.includes("gpt") || lower.includes("ai")) tags.push("ai");
  if (lower.includes("download")) tags.push("download");
  if (lower.includes("track")) tags.push("tracking");

  return [...new Set(tags)].slice(0, 4);
}

function generateDescription(name: string, category: string): string {
  const catLabel =
    CATEGORIES.find((c) => c.id === category)?.title || "Intelligence";
  return `${name} — a ${catLabel.toLowerCase()} tool for OSINT research and analysis.`;
}

/**
 * Fetch tools from all Google Sheet tabs and merge with existing data.
 * Falls back to static data.json if the fetch fails.
 */
export async function fetchToolsData(): Promise<ToolsData> {
  try {
    const tools: Tool[] = [];
    const seenUrls = new Set<string>();

    // Fetch all tabs in parallel
    const results = await Promise.allSettled(
      SHEET_TABS.map(async ({ gid, categoryId }) => {
        const url = `${SHEET_BASE_URL}&gid=${gid}`;
        const res = await fetch(url, {
          next: { revalidate: 60 },
        });
        if (!res.ok) return { categoryId, rows: [] as string[][] };
        const csv = await res.text();
        return { categoryId, rows: parseCSV(csv) };
      })
    );

    for (const result of results) {
      if (result.status !== "fulfilled") continue;
      const { categoryId, rows } = result.value;
      if (rows.length < 2) continue;

      // Detect column indices from header row
      const header = rows[0].map((h) => h.toLowerCase().trim());
      const toolCol = header.findIndex(
        (h) => h === "tool" || h === "tool name" || h === "name" || h === "c"
      );
      const linkCol = header.findIndex(
        (h) => h === "link" || h === "url" || h === "d"
      );
      const workingCol = header.findIndex(
        (h) => h === "working" || h === "status" || h === "w"
      );

      const nCol = toolCol >= 0 ? toolCol : 2;
      const lCol = linkCol >= 0 ? linkCol : 3;
      const wCol = workingCol >= 0 ? workingCol : -1;

      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const name = row[nCol]?.trim();
        let link = row[lCol]?.trim();

        if (!name || !link) continue;
        // Auto-prepend https:// if protocol is missing
        if (!link.startsWith("http")) {
          link = `https://${link}`;
        }

        const normalizedUrl = link.replace(/\/$/, "").trim();
        if (seenUrls.has(normalizedUrl)) continue;
        seenUrls.add(normalizedUrl);

        const existing =
          existingToolsByUrl.get(normalizedUrl) ||
          existingToolsByName.get(name.toLowerCase());

        let working = true;
        if (wCol >= 0 && row[wCol]) {
          const w = row[wCol].toLowerCase().trim();
          working = w !== "no" && w !== "false" && w !== "0" && w !== "not working";
        } else if (existing) {
          working = existing.working;
        }

        tools.push({
          name,
          url: link.trim(),
          category: categoryId,
          description: existing?.description || generateDescription(name, categoryId),
          working,
          tags: existing?.tags || generateTags(name, categoryId),
        });
      }
    }

    if (tools.length >= 1) {
      return { tools, categories: CATEGORIES };
    }

    console.warn("Parsed too few tools from sheet, using fallback data.");
    return fallbackData as ToolsData;
  } catch (err) {
    console.warn("Google Sheet fetch error, using fallback data:", err);
    return fallbackData as ToolsData;
  }
}
