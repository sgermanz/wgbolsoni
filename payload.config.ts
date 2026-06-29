import path from "node:path";
import { fileURLToPath } from "node:url";

import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { nodemailerAdapter } from "@payloadcms/email-nodemailer";
import { buildConfig } from "payload";
import sharp from "sharp";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

// Fallbacks deixam o `next build` rodar sem .env. Em runtime, exigimos as vars reais.
const databaseURI =
  process.env.DATABASE_URI ||
  "postgres://payload:payload@localhost:5432/payload";
const payloadSecret = process.env.PAYLOAD_SECRET || "dev-only-secret-change-me";
const serverURL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

export default buildConfig({
  serverURL,
  secret: payloadSecret,
  admin: {
    user: "users",
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: "— WG Bolsoni",
    },
  },
  editor: lexicalEditor(),
  db: postgresAdapter({
    pool: {
      connectionString: databaseURI,
    },
  }),
  sharp,
  email: process.env.SMTP_HOST
    ? nodemailerAdapter({
        defaultFromAddress:
          process.env.SMTP_FROM || "wgb@wgbolsoni.net",
        defaultFromName: process.env.SMTP_FROM_NAME || "WG Bolsoni",
        transportOptions: {
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT || 587),
          secure: process.env.SMTP_SECURE === "true",
          auth:
            process.env.SMTP_USER && process.env.SMTP_PASS
              ? {
                  user: process.env.SMTP_USER,
                  pass: process.env.SMTP_PASS,
                }
              : undefined,
        },
      })
    : undefined,
  collections: [
    {
      slug: "users",
      auth: true,
      admin: {
        useAsTitle: "email",
        defaultColumns: ["email", "role", "updatedAt"],
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
      ],
    },
    {
      slug: "media",
      upload: {
        staticDir: path.resolve(dirname, "media"),
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
        },
        {
          name: "caption",
          type: "text",
        },
        {
          name: "credit",
          type: "text",
          label: "Crédito",
        },
      ],
    },
  ],
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  graphQL: {
    schemaOutputFile: path.resolve(dirname, "schema.graphql"),
    disable: false,
  },
});
