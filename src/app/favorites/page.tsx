import { fetchToolsData } from "@/lib/google-sheets";
import FavoritesClient from "./favorites-client";

export const revalidate = 60;

export default async function FavoritesPage() {
  const toolsData = await fetchToolsData();

  return <FavoritesClient toolsData={toolsData} />;
}
