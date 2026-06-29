import type { Block } from "payload";

/**
 * Video block accepts EITHER an uploaded file OR a YouTube/Vimeo URL.
 * The frontend renderer detects which one is set and outputs the right embed.
 */
export const VideoBlock: Block = {
  slug: "video",
  labels: { singular: "Vídeo", plural: "Vídeos" },
  fields: [
    {
      name: "source",
      type: "radio",
      defaultValue: "url",
      required: true,
      options: [
        { label: "URL (YouTube / Vimeo)", value: "url" },
        { label: "Upload (.mp4)", value: "upload" },
      ],
    },
    {
      name: "url",
      type: "text",
      label: "URL do vídeo",
      admin: {
        description: "Cole o link do YouTube ou Vimeo.",
        condition: (_, siblingData) => siblingData?.source === "url",
      },
    },
    {
      name: "file",
      type: "upload",
      relationTo: "media",
      label: "Arquivo de vídeo",
      filterOptions: { mimeType: { contains: "video" } },
      admin: {
        condition: (_, siblingData) => siblingData?.source === "upload",
      },
    },
    {
      name: "caption",
      type: "text",
      label: "Legenda",
    },
  ],
};
