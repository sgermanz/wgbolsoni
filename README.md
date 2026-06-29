# WG Bolsoni — site institucional (Next.js + Railway)

Site da **WG Bolsoni** — holding de participações em agronegócio, energia, meio
ambiente, indústria e novas frentes (proteína, CPR Verde, biomassa).

- **Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4
- **Movimento:** Framer Motion (reveals, dropdowns, page transitions) com
  `prefers-reduced-motion` respeitado
- **Conteúdo:** estático (App Router) — não exige banco de dados
- **Deploy:** Railway (Node) com build automático a partir do GitHub

## 1. Estrutura

```
app/
  layout.tsx            shell (navbar + footer + fontes + meta + tema)
  page.tsx              home (hero + grid das 11 áreas)
  areas/[slug]/page.tsx página dinâmica de cada área (SSG)
  conceito/             página estática
  politicas/            página estática
  conversor/            calculadora client-side (área/massa/volume/energia)
  contato/              página estática (mailto)
  sitemap.ts robots.ts  SEO técnico
components/             navbar, footer, reveal, section-heading, cta
lib/areas.ts            11 áreas com textos institucionais
lib/site.ts             constantes da marca
railway.json            configuração de build/deploy da Railway
```

## 2. Conteúdo institucional — regras aplicadas

| Mudança | Estado |
|---|---|
| **Remover Fertilizantes Organominerais** | ✔ removida do menu e cards |
| **Adicionar Proteína** (links MPA + Chicken HPC 85) | ✔ `/areas/proteina` |
| **Biomassa como subproduto de Florestamentos** | ✔ bloco "Subproduto" dentro de `/areas/florestamentos` |
| **Meio Ambiente — texto novo sobre CPR Verde** | ✔ `/areas/meio-ambiente` (com base legal: Lei 8.929/1994, Lei 13.986/2020, Decreto 10.828/2021) |
| **Demais áreas do site original** | ✔ Alcoolquímica, Energia, Gaseificação de Resíduos, Biocombustíveis, Fibras Celulósicas/Papéis, Incorporações Imobiliárias, Mídias Sociais, Participações & Investimentos |

Editar textos: arquivo **único** em [`lib/areas.ts`](lib/areas.ts).

## 3. Desenvolvimento local

Requisitos: **Node.js 20+**.

```bash
npm install
npm run dev
```
Abra http://localhost:3000.

## 4. Deploy no Railway — passo a passo

1. **Suba o código para o GitHub** (crie um repo novo e dê `git push`).
2. Em https://railway.com → **New Project → Deploy from GitHub** → escolha o repo.
3. Railway detecta automaticamente o Next.js (Nixpacks) e roda:
   - `npm ci && npm run build`
   - `npm run start` (ouve a porta `$PORT` que o Railway injeta)
4. Quando a build terminar, abra **Settings → Networking → Generate Domain**
   para obter uma URL `*.up.railway.app`. Para domínio próprio
   (`wgbolsoni.net`), adicione um Custom Domain e configure o DNS conforme as
   instruções do painel.
5. Em **Variables**, defina:
   - `NEXT_PUBLIC_SITE_URL=https://wgbolsoni.net` (ou a URL gerada)
6. A cada `git push` na branch principal, a Railway refaz build+deploy
   automaticamente.

Arquivos relevantes:
- [`railway.json`](railway.json) — comandos de build/deploy + healthcheck
- [`.env.example`](.env.example) — variáveis suportadas

## 5. Editar conteúdo no futuro

- **Textos das áreas:** edite `lib/areas.ts` e dê push — em ~1 min o site está atualizado.
- **Menus do topo / contato:** `lib/site.ts`.
- **Cores/tipografia/layout:** tokens em `app/globals.css` (vars CSS).
- **Adicionar uma nova área:** acrescente um objeto em `AREAS` (slug + title + body) e pronto — a página é gerada automaticamente em `/areas/<slug>` pela rota dinâmica com `generateStaticParams`.
