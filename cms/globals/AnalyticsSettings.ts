import type { GlobalConfig } from "payload";

/** Non-secret identifiers editable in the admin. The Service Account remains in Railway. */
export const AnalyticsSettings: GlobalConfig = {
  slug: "analyticsSettings",
  label: "Analytics APIs",
  admin: { hidden: true },
  access: {
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: "ga4PropertyId", type: "text", label: "GA4 Property ID" },
    {
      name: "searchConsoleSiteUrl",
      type: "text",
      label: "URL da propriedade no Search Console",
    },
  ],
};
