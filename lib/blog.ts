import "server-only";

import type { Where } from "payload";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";

import { withFallback } from "@/lib/cms";

export type PostCategory =
  | "agro"
  | "energia"
  | "meio-ambiente"
  | "industria"
  | "mercado"
  | "institucional";

export const POST_CATEGORY_LABELS: Record<PostCategory, string> = {
  agro: "Agronegócio",
  energia: "Energia",
  "meio-ambiente": "Meio Ambiente",
  industria: "Indústria",
  mercado: "Mercado",
  institucional: "Institucional",
};

export type PostAuthor = {
  id: string | number;
  name: string;
  bio?: string;
  avatarUrl?: string;
};

export type PostCover = {
  url: string;
  alt: string;
  width?: number;
  height?: number;
};

export type PostRecord = {
  id: string | number;
  slug: string;
  title: string;
  excerpt: string;
  categories?: PostCategory[];
  tags?: string[];
  publishedAt?: string;
  readingTime?: number;
  body?: SerializedEditorState;
  audioUrl?: string;
  author?: PostAuthor;
  cover?: PostCover;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: { url: string };
  };
  geo?: {
    faq?: { question: string; answer: string }[];
  };
};

type PayloadPostDoc = {
  id: string | number;
  slug: string;
  title: string;
  excerpt: string;
  categories?: PostCategory[] | null;
  tags?: { value: string }[] | null;
  publishedAt?: string | null;
  readingTime?: number | null;
  body?: SerializedEditorState | null;
  audioUrl?: string | null;
  _status?: string;
  author?: {
    id: string | number;
    name: string;
    bio?: string | null;
    avatar?: { url?: string | null } | string | number | null;
  } | string | number;
  coverImage?: {
    url?: string | null;
    alt?: string | null;
    width?: number | null;
    height?: number | null;
  } | string | number | null;
  seo?: PostRecord["seo"];
  geo?: PostRecord["geo"];
  relatedPosts?: (PayloadPostDoc | string | number)[];
};

const toPost = (doc: PayloadPostDoc): PostRecord => {
  const cover =
    typeof doc.coverImage === "object" && doc.coverImage?.url
      ? {
          url: doc.coverImage.url as string,
          alt: doc.coverImage.alt || doc.title,
          width: doc.coverImage.width ?? undefined,
          height: doc.coverImage.height ?? undefined,
        }
      : undefined;

  const author =
    typeof doc.author === "object" && doc.author
      ? {
          id: doc.author.id,
          name: doc.author.name,
          bio: doc.author.bio ?? undefined,
          avatarUrl:
            typeof doc.author.avatar === "object" && doc.author.avatar
              ? doc.author.avatar.url ?? undefined
              : undefined,
        }
      : undefined;

  return {
    id: doc.id,
    slug: doc.slug,
    title: doc.title,
    excerpt: doc.excerpt,
    categories: doc.categories ?? undefined,
    tags: doc.tags?.map((t) => t.value).filter(Boolean) ?? undefined,
    publishedAt: doc.publishedAt ?? undefined,
    readingTime: doc.readingTime ?? undefined,
    body: doc.body ?? undefined,
    audioUrl: doc.audioUrl ?? undefined,
    author,
    cover,
    seo: doc.seo ?? undefined,
    geo: doc.geo ?? undefined,
  };
};

export const POSTS_PER_PAGE = 12;

export type ListPostsArgs = {
  page?: number;
  category?: PostCategory;
  tag?: string;
};

export type PostListResult = {
  posts: PostRecord[];
  totalPages: number;
  totalDocs: number;
  page: number;
};

export async function listPosts({
  page = 1,
  category,
  tag,
}: ListPostsArgs = {}): Promise<PostListResult> {
  return withFallback(
    async (payload) => {
      const where: Where = {
        _status: { equals: "published" },
      };
      if (category) where.categories = { contains: category };
      if (tag) where["tags.value"] = { equals: tag };

      const result = await payload.find({
        collection: "posts",
        page,
        limit: POSTS_PER_PAGE,
        sort: "-publishedAt",
        depth: 1,
        where,
      });

      return {
        posts: (result.docs as unknown as PayloadPostDoc[]).map(toPost),
        totalPages: result.totalPages,
        totalDocs: result.totalDocs,
        page: result.page ?? 1,
      };
    },
    { posts: [], totalPages: 0, totalDocs: 0, page: 1 },
    "listPosts",
  );
}

export async function getPostBySlug(
  slug: string,
): Promise<PostRecord | undefined> {
  return withFallback(
    async (payload) => {
      const result = await payload.find({
        collection: "posts",
        where: {
          slug: { equals: slug },
          _status: { equals: "published" },
        },
        limit: 1,
        depth: 2,
      });
      const doc = result.docs[0] as unknown as PayloadPostDoc | undefined;
      if (!doc) throw new Error("post not found");
      return toPost(doc);
    },
    undefined,
    `getPostBySlug(${slug})`,
  );
}

export async function getRelated(
  postId: string | number,
  category?: PostCategory,
  limit = 3,
): Promise<PostRecord[]> {
  return withFallback(
    async (payload) => {
      const result = await payload.find({
        collection: "posts",
        where: {
          _status: { equals: "published" },
          id: { not_equals: postId },
          ...(category ? { categories: { contains: category } } : {}),
        },
        sort: "-publishedAt",
        limit,
        depth: 1,
      });
      return (result.docs as unknown as PayloadPostDoc[]).map(toPost);
    },
    [],
    "getRelated",
  );
}
