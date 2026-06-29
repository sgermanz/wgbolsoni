import type { CollectionConfig } from "payload";
import path from "node:path";

export const Media: CollectionConfig = {
  slug: "media",
  upload: {
    staticDir: path.resolve(process.cwd(), "media"),
    imageSizes: [
      { name: "thumbnail", width: 400, height: 300, position: "centre" },
      { name: "card", width: 768, height: 512, position: "centre" },
      { name: "cover", width: 1600, height: 900, position: "centre" },
    ],
    adminThumbnail: "thumbnail",
    mimeTypes: ["image/*", "video/*"],
  },
  admin: {
    useAsTitle: "filename",
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
      label: "Texto alternativo",
      admin: {
        description:
          "Descreve a imagem para leitores de tela e quando ela falha em carregar.",
      },
    },
    { name: "caption", type: "text", label: "Legenda" },
    { name: "credit", type: "text", label: "Crédito" },
  ],
};
