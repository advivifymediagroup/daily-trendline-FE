import { flattenAttributes } from "./strapiUtils";

const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

export async function fetchAPI(path: string) {
  const res = await fetch(`${API_URL}${path}`);
  return res.json();
}

/**
 * Fetches from Strapi and flattens the response.
 *
 * Returns null instead of throwing when the CMS is unreachable or errors.
 * The root layout fetches global data, so a thrown error there would take
 * down every page on the site — including sections that don't depend on
 * Strapi at all. Callers treat null as "no content".
 */
export async function fetchData(url: string) {
  const authToken = null;

  const headers = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  };
  try {
    const response = await fetch(url, authToken ? headers : {});

    if (!response.ok) {
      console.error(`[strapi] ${response.status} for ${url}`);
      return null;
    }

    const data = await response.json();
    return flattenAttributes(data);
  } catch (error) {
    console.error("[strapi] request failed:", error);
    return null;
  }
}
