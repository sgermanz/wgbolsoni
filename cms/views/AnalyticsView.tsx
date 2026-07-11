import type { AdminViewServerProps } from "payload";

import {
  fetchGA4Summary,
  fetchSearchConsoleSummary,
  getAnalyticsIntegrationStatus,
  type GA4Range,
  type SCRange,
} from "@/lib/analytics";

type SearchParams = { range?: string; tab?: string };

const RANGES = ["7d", "28d", "90d"] as const;
const RANGE_LABEL: Record<(typeof RANGES)[number], string> = {
  "7d": "7 dias",
  "28d": "28 dias",
  "90d": "90 dias",
};

const nf = new Intl.NumberFormat("pt-BR");
const pf = new Intl.NumberFormat("pt-BR", {
  style: "percent",
  maximumFractionDigits: 1,
});

const pickRange = (raw?: string): (typeof RANGES)[number] =>
  (RANGES as readonly string[]).includes(raw ?? "")
    ? (raw as (typeof RANGES)[number])
    : "28d";

export default async function AnalyticsView({
  searchParams,
}: AdminViewServerProps & { searchParams?: SearchParams }) {
  const range = pickRange(searchParams?.range);
  const tab = searchParams?.tab === "apis" ? "apis" : "overview";
  const integrations = getAnalyticsIntegrationStatus();
  const [ga4, sc] = await Promise.all([
    fetchGA4Summary(range as GA4Range),
    fetchSearchConsoleSummary(range as SCRange),
  ]);

  const tabHref = (nextTab: "overview" | "apis") =>
    `?tab=${nextTab}&range=${range}`;

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <div>
          <p style={styles.eyebrow}>INTELIGENCIA DO SITE</p>
          <h1 style={styles.title}>Visao geral</h1>
          <p style={styles.description}>
            Leitura consolidada de visitas, canais e buscas no Google.
          </p>
        </div>
        <div style={styles.liveBadge}>
          <span style={styles.liveDot} /> Atualizacao a cada 15 min
        </div>
      </header>

      <nav aria-label="Analytics" style={styles.tabs}>
        <a href={tabHref("overview")} style={tab === "overview" ? styles.tabActive : styles.tab}>
          Visao geral
        </a>
        <a href={tabHref("apis")} style={tab === "apis" ? styles.tabActive : styles.tab}>
          APIs
        </a>
      </nav>

      {tab === "apis" ? (
        <ApiPanel status={integrations} />
      ) : (
        <>
          <div style={styles.toolbar}>
            <span style={styles.toolbarLabel}>Periodo</span>
            <div style={styles.rangeGroup}>
              {RANGES.map((item) => {
                const active = item === range;
                return (
                  <a
                    key={item}
                    href={`?tab=overview&range=${item}`}
                    style={active ? styles.rangeActive : styles.range}
                  >
                    {RANGE_LABEL[item]}
                  </a>
                );
              })}
            </div>
          </div>

          <section style={styles.section}>
            <SectionHeading
              kicker="GOOGLE ANALYTICS 4"
              title="Como as pessoas chegam e navegam"
              status={ga4 ? "Conectado" : "Aguardando conexao"}
              healthy={Boolean(ga4)}
            />
            {ga4 ? (
              <>
                <div style={styles.kpiGrid}>
                  <KPI label="Usuarios ativos" value={nf.format(ga4.totals.activeUsers)} tone="#17633a" />
                  <KPI label="Sessoes" value={nf.format(ga4.totals.sessions)} tone="#1d5a83" />
                  <KPI label="Paginas vistas" value={nf.format(ga4.totals.pageviews)} tone="#874d17" />
                </div>
                <div style={styles.chartCard}>
                  <div>
                    <p style={styles.cardKicker}>FLUXO DE VISITAS</p>
                    <h3 style={styles.cardTitle}>Usuarios ativos por dia</h3>
                  </div>
                  <Sparkline data={ga4.series} />
                </div>
                <div style={styles.dualGrid}>
                  <RankedList
                    title="Origem do trafego"
                    subtitle="Sessoes por canal"
                    rows={ga4.sources.map((source) => ({
                      label: source.source,
                      value: source.sessions,
                    }))}
                  />
                  <RankedList
                    title="Paginas mais visitadas"
                    subtitle="Visualizacoes no periodo"
                    rows={ga4.topPages.map((page) => ({ label: page.path, value: page.pageviews }))}
                  />
                </div>
                <RankedList
                  title="Dispositivos"
                  subtitle="Sessoes por tipo de tela"
                  compact
                  rows={ga4.devices.map((device) => ({ label: device.device, value: device.sessions }))}
                />
              </>
            ) : (
              <ConnectionEmpty
                title="O Google Analytics ainda nao esta ligado"
                body="Abra a aba APIs para conferir o que falta configurar no Railway."
              />
            )}
          </section>

          <section style={styles.section}>
            <SectionHeading
              kicker="GOOGLE SEARCH CONSOLE"
              title="Buscas que levaram pessoas ao site"
              status={sc ? "Conectado" : "Aguardando conexao"}
              healthy={Boolean(sc)}
            />
            {sc ? (
              <>
                <div style={styles.kpiGridFour}>
                  <KPI label="Cliques" value={nf.format(sc.totals.clicks)} tone="#17633a" />
                  <KPI label="Impressoes" value={nf.format(sc.totals.impressions)} tone="#1d5a83" />
                  <KPI label="CTR" value={pf.format(sc.totals.ctr)} tone="#874d17" />
                  <KPI label="Posicao media" value={sc.totals.position ? sc.totals.position.toFixed(1) : "-"} tone="#6d4c8d" />
                </div>
                <SearchTable rows={sc.queries} />
              </>
            ) : (
              <ConnectionEmpty
                title="As palavras-chave aparecerao aqui"
                body="Elas sao fornecidas pelo Search Console, depois que a propriedade e a Service Account forem conectadas."
              />
            )}
          </section>
        </>
      )}
    </main>
  );
}

