export interface Tool {
  name: string;
  url: string;
  category: string;
  description: string;
  descriptions?: Record<string, string>;
  working: boolean;
  tags: string[];
}

export interface Category {
  id: string;
  name: string;
  title: string;
  description: string;
  slug: string;
}

export interface ToolsData {
  tools: Tool[];
  categories: Category[];
}
