import Image from "next/image";

import { toEmbedUrl } from "@/lib/embed";

type Media = {
  url?: string | null;
  alt?: string | null;
  width?: number | null;
  height?: number | null;
};

const isMedia = (v: unknown): v is Media =>
  typeof v === "object" && v !== null && "url" in v;

type ImageBlockFields = {
  image: Media | string | number;
  caption?: string;
  size?: "thumbnail" | "card" | "cover";
};

export function ImageBlockRenderer({ block }: { block: ImageBlockFields }) {
  if (!isMedia(block.image) || !block.image.url) return null;
  const sizes =
    block.size === "thumbnail"
      ? "(min-width: 768px) 400px, 100vw"
      : block.size === "cover"
        ? "100vw"
        : "(min-width: 768px) 768px, 100vw";
  return (
    <figure className="my-8">
      <Image
        src={block.image.url}
        alt={block.image.alt ?? ""}
        width={block.image.width ?? 1600}
        height={block.image.height ?? 900}
        sizes={sizes}
        className="rounded-2xl"
      />
      {block.caption && (
        <figcaption className="mt-2 text-center text-sm text-[var(--content-soft)]">
          {block.caption}
        </figcaption>
      )}
    </figure>
  );
}

type VideoBlockFields = {
  source: "url" | "upload";
  url?: string;
  file?: Media | string | number;
  caption?: string;
};

export function VideoBlockRenderer({ block }: { block: VideoBlockFields }) {
  if (block.source === "url" && block.url) {
    const embed = toEmbedUrl(block.url);
    if (!embed) return null;
    return (
      <figure className="my-8">
        <div className="aspect-video overflow-hidden rounded-2xl bg-black">
          <iframe
            src={embed}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={block.caption ?? "Vídeo incorporado"}
          />
        </div>
        {block.caption && (
          <figcaption className="mt-2 text-center text-sm text-[var(--content-soft)]">
            {block.caption}
          </figcaption>
        )}
      </figure>
    );
  }
  if (block.source === "upload" && isMedia(block.file) && block.file.url) {
    return (
      <figure className="my-8">
        <video
          src={block.file.url}
          controls
          className="w-full rounded-2xl bg-black"
        />
        {block.caption && (
          <figcaption className="mt-2 text-center text-sm text-[var(--content-soft)]">
            {block.caption}
          </figcaption>
        )}
      </figure>
    );
  }
  return null;
}

type GalleryBlockFields = {
  images: { image: Media | string | number; caption?: string }[];
  columns?: "2" | "3" | "4";
};

export function GalleryBlockRenderer({ block }: { block: GalleryBlockFields }) {
  if (!block.images?.length) return null;
  const cols =
    block.columns === "2"
      ? "sm:grid-cols-2"
      : block.columns === "4"
        ? "sm:grid-cols-2 lg:grid-cols-4"
        : "sm:grid-cols-2 lg:grid-cols-3";
  return (
    <div className={`my-8 grid grid-cols-1 gap-3 ${cols}`}>
      {block.images.map((item, i) => {
        if (!isMedia(item.image) || !item.image.url) return null;
        return (
          <figure key={i}>
            <Image
              src={item.image.url}
              alt={item.image.alt ?? ""}
              width={item.image.width ?? 800}
              height={item.image.height ?? 600}
              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
              className="rounded-xl"
            />
            {item.caption && (
              <figcaption className="mt-1.5 text-xs text-[var(--content-soft)]">
                {item.caption}
              </figcaption>
            )}
          </figure>
        );
      })}
    </div>
  );
}