function SectionHeading({ kicker, title, status, healthy }: { kicker: string; title: string; status: string; healthy: boolean }) {
  return <div style={styles.sectionHeader}><div><p style={styles.cardKicker}>{kicker}</p><h2 style={styles.sectionTitle}>{title}</h2></div><span style={healthy ? styles.statusOk : styles.statusPending}>{status}</span></div>;
}

function KPI({ label, value, tone }: { label: string; value: string; tone: string }) {
  return <div style={styles.kpi}><div style={{ ...styles.kpiAccent, background: tone }} /><p style={styles.kpiLabel}>{label}</p><strong style={styles.kpiValue}>{value}</strong></div>;
}

function ConnectionEmpty({ title, body }: { title: string; body: string }) {
  return <div style={styles.empty}><div style={styles.emptyIcon}>+</div><div><h3 style={styles.emptyTitle}>{title}</h3><p style={styles.emptyBody}>{body}</p></div></div>;
}

function RankedList({ title, subtitle, rows, compact = false }: { title: string; subtitle: string; rows: { label: string; value: number }[]; compact?: boolean }) {
  const maximum = Math.max(...rows.map((row) => row.value), 1);
  return <div style={{ ...styles.listCard, ...(compact ? styles.compactCard : {}) }}><div style={styles.listHeader}><div><h3 style={styles.cardTitle}>{title}</h3><p style={styles.listSubtitle}>{subtitle}</p></div></div>{rows.length ? <div>{rows.map((row, index) => <div style={styles.rankRow} key={`${row.label}-${index}`}><span style={styles.rankIndex}>{String(index + 1).padStart(2, "0")}</span><div style={styles.rankMain}><div style={styles.rankLabelRow}><span style={styles.rankLabel}>{row.label}</span><strong style={styles.rankValue}>{nf.format(row.value)}</strong></div><div style={styles.barTrack}><span style={{ ...styles.barFill, width: `${Math.max((row.value / maximum) * 100, 2)}%` }} /></div></div></div>)}</div> : <p style={styles.noData}>Sem dados neste periodo.</p>}</div>;
}

function Sparkline({ data }: { data: { date: string; users: number }[] }) {
  if (!data.length) return <p style={styles.noData}>Ainda nao ha dados diarios neste periodo.</p>;
  const width = 960; const height = 150; const padding = 10;
  const max = Math.max(...data.map((item) => item.users), 1);
  const step = (width - padding * 2) / Math.max(data.length - 1, 1);
  const points = data.map((item, index) => `${padding + index * step},${height - padding - (item.users / max) * (height - padding * 2)}`).join(" ");
  return <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Usuarios ativos por dia" style={styles.chart}><defs><linearGradient id="analyticsLine" x1="0" x2="1"><stop stopColor="#1c8a52"/><stop offset="1" stopColor="#66b583"/></linearGradient></defs><polyline fill="none" stroke="url(#analyticsLine)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" points={points}/></svg>;
}

