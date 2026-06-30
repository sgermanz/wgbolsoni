# WG Bolsoni — site institucional + CMS (Next.js + Payload + Railway)

Site da **WG Bolsoni** — holding de participações em agronegócio, energia,
meio ambiente, indústria e novas frentes (proteína, CPR Verde, biomassa).

- **Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4
- **CMS:** Payload 3 (mesmo repo, mesmo deploy) com Postgres + Lexical
- **Movimento:** Framer Motion (reveals, dropdowns, transições) com
  `prefers-reduced-motion` respeitado
- **Deploy:** Railway (Node) com Postgres gerenciado

## 1. Estrutura

```
app/
  (frontend)/          site público (URLs idênticas: /, /blog, /areas/<slug>, …)
    layout.tsx         root layout do site (fontes, JSON-LD globais, navbar/footer)
    page.tsx           home
    areas/[slug]/      página dinâmica das 11 áreas
    blog/              listagem + matéria com TTS + RSS
    conceito/ politicas/ contato/ conversor/
    api/contact/       endpoint POST do formulário (Turnstile + email + DB)
    sitemap.ts robots.ts llms.txt/  SEO + GEO
  (payload)/           painel /admin + APIs /api/*  (instalado pelo Payload)
cms/
  collections/         users, media, areas, pages, posts, books, contactMessages
  globals/             siteSettings
  blocks/              image / video / gallery (corpo das matérias)
  views/               AnalyticsView (admin: /admin/analytics)
  seed.ts              popula DB a partir de lib/areas.ts no primeiro boot
components/            navbar, footer, reveal, rich-body, tts-button,
                       contact-form, json-ld, …
lib/
  areas.ts site.ts     fallback estático (usado se DB indisponível)
  cms.ts content.ts    camada de leitura Payload com fallback gracioso
  blog.ts              fetchers de posts
  schema.ts            JSON-LD builders (Article, Organization, Breadcrumb, FAQ…)
  analytics.ts         GA4 Data API + Search Console
payload.config.ts      configuração do CMS
next.config.ts         envolto com withPayload()
railway.json           build/deploy
```

## 2. Conteúdo institucional

| Mudança | Estado |
|---|---|
| **Remover Fertilizantes Organominerais** | ✔ removida do menu e cards |
| **Adicionar Proteína** (links MPA + Chicken HPC 85) | ✔ `/areas/proteina` |
| **Biomassa como subproduto de Florestamentos** | ✔ bloco "Subproduto" dentro de `/areas/florestamentos` |
| **Meio Ambiente — texto novo sobre CPR Verde** | ✔ `/areas/meio-ambiente` (Lei 8.929/1994, Lei 13.986/2020, Decreto 10.828/2021) |
| **Demais áreas do site original** | ✔ Alcoolquímica, Energia, Gaseificação de Resíduos, Biocombustíveis, Fibras Celulósicas/Papéis, Incorporações Imobiliárias, Mídias Sociais, Participações & Investimentos |

O conteúdo inicial é semeado de `lib/areas.ts` para o Payload no primeiro
boot. **Depois disso**, todas as edições acontecem em `/admin` (sem `git push`).

## 3. Desenvolvimento local

Requisitos: **Node 20.9+** e Postgres rodando localmente (ou
`DATABASE_URI` apontando para um Postgres externo, ex. Neon).

```bash
npm install
cp .env.example .env       # edite com seus valores
npm run dev
```

- Site público em http://localhost:3000
- Painel em http://localhost:3000/admin (na primeira visita, ele pede para criar o usuário admin)

Sem Postgres rodando o **site público continua funcionando** — `lib/content.ts` cai automaticamente para `lib/areas.ts`.

## 4. Deploy no Railway — passo a passo

### 4.1. Criar projeto + Postgres

1. Suba o código no GitHub e crie um repo (privado é ok).
2. Em https://railway.com → **New Project → Deploy from GitHub** → escolha o repo.
3. No mesmo projeto, clique **+ New → Database → Add PostgreSQL**.
4. No serviço Postgres, copie a `Postgres Connection URL` (em **Variables**).

