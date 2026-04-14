import FavoritesClient from "./favorites-client";

export const revalidate = 3600;

export default async function FavoritesPage() {
  return <FavoritesClient />;
}
