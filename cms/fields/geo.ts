import type { Field } from "payload";

/**
 * GEO = Generative Engine Optimization.
 * FAQ entries feed the FAQPage JSON-LD schema, which AI engines
 * (ChatGPT/Perplexity/Gemini) and Google use to surface answers.
 */
export const geoGroup: Field = {
  name: "geo",
  type: "group",
  label: "GEO (otimização para IA)",
  admin: {
    description:
      "Perguntas frequentes que geram o schema FAQPage — ajuda buscadores e IAs a citarem o conteúdo com precisão.",
  },
  fields: [
    {
      name: "faq",
      type: "array",
      label: "Perguntas & Respostas",
      labels: { singular: "Pergunta", plural: "Perguntas" },
      fields: [
        { name: "question", type: "text", required: true, label: "Pergunta" },
        {
          name: "answer",
          type: "textarea",
          required: true,
          label: "Resposta",
          admin: {
            description:
              "Resposta direta em 1–3 frases. Evite floreios, vá ao ponto.",
          },
        },
      ],
    },
  ],
};
