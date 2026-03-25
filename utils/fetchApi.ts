const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

export async function fetchAPI(path: string) {
  const res = await fetch(`${API_URL}${path}`);
  return res.json();
}
