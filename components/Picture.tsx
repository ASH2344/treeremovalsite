import { imageInfo } from "@/lib/images";

export default function Picture({
  name,
  sizes,
  className = "",
  priority = false,
}: {
  name: string;
  sizes: string;
  className?: string;
  priority?: boolean;
}) {
  const img = imageInfo(name);
  return (
    <img
      src={img.src}
      srcSet={img.srcSet}
      sizes={sizes}
      alt={img.alt}
      width={img.width}
      height={img.height}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding={priority ? "sync" : "async"}
      className={className}
    />
  );
}
