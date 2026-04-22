import { flattenAttributes } from "./strapiUtils";

const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

export async function fetchAPI(path: string) {
  const res = await fetch(`${API_URL}${path}`);
  return res.json();
}

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
    const data = await response.json();
    return flattenAttributes(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}
