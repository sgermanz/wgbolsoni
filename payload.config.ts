import path from "node:path";
import { fileURLToPath } from "node:url";

import { postgresAdapter } from "@payloadcms/db-postgres";
import {
  AlignFeature,
  FixedToolbarFeature,
  IndentFeature,
  lexicalEditor,
} from "@payloadcms/richtext-lexical";
import { nodemailerAdapter } from "@payloadcms/email-nodemailer";
import { buildConfig } from "payload";
import sharp from "sharp";

import { Users } from "./cms/collections/Users";
import { Media } from "./cms/collections/Media";
import { Areas } from "./cms/collections/Areas";
import { Pages } from "./cms/collections/Pages";
import { Posts } from "./cms/collections/Posts";
import { Books } from "./cms/collections/Books";
import { ContactMessages } from "./cms/collections/ContactMessages";
import { SiteSettings } from "./cms/globals/SiteSettings";
import { HomeHero } from "./cms/globals/HomeHero";
import { AnalyticsSettings } from "./cms/globals/AnalyticsSettings";
import { seed } from "./cms/seed";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

// Fallbacks let `next build` succeed without .env. Runtime requires real values.
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
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: { titleSuffix: "— WG Bolsoni" },
    components: {
      beforeDashboard: ["@/cms/components/DashboardAnalytics#default"],
      views: {
        analytics: {
          Component: "@/cms/views/AnalyticsView#default",
          path: "/analytics",
        },
      },
      afterNavLinks: [
        "@/cms/components/AnalyticsNavLink#default",
        "@/cms/components/NavActiveHighlight#default",
      ],
      graphics: {
        Logo: "@/cms/components/AdminLogo#default",
      },
    },
  },
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures,
      FixedToolbarFeature(),
      AlignFeature(),
      IndentFeature(),
    ],
  }),
  db: postgresAdapter({
    pool: { connectionString: databaseURI },
    // Schema is defined in `cms/collections/*` and synced automatically.
    // Disable later by committing migration files and running `payload migrate`.
    push: true,
  }),
  sharp,
  email: process.env.SMTP_HOST
    ? nodemailerAdapter({
        defaultFromAddress: process.env.SMTP_FROM || "wgb@wgbolsoni.net",
        defaultFromName: process.env.SMTP_FROM_NAME || "WG Bolsoni",
        transportOptions: {
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT || 587),
          secure: process.env.SMTP_SECURE === "true",
          auth:
            process.env.SMTP_USER && process.env.SMTP_PASS
              ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
              : undefined,
        },
      })
    : undefined,
  collections: [
    Users,
    Media,
    Areas,
    Pages,
    Posts,
    Books,
    ContactMessages,
  ],
  globals: [SiteSettings, HomeHero, AnalyticsSettings],
  onInit: async (payload) => {
    if (process.env.PAYLOAD_DISABLE_SEED === "true") return;
    try {
      await seed(payload);
    } catch (error) {
      payload.logger.warn(`[seed] failed: ${(error as Error).message}`);
    }
  },
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  graphQL: {
    schemaOutputFile: path.resolve(dirname, "schema.graphql"),
    disable: false,
  },
});
