"use client";

import { useEffect, useState } from "react";

type Settings = { ga4PropertyId: string; searchConsoleSiteUrl: string };
const initial: Settings = { ga4PropertyId: "", searchConsoleSiteUrl: "" };

export default function AnalyticsApiSettings({
  hasServiceAccount,
}: {
  hasServiceAccount: boolean;
}) {
  const [settings, setSettings] = useState(initial);
  const [state, setState] = useState<"loading" | "idle" | "saving" | "saved" | "error">("loading");

  useEffect(() => {
    fetch("/api/globals/analyticsSettings", { credentials: "same-origin" })
      .then(async (response) => {
        if (!response.ok) throw new Error("Não foi possível carregar.");
        return response.json();
      })
      .then((data) => {
        setSettings({ ga4PropertyId: data.ga4PropertyId ?? "", searchConsoleSiteUrl: data.searchConsoleSiteUrl ?? "" });
        setState("idle");
      })
      .catch(() => setState("error"));
  }, []);

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("saving");
    try {
      const response = await fetch("/api/globals/analyticsSettings", {
        method: "PATCH",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ga4PropertyId: settings.ga4PropertyId.trim(),
          searchConsoleSiteUrl: settings.searchConsoleSiteUrl.trim(),
        }),
      });
      if (!response.ok) throw new Error("Falha ao salvar.");
      setState("saved");
    } catch {
      setState("error");
    }
  }

  if (state === "loading") return <p style={notice}>Carregando configurações...</p>;
  if (state === "error") return <p style={{ ...notice, color: "#a64a32" }}>Não foi possível salvar. Atualize a página e tente novamente.</p>;

  return <form onSubmit={save} style={{ display: "grid", gap: 14 }}>
    <label style={label}>GA4 Property ID<input required value={settings.ga4PropertyId} onChange={(event) => setSettings((value) => ({ ...value, ga4PropertyId: event.target.value }))} placeholder="Ex.: 123456789" style={input} /></label>
    <label style={label}>URL da propriedade no Search Console<input required type="url" value={settings.searchConsoleSiteUrl} onChange={(event) => setSettings((value) => ({ ...value, searchConsoleSiteUrl: event.target.value }))} placeholder="https://wgbolsoni.net/" style={input} /></label>
    <div style={{ padding: "12px 13px", border: "1px solid #dce7df", borderRadius: 7, background: "#f8fbf8", color: "#53645a", fontSize: 12, lineHeight: 1.5 }}>
      <strong style={{ color: hasServiceAccount ? "#17633a" : "#9a6621" }}>Service Account: {hasServiceAccount ? "configurada no Railway" : "ausente no Railway"}</strong><br />
      Por segurança, o JSON secreto fica somente nas variáveis protegidas do Railway.
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}><button type="submit" disabled={state === "saving"} style={button}>{state === "saving" ? "Salvando..." : "Salvar configurações"}</button>{state === "saved" && <span style={{ color: "#17633a", fontSize: 12, fontWeight: 700 }}>Salvo. Atualize a página para testar a conexão.</span>}</div>
  </form>;
}

const label: React.CSSProperties = { display: "grid", gap: 6, color: "#314238", fontSize: 13, fontWeight: 700 };
const input: React.CSSProperties = { width: "100%", boxSizing: "border-box", padding: "10px 12px", color: "#1e3025", border: "1px solid #cedbd2", borderRadius: 7, background: "#fff", fontSize: 14 };
const button: React.CSSProperties = { border: 0, borderRadius: 7, padding: "10px 14px", background: "#287444", color: "#fff", fontSize: 13, fontWeight: 750, cursor: "pointer" };
const notice: React.CSSProperties = { color: "#68766e", fontSize: 13 };