function SearchTable({ rows }: { rows: { query: string; clicks: number; impressions: number; ctr: number; position: number }[] }) {
  return <div style={styles.tableWrap}><div style={styles.tableHeading}><div><p style={styles.cardKicker}>TOP 25</p><h3 style={styles.cardTitle}>Termos pesquisados</h3></div><span style={styles.tableHint}>Periodo selecionado</span></div><div style={styles.tableScroll}><table style={styles.table}><thead><tr>{["Busca", "Cliques", "Impressoes", "CTR", "Posicao"].map((head) => <th key={head} style={styles.th}>{head}</th>)}</tr></thead><tbody>{rows.length ? rows.map((row, index) => <tr key={`${row.query}-${index}`}><td style={styles.queryCell}>{row.query}</td><td style={styles.td}>{nf.format(row.clicks)}</td><td style={styles.td}>{nf.format(row.impressions)}</td><td style={styles.td}>{pf.format(row.ctr)}</td><td style={styles.td}>{row.position.toFixed(1)}</td></tr>) : <tr><td colSpan={5} style={styles.noRows}>Sem buscas neste periodo.</td></tr>}</tbody></table></div></div>;
}

function ApiPanel({ status }: { status: ReturnType<typeof getAnalyticsIntegrationStatus> }) {
  const serviceLabel = status.serviceAccount === "ready" ? "Configurada" : status.serviceAccount === "invalid" ? "JSON invalido" : "Nao configurada";
  return <section style={styles.apiPanel}><div style={styles.apiIntro}><p style={styles.eyebrow}>CONEXOES SEGURAS</p><h2 style={styles.apiTitle}>APIs</h2><p style={styles.apiDescription}>As chaves ficam somente nas variaveis protegidas do Railway. Este painel confirma a configuracao sem expor nenhum dado sensivel.</p></div><div style={styles.integrationGrid}><IntegrationCard name="Google Analytics 4" description="Visitas, origem do trafego, paginas e dispositivos." ready={status.ga4PropertyId && status.serviceAccount === "ready"} fields={[{ name: "GA4_PROPERTY_ID", ready: status.ga4PropertyId }, { name: "GOOGLE_SERVICE_ACCOUNT_JSON", ready: status.serviceAccount === "ready", note: status.serviceAccount === "invalid" ? "O JSON precisa ser valido." : undefined }]} /><IntegrationCard name="Google Search Console" description="Buscas, cliques, impressoes e posicao no Google." ready={status.searchConsoleSiteUrl && status.serviceAccount === "ready"} fields={[{ name: "SEARCH_CONSOLE_SITE_URL", ready: status.searchConsoleSiteUrl }, { name: "GOOGLE_SERVICE_ACCOUNT_JSON", ready: status.serviceAccount === "ready", note: status.serviceAccount === "invalid" ? "O JSON precisa ser valido." : undefined }]} /></div><div style={styles.apiHow}><p style={styles.cardKicker}>COMO CONECTAR</p><ol style={styles.steps}><li>Crie uma Service Account no Google Cloud e habilite as APIs Google Analytics Data e Search Console.</li><li>Adicione o e-mail da Service Account como leitor na propriedade GA4 e como usuario no Search Console.</li><li>No Railway, abra o servico <strong>wgbolsoni</strong>, entre em <strong>Variables</strong> e preencha as variaveis acima.</li><li>Depois do proximo deploy, os dados comecam a aparecer aqui. A atualizacao e feita a cada 15 minutos.</li></ol></div></section>;
}

function IntegrationCard({ name, description, ready, fields }: { name: string; description: string; ready: boolean; fields: { name: string; ready: boolean; note?: string }[] }) {
  return <article style={styles.integrationCard}><div style={styles.integrationTop}><div><h3 style={styles.integrationName}>{name}</h3><p style={styles.integrationDescription}>{description}</p></div><span style={ready ? styles.statusOk : styles.statusPending}>{ready ? "Pronta" : "Pendente"}</span></div><div style={styles.variableList}>{fields.map((field) => <div key={field.name} style={styles.variable}><div><code style={styles.variableName}>{field.name}</code>{field.note && <p style={styles.variableNote}>{field.note}</p>}</div><span style={field.ready ? styles.variableOk : styles.variableMissing}>{field.ready ? "Configurada" : "Falta"}</span></div>)}</div></article>;
}

