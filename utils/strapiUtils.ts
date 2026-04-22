export function flattenAttributes(data: any): any {
  // Return as-is if not a plain object
  if (
    typeof data !== "object" ||
    data === null ||
    data instanceof Date ||
    typeof data === "function"
  ) {
    return data;
  }

  // Handle arrays
  if (Array.isArray(data)) {
    return data.map((item) => flattenAttributes(item));
  }

  const flattened: { [key: string]: any } = {};

  for (const key in data) {
    if (!Object.prototype.hasOwnProperty.call(data, key)) continue;

    // Flatten 'attributes' or 'data' keys
    if (
      (key === "attributes" || key === "data") &&
      typeof data[key] === "object" &&
      !Array.isArray(data[key])
    ) {
      Object.assign(flattened, flattenAttributes(data[key]));
    } else {
      flattened[key] = flattenAttributes(data[key]);
    }
  }

  return flattened;
}

export function getStrapiURL() {
  const configuredUrl = process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337";
  return configuredUrl.replace(/\/api\/?$/, "");
}

export function getStrapiMediaURL(url: string | null | undefined) {
  if (!url) return null;
  if (url.startsWith("data:")) return url;
  if (url.startsWith("http") || url.startsWith("//")) return url;

  const baseUrl = getStrapiURL().replace(/\/$/, "");
  const normalizedPath = url.startsWith("/") ? url : `/${url}`;
  return `${baseUrl}${normalizedPath}`;
}
