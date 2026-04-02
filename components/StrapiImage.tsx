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

  const isLocalStrapi =
    imageUrl.includes("localhost") || imageUrl.includes("127.0.0.1");

  return (
    <Image
      src={imageUrl}
      alt={alt ?? "No alternative text provided"}
      className={className}
      unoptimized={isLocalStrapi}
      {...rest}
    />
  );
}
