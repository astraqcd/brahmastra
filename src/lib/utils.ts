import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Tool } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function getToolDescription(tool: Tool, locale: string): string {
  return tool.descriptions?.[locale] || tool.descriptions?.en || tool.description;
}

export function getLocalizedDescription(
  item: { description: string; descriptions?: Record<string, string> },
  locale: string,
): string {
  return (
    item.descriptions?.[locale] || item.descriptions?.en || item.description
  );
}
