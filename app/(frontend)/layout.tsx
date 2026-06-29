import type { Metadata } from "next";
import { Sora, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { SITE } from "@/lib/site";

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

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: SITE.name,
    url: SITE.url,
    title: SITE.name,
    description: SITE.description,
  },
  robots: { index: true, follow: true, "max-image-preview": "large" },
  alternates: { canonical: SITE.url },
};

// Script inline anti-FOUC: aplica a classe `.dark` antes do React montar,
// usando a preferência salva ou a do sistema.
const themeBootstrap = `
(function(){try{
  var k=localStorage.getItem('wgb-theme');
  var d=k?k==='dark':matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.classList.toggle('dark',d);
}catch(e){}})();
`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
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
      </head>
      <body className="min-h-full flex flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-lg focus:bg-brand-600 focus:px-4 focus:py-2 focus:text-white"
        >
          Pular para o conteúdo
        </a>
        <Navbar />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
