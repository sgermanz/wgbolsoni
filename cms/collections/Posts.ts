import type { CollectionConfig } from "payload";
import {
  BlocksFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  lexicalEditor,
  LinkFeature,
} from "@payloadcms/richtext-lexical";

import { seoGroup } from "../fields/seo";
import { geoGroup } from "../fields/geo";
import { slugField } from "../fields/slug";
import { ImageBlock } from "../blocks/ImageBlock";
import { GalleryBlock } from "../blocks/GalleryBlock";
import { VideoBlock } from "../blocks/VideoBlock";

export const Posts: CollectionConfig = {
  slug: "posts",
  labels: { singular: "Matéria", plural: "Blog" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "status", "publishedAt", "updatedAt"],
    description:
      "Matérias do blog. Use rascunho enquanto edita; publique ou agende quando estiver pronto.",
  },
  versions: {
    drafts: {
      autosave: { interval: 200 },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
  access: {
    read: ({ req }) => {
      if (req.user) return true;
      return {
        _status: { equals: "published" },
      };
    },
  },
  fields: [
    { name: "title", type: "text", required: true, label: "Título" },
    slugField({ description: "URL: /blog/<slug>. Gerado do título ao salvar." }),
    {
      name: "excerpt",
      type: "textarea",
      required: true,
      maxLength: 280,
      label: "Resumo (chamada)",
      admin: {
        description: "Frase exibida na listagem e como meta description default.",
      },
    },
    {
      name: "coverImage",
      type: "upload",
      relationTo: "media",
      label: "Imagem de capa",
    },
    {
      name: "body",
      type: "richText",
      required: true,
      label: "Conteúdo da matéria",
      admin: {
        description:
          "Escreva aqui. Use o botão + para inserir imagem, galeria ou vídeo (YouTube/Vimeo ou upload) no meio do texto.",
      },
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          HeadingFeature({ enabledHeadingSizes: ["h2", "h3", "h4"] }),
          LinkFeature({ enabledCollections: ["pages", "posts", "areas"] }),
          HorizontalRuleFeature(),
          BlocksFeature({
            blocks: [ImageBlock, GalleryBlock, VideoBlock],
          }),
        ],
      }),
    },
    {
      name: "author",
      type: "relationship",
      relationTo: "users",
      required: true,
      label: "Autor",
    },
    {
      name: "categories",
      type: "select",
      hasMany: true,
      label: "Categorias",
      options: [
        { label: "Agronegócio", value: "agro" },
        { label: "Energia", value: "energia" },
        { label: "Meio Ambiente", value: "meio-ambiente" },
        { label: "Indústria", value: "industria" },
        { label: "Mercado", value: "mercado" },
        { label: "Institucional", value: "institucional" },
      ],
    },
    {
      name: "tags",
      type: "array",
      label: "Tags",
      labels: { singular: "Tag", plural: "Tags" },
      fields: [{ name: "value", type: "text", required: true }],
    },
    {
      name: "readingTime",
      type: "number",
      label: "Tempo de leitura (min)",
      admin: {
        readOnly: true,
        description: "Calculado automaticamente.",
        position: "sidebar",
      },
    },
    {
      name: "publishedAt",
      type: "date",
      label: "Publicar em",
      admin: {
        date: { pickerAppearance: "dayAndTime" },
        position: "sidebar",
        description:
          "Defina uma data futura para agendar a publicação automática.",
      },
    },
    {
      name: "audioUrl",
      type: "text",
      label: "URL do áudio (TTS premium)",
      admin: {
        description:
          'Deixe vazio para usar a voz nativa do navegador (botão "Ouvir matéria").',
        position: "sidebar",
      },
    },
    {
      name: "relatedPosts",
      type: "relationship",
      relationTo: "posts",
      hasMany: true,
      label: "Matérias relacionadas",
      filterOptions: ({ id }) => ({ id: { not_equals: id } }),
    },
    seoGroup,
    geoGroup,
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        const blockBased = data?.body?.root;
        if (!blockBased) return data;
        // Rough reading-time estimate: count text nodes recursively.
        let chars = 0;
        const walk = (node: { text?: string; children?: unknown[] }) => {
          if (typeof node?.text === "string") chars += node.text.length;
          if (Array.isArray(node?.children)) {
            for (const c of node.children) walk(c as never);
          }
        };
        walk(data.body.root);
        const words = chars / 5;
        const minutes = Math.max(1, Math.round(words / 220));
        return { ...data, readingTime: minutes };
      },
    ],
  },
};
