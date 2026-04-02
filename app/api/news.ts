import { fetchAPI, fetchData } from "@/utils/fetchApi";
const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
import qs from "qs";
import { unstable_noStore as noStore } from "next/cache";

export async function getHomePageData() {
  const url = new URL("/api/home-page", baseUrl);

  url.search = qs.stringify({
    populate: {
      blocks: {
        on: {
          "layout.featured-news-section": {
            populate: {
              articles: {
                populate: {
                  category: {
                    fields: ["name", "slug"],
                  },
                },
              },
            },
          },
          "layout.top-stories-section": {
            populate: {
              articles: {
                populate: {
                  category: {
                    fields: ["name", "slug"],
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  return await fetchData(url.href);
}
export async function getFeaturedNews() {
  const url = new URL("/api/articles", baseUrl);

  url.search = qs.stringify({
    filters: {
      isFeatured: {
        $eq: true,
      },
    },
    populate: {
      category: {
        fields: ["name", "slug"],
      },
      featuredImage: {
        fields: ["url", "alternativeText"],
      },
    },
    sort: ["publishedAt:desc"],
    pagination: {
      limit: 3,
    },
  });

  return await fetchData(url.href);
}

export async function getTopStories() {
  const url = new URL("/api/articles", baseUrl);

  url.search = qs.stringify({
    filters: {
      isFeatured: {
        $eq: false,
      },
      isTopStory: {
        $eq: true,
      },
    },
    populate: {
      category: {
        fields: ["name", "slug"],
      },
      featuredImage: {
        fields: ["url", "alternativeText"],
      },
    },
    sort: ["publishedAt:desc"],

    pagination: {
      limit: 2,
    },
  });

  return await fetchData(url.href);
}

export async function getNewsByCategory(categorySlug: string, limit = 4) {
  const url = new URL("/api/articles", baseUrl);

  url.search = qs.stringify({
    filters: {
      category: {
        slug: {
          $eq: categorySlug,
        },
      },
    },
    populate: {
      category: {
        fields: ["name", "slug"],
      },
      featuredImage: {
        fields: ["url", "alternativeText"],
      },
    },
    sort: ["publishedAt:desc"],
    pagination: {
      limit,
    },
  });

  return await fetchData(url.href);
}

export async function getGlobalPageData() {
  noStore();
  const url = new URL("/api/global", baseUrl);

  url.search = qs.stringify({
    populate: [
      "header.logoText",
      "header.navLink",
      "footer.logoText",
      "footer.socialLink",
    ],
  });

  return await fetchData(url.href);
}

export async function getGlobalPageMetadata() {
  const url = new URL("/api/global", baseUrl);

  url.search = qs.stringify({
    fields: ["title", "description"],
  });

  return await fetchData(url.href);
}
