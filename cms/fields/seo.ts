import type { Field } from "payload";

export const seoGroup: Field = {
  name: "seo",
  type: "group",
  label: "SEO",
  admin: {
    description:
      "Metadados que controlam como esta página aparece no Google e em redes sociais.",
  },
  fields: [
    {
      name: "metaTitle",
      type: "text",
      label: "Título (meta)",
      admin: {
        description:
          "Aparece na aba do navegador e nos resultados do Google. Ideal: 50–60 caracteres.",
      },
    },
    {
      name: "metaDescription",
      type: "textarea",
      label: "Descrição (meta)",
      admin: {
        description: "Resumo nos resultados de busca. Ideal: 140–160 caracteres.",
      },
    },
    {
      name: "ogImage",
      type: "upload",
      relationTo: "media",
      label: "Imagem para compartilhamento (OG)",
      admin: {
        description:
          "Mostrada quando o link é compartilhado em redes sociais. Recomendado: 1200×630.",
      },
    },
    {
      name: "canonical",
      type: "text",
      label: "URL canônica",
      admin: {
        description:
          "Use apenas se este conteúdo for republicação de outra página.",
      },
    },
    {
      name: "focusKeyword",
      type: "text",
      label: "Palavra-chave principal",
      admin: {
        description:
          "Termo central da matéria. Ajuda a checar consistência do conteúdo (não vira meta tag).",
      },
    },
  ],
};
