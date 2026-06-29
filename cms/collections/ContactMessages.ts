import type { CollectionConfig } from "payload";

export const ContactMessages: CollectionConfig = {
  slug: "contactMessages",
  labels: { singular: "Mensagem", plural: "Mensagens de contato" },
  admin: {
    useAsTitle: "subject",
    defaultColumns: ["name", "email", "subject", "status", "createdAt"],
    description:
      "Mensagens recebidas pelo formulário de contato. Marque como respondida quando der retorno.",
  },
  access: {
    // Public can create (form submit). Only admins read/update.
    create: () => true,
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => req.user?.role === "admin",
  },
  fields: [
    { name: "name", type: "text", required: true, label: "Nome" },
    { name: "email", type: "email", required: true },
    { name: "phone", type: "text", label: "Telefone" },
    { name: "subject", type: "text", required: true, label: "Assunto" },
    { name: "message", type: "textarea", required: true, label: "Mensagem" },
    {
      name: "status",
      type: "select",
      defaultValue: "new",
      options: [
        { label: "Nova", value: "new" },
        { label: "Lida", value: "read" },
        { label: "Respondida", value: "replied" },
        { label: "Spam", value: "spam" },
      ],
      admin: { position: "sidebar" },
    },
    {
      name: "origin",
      type: "text",
      label: "Origem",
      admin: {
        description: "Ex.: /contato, /blog/<slug>",
        readOnly: true,
      },
    },
    {
      name: "ipAddress",
      type: "text",
      admin: { readOnly: true, position: "sidebar" },
    },
  ],
};
