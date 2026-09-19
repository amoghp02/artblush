import Image from "next/image";

interface ArtworkImageProps {
  src: string;
  alt: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
  monochrome?: boolean;
}

/**
 * Renders a remote artwork image. `monochrome` (default true) applies a
 * grayscale treatment so placeholder photography reads as graphite/charcoal
 * studies; flip it off when real artwork images arrive.
 */
export default function ArtworkImage({
  src,
  alt,
  priority = false,
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  className = "",
  monochrome = true,
}: ArtworkImageProps) {
  return (
    <Image
      src={`https://images.unsplash.com/${src}?auto=format&fit=crop&q=80`}
      alt={alt}
      fill
      priority={priority}
      sizes={sizes}
      className={`object-cover ${monochrome ? "filter grayscale contrast-[1.05] brightness-[0.98]" : ""} ${className}`}
    />
  );
}