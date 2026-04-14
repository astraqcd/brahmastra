export interface DarkWebForum {
  name: string;
  onionUrl: string;
  mirrorUrl?: string;
  category: DarkWebCategory;
  status: "active" | "inactive" | "seized" | "scam" | "unknown";
  language: string;
  description: string;
  registrationRequired: boolean;
  inviteOnly: boolean;
  lastChecked?: string;
  seizedBy?: string;
  tags: string[];
}

export type DarkWebCategory =
  | "forums"
  | "markets"
  | "paste-sites"
  | "search-engines"
  | "news"
  | "email"
  | "tools"
  | "whistleblowing";

export const DARKWEB_CATEGORIES: {
  id: DarkWebCategory;
  name: string;
  description: string;
}[] = [
  {
    id: "forums",
    name: "Discussion Forums",
    description: "General discussion boards and community forums",
  },
  {
    id: "markets",
    name: "Marketplaces",
    description: "Known marketplaces (active/inactive/seized)",
  },
  {
    id: "paste-sites",
    name: "Paste Sites",
    description: "Anonymous paste bins and text sharing",
  },
  {
    id: "search-engines",
    name: "Search Engines",
    description: ".onion search engines and directories",
  },
  {
    id: "news",
    name: "News & Media",
    description: "Dark web news sites and journalism platforms",
  },
  {
    id: "email",
    name: "Email Services",
    description: "Anonymous email and messaging services",
  },
  {
    id: "tools",
    name: "Privacy Tools",
    description: "Anonymity, encryption, and privacy tools",
  },
  {
    id: "whistleblowing",
    name: "Whistleblowing",
    description: "Secure whistleblowing platforms and leak sites",
  },
];

export interface DarkWebData {
  forums: DarkWebForum[];
  lastUpdated: string;
}
