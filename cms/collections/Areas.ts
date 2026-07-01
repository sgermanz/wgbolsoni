import type { CollectionConfig } from "payload";

import { seoGroup } from "../fields/seo";
import { slugField } from "../fields/slug";

export const Areas: CollectionConfig = {
  slug: "areas",
  labels: { singular: "Área de atuação", plural: "Áreas de atuação" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "tag", "order", "updatedAt"],
    description:
      "As frentes de negócio da WG Bolsoni — mostradas na home e em /areas/[slug].",
  },
  versions: {
    drafts: { autosave: { interval: 200 } },
  },
  access: {
    read: () => true,
  },
  fields: [
    { name: "title", type: "text", required: true, label: "Título" },
    slugField({
      description: "URL: /areas/<slug>. Gerado do título ao salvar (ex: meio-ambiente).",
    }),
    {
      name: "tag",
      type: "text",
      label: "Etiqueta do card",
      admin: {
        description: 'Ex: "Nova frente", "CPR Verde". Aparece no canto do card.',
        position: "sidebar",
      },
    },
    {
      name: "order",
      type: "number",
      defaultValue: 0,
      admin: {
        description: "Ordem no grid da home (menor = aparece primeiro).",
        position: "sidebar",
      },
    },
    {
      name: "short",
      type: "textarea",
      required: true,
      label: "Resumo (card)",
      maxLength: 280,
      admin: {
        description: "Frase curta exibida nos cards da home.",
      },
    },
    {
      name: "body",
      type: "richText",
      label: "Corpo da página",
      required: true,
    },
    {
      name: "coverImage",
      type: "upload",
      relationTo: "media",
      label: "Imagem de capa",
    },
    {
      name: "links",
      type: "array",
      label: "Links de parceiros",
      labels: { singular: "Link", plural: "Links" },
      admin: {
        description:
          "Links externos relacionados (ex: site do parceiro). Renderizam como botões no fim da página.",
      },
      fields: [
        { name: "label", type: "text", required: true },
        { name: "href", type: "text", required: true },
        { name: "external", type: "checkbox", defaultValue: true },
      ],
    },
    {
      name: "subitems",
      type: "array",
      label: "Subprodutos / itens internos",
      labels: { singular: "Subitem", plural: "Subitens" },
      admin: {
        description:
          "Ex.: Biomassa dentro de Florestamentos. Renderiza como bloco destacado.",
      },
      fields: [
        { name: "title", type: "text", required: true },
        { name: "body", type: "textarea", required: true },
      ],
    },
    seoGroup,
  ],
};
