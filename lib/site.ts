// Configuração institucional da WG Bolsoni — usada por SEO, footer, JSON-LD.

export const SITE = {
  name: "WG Bolsoni",
  legalName: "WG Bolsoni Participações",
  tagline:
    "Holding de participações em agronegócio, energia, meio ambiente e novas frentes industriais.",
  description:
    "WG Bolsoni atua como holding em proteína, florestamentos, biomassa, alcoolquímica, biocombustíveis, energia, gaseificação de resíduos, fibras celulósicas e meio ambiente — com a CPR Verde no centro da agenda ambiental.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://wgbolsoni.net",
  email: "wgb@wgbolsoni.net",
  copyrightStart: 2016,
  copyrightEnd: 2026,
} as const;

export const NAV_TOP = [
  { label: "Principal", href: "/" },
  { label: "Conceito", href: "/conceito" },
  { label: "Políticas", href: "/politicas" },
  { label: "Conversor de Medidas", href: "/conversor" },
  { label: "Contato", href: "/contato" },
];
