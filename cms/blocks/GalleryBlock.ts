import type { Block } from "payload";

export const GalleryBlock: Block = {
  slug: "gallery",
  labels: { singular: "Galeria", plural: "Galerias" },
  fields: [
    {
      name: "images",
      type: "array",
      minRows: 2,
      maxRows: 12,
      fields: [
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          required: true,
        },
        { name: "caption", type: "text", label: "Legenda" },
      ],
    },
    {
      name: "columns",
      type: "select",
      defaultValue: "3",
      options: [
        { label: "2 colunas", value: "2" },
        { label: "3 colunas", value: "3" },
        { label: "4 colunas", value: "4" },
      ],
    },
  ],
};
