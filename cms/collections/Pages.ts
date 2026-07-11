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
      admin: {
        description:
          "Foto exibida ao lado do texto (formato retrato, proporção 9:16). Deixe em branco para o texto ocupar a largura toda.",
      },
    },
    {
      name: "booksSection",
      type: "group",
      label: "Seção de livros",
      admin: {
        description:
          "Textos que aparecem acima dos cards de livros do autor no fim da página. Só é exibida se houver ao menos um livro publicado.",
        // Só aparece na página Conceito — nas outras (Políticas etc.) fica
        // escondido para não poluir o formulário.
        condition: (data) => data?.slug === "conceito",
      },
      fields: [
        {
          name: "eyebrow",
          type: "text",
          label: "Selo (texto pequeno acima do título)",
          defaultValue: "Bibliografia",
          admin: { description: "Ex.: BIBLIOGRAFIA. Deixe em branco para ocultar." },
        },
        {
          name: "heading",
          type: "text",
          label: "Título da seção",
          defaultValue: "Livros do autor",
          admin: { description: "Padrão: “Livros do autor”." },
        },
        {
          name: "intro",
          type: "textarea",
          label: "Texto de apresentação",
          defaultValue: "A bibliografia que traduz o pensamento de longo prazo em texto.",
          maxLength: 240,
          admin: { description: "Uma frase curta que introduz a bibliografia." },
        },
      ],
    },
    seoGroup,
  ],
};
