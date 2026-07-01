import type { GlobalConfig } from "payload";

export const HomeHero: GlobalConfig = {
  slug: "homeHero",
  label: "Destaque da Home (carrossel)",
  admin: {
    description:
      "Os slides do topo da página inicial. Cada slide tem textos, botões e um plano de fundo (imagem, vídeo enviado ou link do YouTube/Vimeo). Com mais de um slide, vira um carrossel automático.",
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "autoplaySeconds",
      type: "number",
      label: "Tempo de cada slide (segundos)",
      defaultValue: 6,
      min: 2,
      max: 30,
      admin: {
        description:
          "Quantos segundos cada slide fica na tela antes de passar. Só vale quando há mais de um slide.",
      },
    },
    {
      name: "slides",
      type: "array",
      label: "Slides",
      labels: { singular: "Slide", plural: "Slides" },
      minRows: 0,
      admin: {
        description:
          "Arraste para reordenar. Se ficar vazio, a home usa o destaque padrão do código.",
        initCollapsed: true,
      },
      fields: [
        {
          name: "eyebrow",
          type: "text",
          label: "Selo (texto pequeno acima do título)",
          admin: { description: 'Ex.: "Holding de participações desde 2016".' },
        },
        {
          name: "title",
          type: "textarea",
          label: "Título",
          required: true,
        },
        {
          name: "subtitle",
          type: "textarea",
          label: "Subtítulo",
        },
        {
          type: "row",
          fields: [
            {
              name: "primaryCtaLabel",
              type: "text",
              label: "Botão principal — texto",
              admin: { width: "50%" },
            },
            {
              name: "primaryCtaHref",
              type: "text",
              label: "Botão principal — link",
              admin: { width: "50%" },
            },
          ],
        },
        {
          type: "row",
          fields: [
            {
              name: "secondaryCtaLabel",
              type: "text",
              label: "Botão secundário — texto",
              admin: { width: "50%" },
            },
            {
              name: "secondaryCtaHref",
              type: "text",
              label: "Botão secundário — link",
              admin: { width: "50%" },
            },
          ],
        },
        {
          name: "background",
          type: "group",
          label: "Plano de fundo",
          fields: [
            {
              name: "type",
              type: "select",
              defaultValue: "none",
              required: true,
              options: [
                { label: "Nenhum (fundo padrão claro)", value: "none" },
                { label: "Imagem", value: "image" },
                { label: "Vídeo (enviar arquivo)", value: "video" },
                { label: "YouTube / Vimeo (link)", value: "youtube" },
              ],
            },
            {
              name: "image",
              type: "upload",
              relationTo: "media",
              label: "Imagem de fundo",
              admin: {
                condition: (_, siblingData) => siblingData?.type === "image",
              },
            },
            {
              name: "videoFile",
              type: "upload",
              relationTo: "media",
              label: "Arquivo de vídeo (mp4)",
              admin: {
                condition: (_, siblingData) => siblingData?.type === "video",
                description:
                  "O vídeo toca automaticamente, sem som e em loop, atrás do texto.",
              },
            },
            {
              name: "videoUrl",
              type: "text",
              label: "Link do YouTube ou Vimeo",
              admin: {
                condition: (_, siblingData) => siblingData?.type === "youtube",
                description:
                  "Cole a URL do vídeo. Ele toca automaticamente, sem som e em loop.",
              },
            },
            {
              name: "posterImage",
              type: "upload",
              relationTo: "media",
              label: "Imagem de espera (opcional)",
              admin: {
                condition: (_, siblingData) =>
                  siblingData?.type === "video" ||
                  siblingData?.type === "youtube",
                description:
                  "Mostrada enquanto o vídeo carrega. Recomendado para não piscar.",
              },
            },
          ],
        },
      ],
    },
  ],
};