### 4.2. Variáveis de ambiente do app

No serviço do site, defina em **Variables**:

| Variável | Obrigatória? | Valor |
|---|---|---|
| `DATABASE_URI` | sim | cole a Postgres Connection URL do passo 4.1 |
| `PAYLOAD_SECRET` | sim | string aleatória — `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `NEXT_PUBLIC_SERVER_URL` | sim | URL final do site |
| `NEXT_PUBLIC_SITE_URL` | sim | igual ao anterior |
| `SMTP_HOST` `SMTP_PORT` `SMTP_USER` `SMTP_PASS` `SMTP_FROM` | para e-mail do contato | dados SMTP do `wgb@wgbolsoni.net` |
| `CONTACT_TO` | opcional | destinatário (default: `wgb@wgbolsoni.net`) |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` `TURNSTILE_SECRET` | para captcha | Cloudflare Turnstile |
| `GA4_PROPERTY_ID` `SEARCH_CONSOLE_SITE_URL` `GOOGLE_SERVICE_ACCOUNT_JSON` | para painel Analytics | ver §6 |

### 4.3. Domínio

**Settings → Networking → Generate Domain** para obter `*.up.railway.app`. Para `wgbolsoni.net`, adicione **Custom Domain** e ajuste o DNS conforme o painel.

### 4.4. Primeiro acesso

1. Aguarde o deploy concluir.
2. Acesse `https://<sua-url>/admin` — você cria o **usuário admin** (e-mail + senha).
3. O `onInit` semeia 11 áreas + 2 páginas + siteSettings.
4. A partir daí, edições pelo painel — `git push` só para mudar **código**.

### 4.5. Re-deploys

A cada `git push` na branch principal: rebuild + redeploy automático. O seed é idempotente.

## 5. Cloudflare Turnstile (captcha)

1. https://dash.cloudflare.com → **Turnstile → Add site**, registre o domínio.
2. Copie **Site Key** → `NEXT_PUBLIC_TURNSTILE_SITE_KEY`.
3. Copie **Secret Key** → `TURNSTILE_SECRET`.

Sem essas variáveis o formulário funciona local sem captcha, mas em produção é fortemente recomendado.

## 6. Analytics (GA4 + Search Console)

Painel em `/admin/analytics`: visitas (GA4) + termos buscados (Search Console).

1. **Service Account** em https://console.cloud.google.com → IAM → Service Accounts.
2. Gere uma **chave JSON** → cole o conteúdo inteiro em `GOOGLE_SERVICE_ACCOUNT_JSON`.
3. **GA4**: Admin → Property → Access management, adicione o e-mail da SA como **Viewer**. Property ID (numérico) → `GA4_PROPERTY_ID`.
4. **Search Console**: Settings → Users and permissions, adicione o e-mail da SA. `SEARCH_CONSOLE_SITE_URL` deve ser **exatamente** a URL verificada (ex.: `https://wgbolsoni.net/`).

Cache de 15 min para não estourar quota.

## 7. Editar conteúdo

- **Áreas, páginas, posts:** `/admin`
- **Menus, contato, redes:** `/admin → Site Settings`
- **Cores/tipografia/layout:** tokens em `app/(frontend)/globals.css`
- **Nova área:** crie em `/admin → Areas` com slug — a rota `/areas/<slug>` aparece automaticamente

## 8. Comandos úteis

```bash
npm run dev                  # dev server
npm run build                # build de produção (Payload import map automático)
npm run start                # produção (lê PORT do env)
npm run generate:types       # regenera payload-types.ts
npm run generate:importmap   # regenera o import map do admin
npm run payload -- <cmd>     # qualquer CLI do Payload (migrate, etc.)
```

## 9. Rollback

Se um deploy quebrar:

1. Railway → **Deployments** → o anterior verde → **Redeploy**.
2. Em paralelo, `git revert <hash>` do commit ruim e `git push`.
3. O Postgres não é tocado pelo redeploy — dados ficam seguros.
