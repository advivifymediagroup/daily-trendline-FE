import { getStrapiMediaURL } from "@/utils/strapiUtils";
import Image from "next/image";

interface IStrapiMediaProps {
  src: string;
  alt: string | null;
  height?: number;
  width?: number;
  className?: string;
  fill?: boolean;
  priority?: boolean;
}

export function getStrapiMedia(url: string | null) {
  return getStrapiMediaURL(url);
}

export function StrapiImage({
  src,
  alt,
  className,
  ...rest
}: Readonly<IStrapiMediaProps>) {
  const imageUrl = getStrapiMedia(src);

  if (!imageUrl) return null;

  // Cloudinary is now the supported production image provider.
  const isCloudinaryImage = imageUrl.startsWith("https://res.cloudinary.com/");

  // Local Strapi images are useful during local development.
  const isLocalStrapi =
    imageUrl.includes("localhost") || imageUrl.includes("127.0.0.1");
  const isOldRenderImage = imageUrl.startsWith(
    "https://daily-trendline-strapi-backend.onrender.com/uploads/",
  );

  if (isOldRenderImage) {
    return (
      <Image
        src="/fallback.jpg"
        alt={alt ?? "No image available"}
        className={className}
        {...rest}
      />
    );
  }

  return (
    <Image
      src={imageUrl}
      alt={alt ?? "No alternative text provided"}
      className={className}
      unoptimized={isLocalStrapi || isCloudinaryImage}
      {...rest}
    />
  );
}
