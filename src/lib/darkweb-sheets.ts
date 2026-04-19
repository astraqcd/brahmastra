import { env } from "@/env";
import type { DarkWebData, DarkWebForum } from "./darkweb-types";

const DARKWEB_SHEET_ID = env.TOOLS_SHEET_ID;
const DARKWEB_GID = env.DARKWEB_SHEET_GID;
const SHEET_BASE_URL = `https://docs.google.com/spreadsheets/d/${DARKWEB_SHEET_ID}/gviz/tq?tqx=out:csv`;
const DARKWEB_REVALIDATE_SECONDS = 3600;

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

function normalizeOnion(url: string): string {
  return url
    .replace(/^https?:\/\//i, "")
    .replace(/\/+$/, "")
    .trim()
    .toLowerCase();
}

function guessCategory(name: string): DarkWebForum["category"] {
  const lower = name.toLowerCase();
  if (
    lower.includes("search") ||
    lower.includes("index") ||
    lower.includes("torgle") ||
    lower.includes("torch")
  )
    return "search-engines";
  if (
    lower.includes("forum") ||
    lower.includes("dread") ||
    lower.includes("breach") ||
    lower.includes("chan")
  )
    return "forums";
  if (lower.includes("market") || lower.includes("eden")) return "markets";
  if (lower.includes("mail") || lower.includes("email")) return "email";
  if (lower.includes("news") || lower.includes("daily")) return "news";
  if (lower.includes("paste")) return "paste-sites";
  if (lower.includes("whistle") || lower.includes("leak"))
    return "whistleblowing";
  return "tools";
}

type Enrichment = Omit<DarkWebForum, "name" | "onionUrl">;

const ENRICHMENT_DATA: Record<string, Partial<Enrichment>> = {
  "2fd6cemt4gmccflhm6imvdfvli3nf7zn6rfrwpsy7uhxrgbypvwf5fad.onion": {
    category: "search-engines",
    status: "active",
    description:
      "Dark web search engine for discovering and indexing .onion hidden services.",
    tags: ["search", "index", "discovery"],
  },
  "tor66sewebgixwhcqfnp5inzp5x5uohhdy3kvtnyfxc2e5mxiuh34iid.onion": {
    category: "search-engines",
    status: "active",
    description:
      "Search and find .onion websites with categorized directory listings.",
    tags: ["search", "directory", "onion"],
  },
  "3bbad7fauom4d6sgppalyqddsqbf5u5p56b5k5uk2zxsy3d6ey2jobad.onion": {
    category: "search-engines",
    status: "active",
    description:
      "Comprehensive dark web search engine indexing .onion hidden services.",
    tags: ["search", "index"],
  },
  "juhanurmihxlp77nkq76byazcldy2hlmovfu2epvl5ankdibsot4csyd.onion": {
    category: "search-engines",
    status: "active",
    description:
      "Clearnet-accessible .onion search engine that filters out illegal content. Used by researchers.",
    tags: ["search", "filtered", "safe", "research"],
  },
  "tordexu73joywapk2txdr54jed4imqledpcvcuf75qsas2gwdgksvnyd.onion": {
    category: "search-engines",
    status: "active",
    description:
      "The uncensored dark net search engine with fast indexing of .onion sites.",
    tags: ["search", "uncensored", "fast"],
  },
  "iwr4usy33opfclmbyemzbmnwwnmmqpqltezpac7fyqqkdv3mabtm6kqd.onion": {
    category: "search-engines",
    status: "inactive",
    description: "Accurately fast search engine for dark web content.",
    tags: ["search", "fast"],
  },
  "searchgf7gdtauh7bhnbyed4ivxqmuoat3nm6zfrg3ymkq6mtnpye3ad.onion": {
    category: "search-engines",
    status: "active",
    description:
      "Deep web search engine for discovering hidden services and onion sites.",
    tags: ["search", "deep-web", "discovery"],
  },
  "xmh57jrknzkhv6y3ls3ubitzfqnkrwxhopf5aygthi7d6rplyvk3noyd.onion": {
    category: "search-engines",
    status: "active",
    description:
      "One of the oldest and largest Tor search engines with millions of indexed pages.",
    tags: ["search", "oldest", "large-index"],
  },
  "abikoifawyrftqivkhfxiwdjcdzybumpqrbowtudtwhrhpnykfonyzid.onion": {
    category: "search-engines",
    status: "inactive",
    description: "Tor search engine for dark web content discovery.",
    tags: ["search", "discovery"],
  },
  "torbookp6ougjm42lzt4gzki3ozprktiekhqydwavp26d5m3ewjr3fad.onion": {
    category: "search-engines",
    status: "inactive",
    description: "Index and directory of onion addresses.",
    tags: ["directory", "index", "links"],
  },
  "e27slbec2ykiyo26gfuovaehuzsydffbit5nlxid53kigw3pvz6uosqd.onion": {
    category: "search-engines",
    status: "inactive",
    description: "Fast and safe dark web search engine.",
    tags: ["search", "fast", "safe"],
  },
  "iy3544gmoeclh5de6gez2256v6pjh4omhpqdh2wpeeppjtvqmjhkfwad.onion": {
    category: "search-engines",
    status: "active",
    description: "The dark web search engine for finding .onion sites.",
    tags: ["search", "onion"],
  },
  "srcdemonm74icqjvejew6fprssuolyoc2usjdwflevbdpqoetw4x3ead.onion": {
    category: "search-engines",
    status: "inactive",
    description: "Dark web search engine for indexing .onion hidden services.",
    tags: ["search", "index"],
  },
  "xcprh4cjas33jnxgs3zhakof6mctilfxigwjcsevdfap7vtyj57lmjad.onion": {
    category: "search-engines",
    status: "active",
    description: "Global search engine for the Tor network.",
    tags: ["search", "global", "tor"],
  },
  "godeepz7g4wg2vltbjlzuf3xm2qwlbhe26gdxzq4f2t72fvvqbd4i5qd.onion": {
    category: "search-engines",
    status: "active",
    description: "Deep web search engine for Tor network content.",
    tags: ["search", "deep-web"],
  },
  "no6m4wzdexe3auiupv2zwif7rm6qwxcyhslkcnzisxgeiw6pvjsgafad.onion": {
    category: "search-engines",
    status: "inactive",
    description: "Search for hidden services on the Tor network.",
    tags: ["search", "hidden-services"],
  },
  "metagerv65pwclop2rsfzg4jwowpavpwd6grhhlvdgsswvo6ii4akgyd.onion": {
    category: "search-engines",
    status: "active",
    language: "German",
    description:
      "German privacy-focused meta search engine with Tor hidden service.",
    tags: ["search", "privacy", "german"],
  },
  "phobosxilamwcg75xt22id7aywkzol6q6rfl2flipcqoc4e4ahima5id.onion": {
    category: "search-engines",
    status: "inactive",
    description: "DarkNet search engine for .onion resources.",
    tags: ["search", "darknet"],
  },
  "haystak5njsmn2hqkewecpaxetahtwhsbsa64jom2k22z5afxhnpxfid.onion": {
    category: "search-engines",
    status: "inactive",
    description: "Dark web search engine with over 1.5 billion indexed pages.",
    tags: ["search", "large-index"],
  },
  "3fzh7yuupdfyjhwt3ugzqqof6ulbcl27ecev33knxe3u7goi3vfn2qqd.onion": {
    category: "search-engines",
    status: "active",
    description: "Onion search server for dark web content.",
    tags: ["search", "server", "index"],
  },
  "zb2jtkhnbvhkya3d46twv3g7lkobi4s62tjffqmafjibixk6pmq75did.onion": {
    category: "search-engines",
    status: "active",
    description: "Darknet search engine for .onion sites.",
    tags: ["search", "darknet", "discovery"],
  },
  "digdig2nugjpszzmqe5ep2bk7lqfpdlyrkojsx2j6kzalnrqtwedr3id.onion": {
    category: "search-engines",
    status: "active",
    description: "AI-powered dark web search and discovery engine.",
    tags: ["search", "ai", "discovery"],
  },
  "hq356ajfv7ro7ntkhaxsnw2czd5cjghg2nntz7gzz4p2vvweockrawid.onion": {
    category: "search-engines",
    status: "active",
    description: "Wiki-style directory of darknet links.",
    tags: ["directory", "wiki", "links"],
  },

  "dreadytofatroptsdj6io7l3xptbet6onoyno2yv7jicoxknyazubrad.onion": {
    category: "forums",
    status: "active",
    description:
      "Reddit-like forum for dark web discussions. Largest active dark web forum.",
    registrationRequired: true,
    tags: ["community", "reviews", "discussion"],
  },
  "darkfoxaqhfpxkrbt7vxns2z2u2k72sgmqbzeorupaiottw3ecm2wgyd.onion": {
    category: "forums",
    status: "active",
    mirrorUrl: "https://darkforums.ac/",
    description: "Active dark web discussion forum.",
    registrationRequired: true,
    tags: ["forum", "discussion"],
  },
  "tenebrispoyfrcup4k24lciwrh4gc5735hmld4dweq7his7zh423opqd.onion": {
    category: "forums",
    status: "active",
    description: "Chat forum similar to Dread.",
    registrationRequired: true,
    tags: ["forum", "chat"],
  },
  "pitchzzzoot5i4cpsblu2d5poifsyixo5r4litxkukstre5lrbjakxid.onion": {
    category: "forums",
    status: "active",
    description: "Dark web discussion forum.",
    registrationRequired: true,
    tags: ["forum", "community"],
  },
  "cebulka7uxchnbpvmqapg5pfos4ngaxglsktzvha7a5rigndghvadeyd.onion": {
    category: "forums",
    status: "active",
    language: "Polish",
    description: "Polish-language dark web forum.",
    registrationRequired: true,
    tags: ["forum", "polish"],
  },
  "germania7zs27fu3gi76wlr5rd64cc2yjexyzvrbm4jufk7pibrpizad.onion": {
    category: "forums",
    status: "active",
    language: "German",
    description: "German-language dark web forum.",
    registrationRequired: true,
    tags: ["forum", "german"],
  },
  "pfpmd7dd5ijt4add2sfi4djsaij4u3ebvnwvyvuj6aeipe2f5llptkid.onion": {
    category: "forums",
    status: "active",
    language: "Russian",
    description: "Russian-language dark web chat forum.",
    registrationRequired: true,
    tags: ["forum", "russian"],
  },
  "dumpliwoard5qsrrsroni7bdiishealhky4snigbzfmzcquwo3kml4id.onion": {
    category: "forums",
    status: "active",
    description: "Dark web forum for anonymous posting.",
    tags: ["forum", "anonymous"],
  },
  "sinobi6ftrg27d6g4sjdt65malds6cfptlnjyw52rskakqjda6uvb7yd.onion": {
    category: "forums",
    status: "active",
    description: "Dark web data leaks and intelligence platform.",
    tags: ["leaks", "intelligence"],
  },
  "7aqabivkwmpvjkyefonf3gpy5gsubopqni7kcirsrq3pflckxq5zz4id.onion": {
    category: "forums",
    status: "active",
    description: "Ransomware group leak site.",
    tags: ["leaks", "ransomware"],
  },
  "breach5yz2b5lepmq4gaqwcon3jippw3bislhvvdavem5git55sy2nid.onion": {
    category: "forums",
    status: "inactive",
    description: "Major dark web forum for data breach discussions.",
    registrationRequired: true,
    tags: ["breach", "data"],
  },
  "trashbakket2sfmaqwmvv57dfnmacugvuhwxtxaehcma6ladugfe2cyd.onion": {
    category: "forums",
    status: "active",
    description: "Public database dump and anonymous discussion board.",
    tags: ["dumps", "anonymous"],
  },

  "dacfvdnmq74nony36wvm7iofmj4jedbhexfsclmrzajn5guuqafibbqd.onion": {
    category: "news",
    status: "active",
    description: "Dark web news and information portal.",
    tags: ["news", "portal"],
  },
  "dailydwusclfsu7fzwydc5emidexnesmdlzqmz2dxnx5x4thl42vj4qd.onion": {
    category: "news",
    status: "active",
    description: "Daily dark web monitoring and news.",
    tags: ["news", "monitoring", "daily"],
  },

  "csmail3thcskmzvjicww3qdkvrhb6pb5s7zjqtb3gdst6guby2stsiqd.onion": {
    category: "email",
    status: "active",
    description: "Temporary anonymous email service via Tor.",
    tags: ["email", "temporary", "anonymous"],
  },

  "lldan5gahapx5k7iafb3s4ikijc4ni7gx5iywdflkba5y2ezyg6sjgyd.onion": {
    category: "tools",
    status: "active",
    description: "Anonymously share files and chat using Tor.",
    tags: ["file-sharing", "privacy"],
  },
  "vkp7367tcjpqdwwckigrdrvmwvispvbpg5rlsr2chjxvppfg7hipagyd.onion": {
    category: "tools",
    status: "active",
    description: "Mirror of mobile security resources.",
    tags: ["security", "mobile"],
  },

  "eden666otrbusyiopuvynvvdbzay2pqgsru6fymjlnukmizum4hewwad.onion": {
    category: "markets",
    status: "active",
    description: "Active dark web marketplace.",
    registrationRequired: true,
    tags: ["marketplace"],
  },
  "darkmatw7mquneteor3hj2k72v5xvyj7t7q2pszbdbrmsqtr6naizfid.onion": {
    category: "markets",
    status: "active",
    description: "Dark web marketplace service.",
    registrationRequired: true,
    tags: ["marketplace"],
  },
};

export async function fetchDarkWebData(): Promise<DarkWebData> {
  try {
    const url = `${SHEET_BASE_URL}&gid=${DARKWEB_GID}`;
    const res = await fetch(url, {
      next: { revalidate: DARKWEB_REVALIDATE_SECONDS },
    });

    if (!res.ok) {
      throw new Error(`Sheet fetch failed: ${res.status}`);
    }

    const csv = await res.text();
    const rows = parseCSV(csv);

    if (rows.length < 2) {
      throw new Error("Sheet has no data rows");
    }

    const headerRow = rows[0];
    if (!headerRow) {
      throw new Error("Sheet header row missing");
    }
    const header = headerRow.map((h) => h.toLowerCase().trim());
    const nameCol = header.findIndex(
      (h) =>
        h === "name" || h === "tool" || h === "tool name" || h === "forum name",
    );
    const linkCol = header.findIndex(
      (h) => h === "link" || h === "url" || h === "onion url",
    );

    const descriptionCols: { locale: string; col: number }[] = [];
    header.forEach((h, idx) => {
      const match = h.match(/^description[-_](.+)$/);
      if (match?.[1]) {
        descriptionCols.push({ locale: match[1].trim(), col: idx });
      }
    });

    const nCol = nameCol >= 0 ? nameCol : 2;
    const lCol = linkCol >= 0 ? linkCol : 3;

    const forums: DarkWebForum[] = [];
    const seenUrls = new Set<string>();

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (!row) continue;
      const rawName = row[nCol]?.trim();
      const rawLink = row[lCol]?.trim();

      if (!rawLink) continue;

      const normalized = normalizeOnion(rawLink);
      if (seenUrls.has(normalized)) continue;
      seenUrls.add(normalized);

      const name = rawName || normalized.replace(/\.onion$/, "");

      const enrichment = ENRICHMENT_DATA[normalized] ?? {};

      const descriptions: Record<string, string> = {};
      for (const { locale, col } of descriptionCols) {
        const value = row[col]?.trim();
        if (value) descriptions[locale] = value;
      }

      const description =
        descriptions.en ||
        Object.values(descriptions)[0] ||
        enrichment.description ||
        `${name} — dark web resource.`;

      forums.push({
        name,
        onionUrl: normalized,
        mirrorUrl: enrichment.mirrorUrl,
        category: enrichment.category ?? guessCategory(name),
        status: enrichment.status ?? "unknown",
        language: enrichment.language ?? "English",
        description,
        descriptions:
          Object.keys(descriptions).length > 0 ? descriptions : undefined,
        registrationRequired: enrichment.registrationRequired ?? false,
        inviteOnly: enrichment.inviteOnly ?? false,
        tags: enrichment.tags ?? [],
      });
    }

    if (forums.length >= 1) {
      return { forums, lastUpdated: new Date().toISOString() };
    }

    throw new Error("No forums parsed from sheet");
  } catch (err) {
    console.warn("Dark web sheet fetch error:", err);
    return { forums: [], lastUpdated: new Date().toISOString() };
  }
}
