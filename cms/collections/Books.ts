import type { CollectionConfig } from "payload";

export const Books: CollectionConfig = {
  slug: "books",
  labels: { singular: "Livro", plural: "Livros do autor" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "year", "updatedAt"],
    description: "Bibliografia do autor — usada na seção Bio.",
  },
  access: {
    read: () => true,
  },
  fields: [
    { name: "title", type: "text", required: true, label: "Título" },
    {
      name: "cover",
      type: "upload",
      relationTo: "media",
      label: "Capa",
      required: true,
    },
    {
      name: "synopsis",
      type: "textarea",
      label: "Sinopse",
      required: true,
    },
    {
      name: "year",
      type: "number",
      label: "Ano de publicação",
    },
    {
      name: "purchaseUrl",
      type: "text",
      label: "Link para compra",
      admin: {
        description: "Amazon, editora, etc.",
      },
    },
  ],
};
