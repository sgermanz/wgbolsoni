import type { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  admin: {
    useAsTitle: "email",
    defaultColumns: ["email", "name", "role", "updatedAt"],
  },
  access: {
    admin: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "role",
      type: "select",
      required: true,
      defaultValue: "editor",
      options: [
        { label: "Admin", value: "admin" },
        { label: "Editor", value: "editor" },
      ],
    },
    {
      name: "bio",
      type: "textarea",
      label: "Bio curta",
      admin: {
        description: "Aparece como assinatura nas matérias do blog.",
      },
    },
    {
      name: "avatar",
      type: "upload",
      relationTo: "media",
      label: "Foto",
    },
  ],
};
