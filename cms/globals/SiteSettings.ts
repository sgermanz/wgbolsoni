import type { GlobalConfig } from "payload";

export const SiteSettings: GlobalConfig = {
  slug: "siteSettings",
  label: "Configurações do site",
  admin: {
    description:
      "Identidade da marca, contato, redes sociais e itens do menu. Tudo aqui é renderizado no header/footer e nos schemas SEO/LocalBusiness.",
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Marca",
          fields: [
            { name: "name", type: "text", required: true, defaultValue: "WG Bolsoni" },
            {
              name: "legalName",
              type: "text",
              defaultValue: "WG Bolsoni Participações",
            },
            { name: "tagline", type: "textarea" },
            { name: "description", type: "textarea" },
            {
              name: "logo",
              type: "upload",
              relationTo: "media",
              label: "Logo (claro)",
            },
            {
              name: "logoDark",
              type: "upload",
              relationTo: "media",
              label: "Logo (escuro)",
            },
            {
              name: "copyrightStart",
              type: "number",
              defaultValue: 2016,
            },
          ],
        },
        {
          label: "Contato",
          fields: [
            {
              name: "email",
              type: "email",
              required: true,
              defaultValue: "wgb@wgbolsoni.net",
            },
            { name: "phone", type: "text", label: "Telefone" },
            { name: "whatsapp", type: "text", label: "WhatsApp" },
            {
              name: "address",
              type: "group",
              label: "Endereço (LocalBusiness schema)",
              fields: [
                { name: "streetAddress", type: "text" },
                { name: "addressLocality", type: "text", label: "Cidade" },
                { name: "addressRegion", type: "text", label: "UF" },
                { name: "postalCode", type: "text", label: "CEP" },
                {
                  name: "addressCountry",
                  type: "text",
                  defaultValue: "BR",
                },
                { name: "latitude", type: "number" },
                { name: "longitude", type: "number" },
              ],
            },
          ],
        },
        {
          label: "Menu",
          fields: [
            {
              name: "navTop",
              type: "array",
              label: "Itens do menu superior",
              labels: { singular: "Item", plural: "Itens" },
              fields: [
                { name: "label", type: "text", required: true },
                { name: "href", type: "text", required: true },
              ],
            },
          ],
        },
        {
          label: "Redes sociais",
          fields: [
            {
              name: "social",
              type: "array",
              labels: { singular: "Rede", plural: "Redes" },
              fields: [
                {
                  name: "platform",
                  type: "select",
                  required: true,
                  options: [
                    { label: "Instagram", value: "instagram" },
                    { label: "LinkedIn", value: "linkedin" },
                    { label: "YouTube", value: "youtube" },
                    { label: "X / Twitter", value: "x" },
                    { label: "Facebook", value: "facebook" },
                  ],
                },
                { name: "url", type: "text", required: true },
              ],
            },
          ],
        },
      ],
    },
  ],
};
