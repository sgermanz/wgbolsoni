# WGBolsoni multilingual website

Locales: Portuguese (original URLs), English `/en`, Spanish `/es`, French `/fr`, simplified Chinese `/zh`.

The public website detects `Accept-Language` without GPS or geolocation. An explicit URL language wins for that request; the manual selector stores the `wgb-language` preference for one year. Unsupported browser languages use English. A missing language header and crawlers use Portuguese. Admin, API and asset requests are excluded.

All current published pages, ten business sectors, eleven articles and four book synopses are translated on the server. Official book titles, names, brands, IDs, slugs, media and contact destinations are preserved. Internal links, metadata, structured data and sitemap entries follow the selected language. Dates and converter numbers use locale-specific formatting. Recorded Portuguese audio is used only in Portuguese; other locales use browser speech synthesis when supported.

Translations live in `lib/i18n/content.json` (published editorial content) and `ui.json` (interface labels and templates). The CMS Portuguese records are not modified. **New or revised editorial text needs corresponding translations in the catalog**; an unknown text remains in Portuguese instead of being fabricated or sent to an outside translation service. Update all four language columns together. Keep official titles unchanged and preserve placeholders such as `{count}`.

Rendering is request-specific to avoid cross-language cached HTML and database-offline build content. No database migration, email backend change, hosting change or credential change is included.

Checks: `node tests/i18n.cjs`, TypeScript, production build, 135 public page/locale combinations, mobile menu and language navigation. Local read-only QA may use `WGB_CONTENT_PREVIEW_PATH` with `next dev`; this mode is explicitly disabled in production and offers no CMS writes.
