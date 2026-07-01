import type { CollectionConfig } from "payload";

import { seoGroup } from "../fields/seo";
import { slugField } from "../fields/slug";

/**
 * Generic institutional pages — Conceito, Políticas, and any future
 * static page. URL: /<slug>. Áreas live in their own collection because
 * they have distinct structure (subitems, partner links).
 */
export const Pages: CollectionConfig = {
  slug: "pages",
  labels: { singular: "Página", plural: "Páginas" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "slug", "updatedAt"],
  },
  versions: {
    drafts: { autosave: { interval: 200 } },
  },
  access: {
    read: () => true,
  },
  fields: [
    { name: "title", type: "text", required: true, label: "Título" },
    slugField({ description: "URL: /<slug>. Gerado do título ao salvar." }),
    {
      name: "subtitle",
      type: "textarea",
      label: "Subtítulo",
      maxLength: 280,
    },
    {
      name: "body",
      type: "richText",
      required: true,
    },
    {
      name: "coverImage",
      type: "upload",
      relationTo: "media",
      label: "Imagem de capa",
    },
    seoGroup,
  ],
};
