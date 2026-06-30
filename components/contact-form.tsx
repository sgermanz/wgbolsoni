"use client";

import Script from "next/script";
import { useState } from "react";
import { Send, CheckCircle2, AlertTriangle } from "lucide-react";

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "ok"; message: string }
  | { kind: "error"; message: string };

type Props = { turnstileSiteKey?: string };

/**
 * Contact form with Cloudflare Turnstile (when key present), honeypot field,
 * and a minimal client-side validity check. The actual rate-limit + Turnstile
 * verify happens server-side in /api/contact.
 */
export function ContactForm({ turnstileSiteKey }: Props) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    if (data.get("hp")) return; // honeypot caught a bot

    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        body: data,
      });
      const json = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) {
        setStatus({
          kind: "error",
          message: json.error || "Não conseguimos enviar agora. Tente em instantes.",
        });
        return;
      }
      setStatus({
        kind: "ok",
        message: "Mensagem enviada! Vamos retornar em breve.",
      });
      form.reset();
      // Reset Turnstile widget so user can submit another message.
      const turnstile = (window as unknown as {
        turnstile?: { reset: (selector?: string) => void };
      }).turnstile;
      turnstile?.reset?.(".cf-turnstile");
    } catch {
      setStatus({
        kind: "error",
        message: "Erro de rede. Verifique sua conexão e tente novamente.",
      });
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      {turnstileSiteKey && (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js"
          async
          defer
        />
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field name="name" label="Seu nome" required autoComplete="name" />
        <Field
          name="email"
          label="E-mail"
          type="email"
          required
          autoComplete="email"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          name="phone"
          label="Telefone (opcional)"
          type="tel"
          autoComplete="tel"
        />
        <Field name="subject" label="Assunto" required />
      </div>

      <Field
        name="message"
        label="Sua mensagem"
        required
        textarea
        rows={6}
      />

      {/* Honeypot — invisible to humans, bots tend to fill every field. */}
      <input
        type="text"
        name="hp"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      {turnstileSiteKey && (
        <div
          className="cf-turnstile"
          data-sitekey={turnstileSiteKey}
          data-theme="auto"
        />
      )}

      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <p className="text-xs text-[var(--content-soft)]">
          Tratamos seus dados conforme a LGPD. Você pode pedir remoção a
          qualquer momento.
        </p>
        <button
          type="submit"
          disabled={status.kind === "sending"}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-600 px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 disabled:opacity-60"
        >
          {status.kind === "sending" ? "Enviando..." : "Enviar mensagem"}
          <Send className="h-4 w-4" />
        </button>
      </div>

      {status.kind === "ok" && (
        <p className="flex items-center gap-2 rounded-xl bg-brand-500/10 px-4 py-3 text-sm text-brand-700 dark:text-brand-300">
          <CheckCircle2 className="h-4 w-4" />
          {status.message}
        </p>
      )}
      {status.kind === "error" && (
        <p className="flex items-center gap-2 rounded-xl bg-accent-500/10 px-4 py-3 text-sm text-accent-600">
          <AlertTriangle className="h-4 w-4" />
          {status.message}
        </p>
      )}
    </form>
  );
}

type FieldProps = {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  textarea?: boolean;
  rows?: number;
};

function Field({
  name,
  label,
  type = "text",
  required,
  autoComplete,
  textarea,
  rows = 4,
}: FieldProps) {
  const cls =
    "w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--content)] outline-none transition placeholder:text-[var(--content-soft)]/50 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20";
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-[var(--content-soft)]">
        {label}
        {required && <span className="ml-0.5 text-accent-500">*</span>}
      </span>
      {textarea ? (
        <textarea
          name={name}
          required={required}
          rows={rows}
          className={cls + " resize-y"}
        />
      ) : (
        <input
          name={name}
          type={type}
          required={required}
          autoComplete={autoComplete}
          className={cls}
        />
      )}
    </label>
  );
}
