import type { Metadata } from "next";
import { Sora, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { JsonLd } from "@/components/json-ld";
import { HeroThemeProvider } from "@/components/hero-theme";
import { SITE } from "@/lib/site";
import { getSiteSettings } from "@/lib/content";
import {
  buildOrganizationSchema,
  buildWebsiteSchema,
  buildLocalBusinessSchema,
} from "@/lib/schema";

// Root layout now reads Site Settings from the CMS (brand name, tagline,
// email). Without a revalidate window every route would inherit whatever
// was fetched at build time (when Postgres isn't reachable), freezing the
// navbar/footer/title on the fallback forever — same class of bug we hit
// with area cover images.
export const revalidate = 60;

// Display: Sora (geométrica corporate). Body: Inter (highly readable sans).
const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sora",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    metadataBase: new URL(SITE.url),
    title: {
      default: `${settings.name} — ${settings.tagline}`,
      template: `%s · ${settings.name}`,
    },
    description: settings.description,
    openGraph: {
      type: "website",
      locale: "pt_BR",
      siteName: settings.name,
      url: SITE.url,
      title: settings.name,
      description: settings.description,
    },
    robots: { index: true, follow: true, "max-image-preview": "large" },
    alternates: { canonical: SITE.url },
  };
}

// Script inline anti-FOUC: aplica a classe `.dark` antes do React montar,
// usando a preferência salva ou a do sistema.
const themeBootstrap = `
(function(){try{
  var k=localStorage.getItem('wgb-theme');
  var d=k?k==='dark':matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.classList.toggle('dark',d);
}catch(e){}})();
`;

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const settings = await getSiteSettings();
  const orgLd = buildOrganizationSchema(settings);
  const siteLd = buildWebsiteSchema(settings);
  const bizLd = buildLocalBusinessSchema(settings);

  return (
    <html
      lang="pt-BR"
      className={`${sora.variable} ${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <meta name="theme-color" content="#2f8049" />
        <Script id="theme-bootstrap" strategy="beforeInteractive">
          {themeBootstrap}
        </Script>
        <JsonLd data={orgLd} />
        <JsonLd data={siteLd} />
        {bizLd && <JsonLd data={bizLd} />}
      </head>
      <body className="min-h-full flex flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-lg focus:bg-brand-600 focus:px-4 focus:py-2 focus:text-white"
        >
          Pular para o conteúdo
        </a>
        <HeroThemeProvider>
          <Navbar brandName={settings.name} />
          <main id="main" className="flex-1">
            {children}
          </main>
        </HeroThemeProvider>
        <Footer
          brandName={settings.name}
          tagline={settings.tagline}
          email={settings.email}
          copyrightStart={settings.copyrightStart}
        />
      </body>
    </html>
  );
}
