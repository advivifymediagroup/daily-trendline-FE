import { fetchData } from "@/utils/fetchApi";
import qs from "qs";
import { unstable_noStore as noStore } from "next/cache";

const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;

/** Shape callers expect from Strapi list endpoints when there is no data. */
const EMPTY_LIST = { data: [] as any[] };

/**
 * Builds a Strapi URL, or returns null when NEXT_PUBLIC_STRAPI_URL is unset
 * or malformed. Without this guard `new URL(path, undefined)` throws
 * "Invalid URL", which in the root layout breaks every page on the site.
 */
function strapiUrl(path: string, query?: unknown): string | null {
  if (!baseUrl) return null;

  try {
    const url = new URL(path, baseUrl);
    if (query) url.search = qs.stringify(query);
    return url.href;
  } catch {
    console.error(`[strapi] invalid NEXT_PUBLIC_STRAPI_URL: ${baseUrl}`);
    return null;
  }
}

export async function getTickerNews() {
  const href = strapiUrl("/api/articles", {
    filters: {
      isTickerNews: {
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
      limit: 4,
    },
  });

  if (!href) return EMPTY_LIST;
  return (await fetchData(href)) ?? EMPTY_LIST;
}

export async function getHomePageData() {
  const href = strapiUrl("/api/home-page", {
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

  if (!href) return EMPTY_LIST;
  return (await fetchData(href)) ?? EMPTY_LIST;
}
export async function getFeaturedNews() {
  const href = strapiUrl("/api/articles", {
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
      author: {
        fields: ["name"],
        populate: {
          avatar: {
            fields: ["url", "alternativeText"],
          },
        },
      },
    },
    sort: ["publishedAt:desc"],
    pagination: {
      limit: 3,
    },
  });

  if (!href) return EMPTY_LIST;
  return (await fetchData(href)) ?? EMPTY_LIST;
}

export async function getArticleById(documentId: string, id: string | number) {
  const href = strapiUrl("/api/articles", {
    filters: {
      $or: [
        {
          id: {
            $eq: id,
          },
        },
        {
          documentId: {
            $eq: documentId,
          },
        },
      ],
    },
    populate: {
      category: {
        fields: ["name", "slug"],
      },
      featuredImage: {
        fields: ["url", "alternativeText"],
      },
      author: {
        fields: ["name"],
        populate: {
          avatar: {
            fields: ["url", "alternativeText"],
          },
        },
      },
    },
  });

  const data = href ? await fetchData(href) : null;
  return data?.data?.[0] || null;
}

export async function getArticleBySlug(slug: string) {
  const href = strapiUrl("/api/articles", {
    filters: {
      slug: {
        $eq: slug,
      },
    },
    populate: {
      category: {
        fields: ["name", "slug"],
      },
      featuredImage: {
        fields: ["url", "alternativeText"],
      },
      author: {
        fields: ["name"],
        populate: {
          avatar: {
            fields: ["url", "alternativeText"],
          },
        },
      },
    },
    pagination: {
      limit: 1,
    },
  });

  const data = href ? await fetchData(href) : null;
  return data?.data?.[0] || null;
}

export async function getTopStories() {
  const href = strapiUrl("/api/articles", {
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
      author: {
        fields: ["name"],
        populate: {
          avatar: {
            fields: ["url", "alternativeText"],
          },
        },
      },
    },
    sort: ["publishedAt:desc"],

    pagination: {
      limit: 2,
    },
  });

  if (!href) return EMPTY_LIST;
  return (await fetchData(href)) ?? EMPTY_LIST;
}

export async function getNewsByCategory(categorySlug: string, limit = 4) {
  const href = strapiUrl("/api/articles", {
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

  if (!href) return EMPTY_LIST;
  return (await fetchData(href)) ?? EMPTY_LIST;
}

export async function getCategoryBySlug(categorySlug: string) {
  const href = strapiUrl("/api/categories", {
    filters: {
      slug: {
        $eq: categorySlug,
      },
    },
    fields: ["name", "slug"],
    pagination: {
      limit: 1,
    },
  });

  const data = href ? await fetchData(href) : null;
  return data?.data?.[0] || null;
}

export async function getPopularTags(limit = 20) {
  const href = strapiUrl("/api/tags", {
    fields: ["name", "slug"],
    sort: ["name:asc"],
    pagination: {
      limit,
    },
  });

  const data = href ? await fetchData(href) : null;
  return data?.data || [];
}

export async function getTagBySlug(tagSlug: string) {
  const href = strapiUrl("/api/tags", {
    filters: {
      slug: {
        $eq: tagSlug,
      },
    },
    fields: ["name", "slug"],
    pagination: {
      limit: 1,
    },
  });

  const data = href ? await fetchData(href) : null;
  return data?.data?.[0] || null;
}

export async function getNewsByTag(tagSlug: string, limit = 20) {
  const href = strapiUrl("/api/articles", {
    filters: {
      tags: {
        slug: {
          $eq: tagSlug,
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
      tags: {
        fields: ["name", "slug"],
      },
    },
    sort: ["publishedAt:desc"],
    pagination: {
      limit,
    },
  });

  if (!href) return EMPTY_LIST;
  return (await fetchData(href)) ?? EMPTY_LIST;
}

export async function getSearchedArticles(query: string, limit = 20) {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return { data: [] };
  }

  const href = strapiUrl("/api/articles", {
    filters: {
      $or: [
        {
          title: {
            $containsi: trimmedQuery,
          },
        },
        {
          description: {
            $containsi: trimmedQuery,
          },
        },
        {
          excerpt: {
            $containsi: trimmedQuery,
          },
        },
        {
          category: {
            name: {
              $containsi: trimmedQuery,
            },
          },
        },
      ],
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

  if (!href) return EMPTY_LIST;
  return (await fetchData(href)) ?? EMPTY_LIST;
}

export async function getPageData(slug: string) {
  const href = strapiUrl(`/api/pages`, {
    filters: {
      slug: {
        $eq: slug,
      },
    },
    populate: {
      blocks: {
        populate: "*",
      },
    },
  });

  const data = href ? await fetchData(href) : null;
  return data?.data?.[0];
}

export async function getGlobalPageData() {
  noStore();
  const href = strapiUrl("/api/global", {
    populate: {
      header: {
        populate: {
          logoText: true,
          navLink: true,
          logo: {
            fields: ["url", "alternativeText", "width", "height"],
          },
        },
      },
      footer: {
        populate: {
          logoText: true,
          socialLink: true,
          footerSection: {
            populate: ["footerLink"],
          },
        },
      },
    },
  });

  if (!href) return null;
  return await fetchData(href);
}

export async function getGlobalPageMetadata() {
  const href = strapiUrl("/api/global", {
    fields: ["title", "description"],
  });

  if (!href) return null;
  return await fetchData(href);
}
