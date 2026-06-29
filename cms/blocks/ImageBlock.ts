import type { Block } from "payload";

export const ImageBlock: Block = {
  slug: "image",
  labels: { singular: "Imagem", plural: "Imagens" },
  fields: [
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      required: true,
    },
    {
      name: "caption",
      type: "text",
      label: "Legenda",
    },
    {
      name: "size",
      type: "select",
      defaultValue: "card",
      options: [
        { label: "Pequena", value: "thumbnail" },
        { label: "Padrão", value: "card" },
        { label: "Larga (full width)", value: "cover" },
      ],
    },
  ],
};
