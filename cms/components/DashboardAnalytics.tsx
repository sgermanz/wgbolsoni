import { ArrowUpRight, BarChart3, Search } from "lucide-react";

import { getStoredAnalyticsSettings } from "@/cms/analytics-settings";
import {
  fetchGA4Summary,
  fetchSearchConsoleSummary,
  getAnalyticsIntegrationStatus,
} from "@/lib/analytics";

const nf = new Intl.NumberFormat("pt-BR");

export default async function DashboardAnalytics() {
  const settings = await getStoredAnalyticsSettings();
  const status = getAnalyticsIntegrationStatus(settings);
  const [ga4, search] = await Promise.all([
    fetchGA4Summary("28d", settings),
    fetchSearchConsoleSummary("28d", settings),
  ]);
  const connected = Boolean(ga4 || search);

  return (
    <section style={styles.panel}>
      <div style={styles.header}>
        <div>
          <p style={styles.kicker}>INTELIGENCIA DO SITE</p>
          <h2 style={styles.title}>Resumo de visitas</h2>
          <p style={styles.copy}>Últimos 28 dias, atualizado a cada 15 minutos.</p>
        </div>
        <a href="/admin/analytics" style={styles.link}>Abrir Analytics <ArrowUpRight size={15} /></a>
      </div>
      {connected ? (
        <div style={styles.grid}>
          <Metric icon={<BarChart3 size={18} />} label="Usuários ativos" value={nf.format(ga4?.totals.activeUsers ?? 0)} tone="#1c7d48" />
          <Metric icon={<BarChart3 size={18} />} label="Sessões" value={nf.format(ga4?.totals.sessions ?? 0)} tone="#23658c" />
          <Metric icon={<Search size={18} />} label="Cliques no Google" value={nf.format(search?.totals.clicks ?? 0)} tone="#8b5a1d" />
          <Metric icon={<Search size={18} />} label="Impressões" value={nf.format(search?.totals.impressions ?? 0)} tone="#7a5294" />
        </div>
      ) : (
        <div style={styles.empty}><span style={styles.emptyIcon}><BarChart3 size={19} /></span><div><strong style={{ color: "#24372a", fontSize: 14 }}>Analytics ainda não conectado</strong><p style={{ margin: "3px 0 0", color: "#69786f", fontSize: 13 }}>Abra Analytics e preencha os parâmetros da propriedade para começar.</p></div><a href="/admin/analytics?tab=apis" style={styles.configure}>Configurar APIs</a></div>
      )}
      <div style={styles.footer}><span style={status.ga4PropertyId && status.searchConsoleSiteUrl && status.serviceAccount === "ready" ? styles.statusOk : styles.statusPending}>{status.ga4PropertyId && status.searchConsoleSiteUrl && status.serviceAccount === "ready" ? "Conectado" : "Configuração pendente"}</span><span style={styles.footerText}>Google Analytics 4 + Search Console</span></div>
    </section>
  );
}

function Metric({ icon, label, value, tone }: { icon: React.ReactNode; label: string; value: string; tone: string }) {
  return <div style={styles.metric}><span style={{ ...styles.metricIcon, color: tone, background: `${tone}12` }}>{icon}</span><div><p style={styles.metricLabel}>{label}</p><strong style={styles.metricValue}>{value}</strong></div></div>;
}

const styles: Record<string, React.CSSProperties> = {
  panel: { margin: "22px 0 28px", padding: "23px", background: "#fff", border: "1px solid #dfe7e1", borderRadius: 10, boxShadow: "0 2px 4px rgba(23, 44, 30, .035)" },
  header: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 18 }, kicker: { margin: 0, color: "#2f8049", fontSize: 10, fontWeight: 800, letterSpacing: ".1em" }, title: { margin: "5px 0 4px", color: "#15251b", fontSize: 21, lineHeight: 1.1, fontWeight: 780 }, copy: { margin: 0, color: "#6a796f", fontSize: 13 }, link: { display: "inline-flex", alignItems: "center", gap: 5, color: "#1e6a3c", textDecoration: "none", fontSize: 13, fontWeight: 750, whiteSpace: "nowrap" },
  grid: { display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 10 }, metric: { display: "flex", alignItems: "center", gap: 10, minWidth: 0, padding: "13px", border: "1px solid #e6ece8", borderRadius: 7, background: "#fafcfb" }, metricIcon: { display: "grid", placeItems: "center", flex: "0 0 33px", width: 33, height: 33, borderRadius: 7 }, metricLabel: { margin: 0, color: "#718077", fontSize: 10, fontWeight: 750, textTransform: "uppercase", letterSpacing: ".05em" }, metricValue: { display: "block", marginTop: 4, color: "#1b2c22", fontSize: 21, lineHeight: 1, fontWeight: 780 },
  empty: { display: "flex", alignItems: "center", gap: 12, padding: "17px", border: "1px dashed #cfddd3", borderRadius: 7, background: "#fafcfb" }, emptyIcon: { display: "grid", placeItems: "center", color: "#287444", background: "#e4f1e7", width: 36, height: 36, borderRadius: 7 }, configure: { marginLeft: "auto", color: "#fff", background: "#287444", borderRadius: 7, padding: "8px 10px", textDecoration: "none", fontSize: 12, fontWeight: 750, whiteSpace: "nowrap" },
  footer: { display: "flex", alignItems: "center", gap: 8, marginTop: 13 }, statusOk: { padding: "4px 8px", color: "#17633a", background: "#e7f4ea", borderRadius: 999, fontSize: 10, fontWeight: 800 }, statusPending: { padding: "4px 8px", color: "#8a5a1d", background: "#fdf3df", borderRadius: 999, fontSize: 10, fontWeight: 800 }, footerText: { color: "#7b887f", fontSize: 11 },
};
