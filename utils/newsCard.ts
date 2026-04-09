import { getStrapiMediaURL } from "./strapiUtils";

export const mapStrapiToNewsCard = (item: any) => {
  const imageUrl =
    item.featuredImage?.url || item.featuredImage?.data?.attributes?.url;
  const categoryName =
    item.category?.name || item.category?.data?.attributes?.name;

  return {
    featuredImage:
      getStrapiMediaURL(imageUrl) ?? "https://via.placeholder.com/800x600",

    headline: item.title,
    category: categoryName || "General",
    slug: item.slug,
    description: item.excerpt || item.description || "",
    author: "Admin",

    date: item.publishedAt
      ? new Date(item.publishedAt).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "",

    chipColor: getCategoryColor(categoryName),
    documentId: item.documentId,
    id: item.id,
  };
};

const getCategoryColor = (category?: string) => {
  switch (category) {
    case "Technology":
      return "#1E3A8A";
    case "Business":
      return "#065F46";
    case "Sports":
      return "#7C2D12";
    case "Entertainment":
      return "#4C1D95";
    default:
      return "#374151";
  }
};
