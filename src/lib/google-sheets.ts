import fallbackData from "./data.json";
import type { Tool, ToolsData } from "./types";

const SHEET_ID = "14S8ykMw3VkkfeAIKH97O-ohvgJu1n2xFSXbNaftIUzE";
const SHEET_BASE_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv`;
const TOOLS_REVALIDATE_SECONDS = 3600;

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

const CATEGORIES = fallbackData.categories;

const existingToolsByUrl = new Map(
  fallbackData.tools.map((t) => [t.url.replace(/\/$/, ""), t]),
);
const existingToolsByName = new Map(
  fallbackData.tools.map((t) => [t.name.toLowerCase(), t]),
);

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

  if (currentField || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    rows.push(currentRow);
  }

  return rows;
}

function generateTags(name: string, category: string): string[] {
  const tags: string[] = [];
  const lower = name.toLowerCase();

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

export async function fetchToolsData(): Promise<ToolsData> {
  try {
    const tools: Tool[] = [];
    const seenUrls = new Set<string>();

    const results = await Promise.allSettled(
      SHEET_TABS.map(async ({ gid, categoryId }) => {
        const url = `${SHEET_BASE_URL}&gid=${gid}`;
        const res = await fetch(url, {
          next: { revalidate: TOOLS_REVALIDATE_SECONDS },
        });
        if (!res.ok) return { categoryId, rows: [] as string[][] };
        const csv = await res.text();
        return { categoryId, rows: parseCSV(csv) };
      }),
    );

    for (const result of results) {
      if (result.status !== "fulfilled") continue;
      const { categoryId, rows } = result.value;
      if (rows.length < 2) continue;

      const headerRow = rows[0];
      if (!headerRow) continue;
      const header = headerRow.map((h) => h.toLowerCase().trim());
      const toolCol = header.findIndex(
        (h) => h === "tool" || h === "tool name" || h === "name" || h === "c",
      );
      const linkCol = header.findIndex(
        (h) => h === "link" || h === "url" || h === "d",
      );
      const workingCol = header.findIndex(
        (h) => h === "working" || h === "status" || h === "w",
      );

      const nCol = toolCol >= 0 ? toolCol : 2;
      const lCol = linkCol >= 0 ? linkCol : 3;
      const wCol = workingCol >= 0 ? workingCol : -1;

      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (!row) continue;
        const name = row[nCol]?.trim();
        let link = row[lCol]?.trim();

        if (!name || !link) continue;

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
          working =
            w !== "no" && w !== "false" && w !== "0" && w !== "not working";
        } else if (existing) {
          working = existing.working;
        }

        tools.push({
          name,
          url: link.trim(),
          category: categoryId,
          description:
            existing?.description || generateDescription(name, categoryId),
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