const styles: Record<string, React.CSSProperties> = {
  page: { maxWidth: 1180, margin: "0 auto", padding: "34px 32px 64px", color: "#15251b" },
  header: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 24, marginBottom: 28 }, eyebrow: { margin: 0, color: "#2f8049", fontSize: 11, fontWeight: 800, letterSpacing: "0.11em" }, title: { margin: "7px 0 6px", fontSize: 32, lineHeight: 1.1, letterSpacing: 0, fontWeight: 800 }, description: { margin: 0, color: "#627168", fontSize: 15 }, liveBadge: { display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 11px", border: "1px solid #dce7df", borderRadius: 8, background: "#fbfdfb", color: "#52625a", fontSize: 12, whiteSpace: "nowrap" }, liveDot: { width: 7, height: 7, borderRadius: "50%", background: "#2f8049", boxShadow: "0 0 0 3px #dcefe1" },
  tabs: { display: "flex", gap: 4, borderBottom: "1px solid #dfe6e1", marginBottom: 24 }, tab: { padding: "11px 14px", textDecoration: "none", color: "#5d6b63", fontSize: 14, fontWeight: 650, borderBottom: "2px solid transparent" }, tabActive: { padding: "11px 14px", textDecoration: "none", color: "#1e6a3c", fontSize: 14, fontWeight: 750, borderBottom: "2px solid #2f8049" },
  toolbar: { display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }, toolbarLabel: { color: "#66756c", fontSize: 13, fontWeight: 650 }, rangeGroup: { display: "flex", padding: 3, gap: 3, border: "1px solid #dce5df", borderRadius: 8, background: "#f6f9f7" }, range: { padding: "6px 11px", color: "#5d6b63", borderRadius: 5, fontSize: 12, fontWeight: 650, textDecoration: "none" }, rangeActive: { padding: "6px 11px", color: "#fff", borderRadius: 5, background: "#287444", fontSize: 12, fontWeight: 750, textDecoration: "none", boxShadow: "0 1px 2px rgba(24, 83, 47, .22)" },
  section: { padding: "23px", marginBottom: 20, border: "1px solid #dfe6e1", borderRadius: 8, background: "#fff", boxShadow: "0 1px 2px rgba(23, 44, 30, .025)" }, sectionHeader: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 20 }, sectionTitle: { margin: "5px 0 0", fontSize: 20, lineHeight: 1.25, fontWeight: 760, letterSpacing: 0 }, statusOk: { display: "inline-flex", alignItems: "center", padding: "5px 9px", color: "#17633a", background: "#e7f4ea", borderRadius: 999, fontSize: 11, fontWeight: 750, whiteSpace: "nowrap" }, statusPending: { display: "inline-flex", alignItems: "center", padding: "5px 9px", color: "#8a5a1d", background: "#fdf3df", borderRadius: 999, fontSize: 11, fontWeight: 750, whiteSpace: "nowrap" },
  kpiGrid: { display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 12, marginBottom: 14 }, kpiGridFour: { display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 12, marginBottom: 18 }, kpi: { position: "relative", overflow: "hidden", padding: "15px 16px 14px", minHeight: 88, borderRadius: 7, background: "#f8faf8", border: "1px solid #e6ece8" }, kpiAccent: { position: "absolute", left: 0, top: 0, bottom: 0, width: 4 }, kpiLabel: { margin: "0 0 7px", paddingLeft: 5, color: "#68766e", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em" }, kpiValue: { paddingLeft: 5, color: "#14251b", fontSize: 25, lineHeight: 1, fontWeight: 780, letterSpacing: 0 },
  chartCard: { padding: "18px", border: "1px solid #e4ebe6", borderRadius: 7, background: "linear-gradient(180deg, #fbfdfb 0%, #f5faf6 100%)", marginBottom: 14 }, cardKicker: { margin: 0, color: "#738178", fontSize: 10, fontWeight: 800, letterSpacing: ".1em" }, cardTitle: { margin: "5px 0 0", fontSize: 15, fontWeight: 750, color: "#1b2c22", letterSpacing: 0 }, chart: { display: "block", width: "100%", height: 150, marginTop: 12 }, dualGrid: { display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 14, marginBottom: 14 }, listCard: { padding: "17px", border: "1px solid #e4ebe6", borderRadius: 7, background: "#fff" }, compactCard: { maxWidth: 560 }, listHeader: { marginBottom: 12 }, listSubtitle: { margin: "4px 0 0", color: "#738178", fontSize: 12 }, rankRow: { display: "flex", gap: 10, alignItems: "flex-start", padding: "9px 0", borderTop: "1px solid #f0f3f1" }, rankIndex: { paddingTop: 1, minWidth: 20, color: "#9aa69f", fontSize: 10, fontWeight: 750 }, rankMain: { flex: 1, minWidth: 0 }, rankLabelRow: { display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 6 }, rankLabel: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "#314238", fontSize: 13, fontWeight: 600 }, rankValue: { color: "#1b2c22", fontSize: 12, fontWeight: 750 }, barTrack: { height: 4, overflow: "hidden", borderRadius: 999, background: "#edf2ee" }, barFill: { display: "block", height: "100%", borderRadius: 999, background: "#5aa775" }, noData: { margin: "12px 0", color: "#78857d", fontSize: 13 },
  empty: { display: "flex", alignItems: "center", gap: 14, padding: "24px", border: "1px dashed #cbd8cf", borderRadius: 7, background: "#fafcfb" }, emptyIcon: { display: "grid", placeItems: "center", flex: "0 0 34px", width: 34, height: 34, borderRadius: "50%", color: "#287444", background: "#e5f2e8", fontSize: 22, fontWeight: 400 }, emptyTitle: { margin: 0, color: "#213328", fontSize: 15, fontWeight: 750 }, emptyBody: { margin: "4px 0 0", color: "#66756c", fontSize: 13 },
  tableWrap: { border: "1px solid #e4ebe6", borderRadius: 7, overflow: "hidden", background: "#fff" }, tableHeading: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "16px 17px", background: "#f8faf8", borderBottom: "1px solid #e4ebe6" }, tableHint: { color: "#78857d", fontSize: 11 }, tableScroll: { overflowX: "auto" }, table: { width: "100%", borderCollapse: "collapse", fontSize: 13 }, th: { padding: "10px 17px", background: "#fcfdfc", borderBottom: "1px solid #e8eeea", color: "#758279", fontSize: 10, letterSpacing: ".07em", fontWeight: 800, textAlign: "right", textTransform: "uppercase", whiteSpace: "nowrap" }, queryCell: { padding: "11px 17px", borderBottom: "1px solid #edf1ee", color: "#26392d", fontWeight: 650 }, td: { padding: "11px 17px", borderBottom: "1px solid #edf1ee", color: "#4e5e54", textAlign: "right", fontVariantNumeric: "tabular-nums" }, noRows: { padding: 20, color: "#758279", textAlign: "center" },
  apiPanel: { padding: "26px", border: "1px solid #dfe6e1", borderRadius: 8, background: "#fff", boxShadow: "0 1px 2px rgba(23, 44, 30, .025)" }, apiIntro: { maxWidth: 680, marginBottom: 24 }, apiTitle: { margin: "7px 0 8px", fontSize: 25, fontWeight: 780, letterSpacing: 0 }, apiDescription: { margin: 0, color: "#637168", fontSize: 14, lineHeight: 1.55 }, integrationGrid: { display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 14, marginBottom: 16 }, integrationCard: { padding: "18px", border: "1px solid #e0e8e2", borderRadius: 7, background: "#fbfdfb" }, integrationTop: { display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start", marginBottom: 17 }, integrationName: { margin: 0, color: "#1e3025", fontSize: 16, fontWeight: 750 }, integrationDescription: { margin: "5px 0 0", color: "#68766e", fontSize: 12, lineHeight: 1.45 }, variableList: { borderTop: "1px solid #e7ede8" }, variable: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, padding: "11px 0", borderBottom: "1px solid #e7ede8" }, variableName: { color: "#385047", fontSize: 11, fontWeight: 700 }, variableNote: { margin: "3px 0 0", color: "#a06420", fontSize: 11 }, variableOk: { color: "#17633a", fontSize: 11, fontWeight: 750 }, variableMissing: { color: "#9a6621", fontSize: 11, fontWeight: 750 }, apiHow: { padding: "19px", borderRadius: 7, background: "#f3f8f4", border: "1px solid #dceadf" }, steps: { margin: "10px 0 0", paddingLeft: 20, color: "#405148", fontSize: 13, lineHeight: 1.65 },
};
