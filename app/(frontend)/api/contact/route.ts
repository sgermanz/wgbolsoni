import { NextResponse } from "next/server";

import { getPayloadClient } from "@/lib/cms";
import { renderContactEmail } from "@/lib/contact-email";

export const runtime = "nodejs";

/**
 * Simple in-memory rate limiter. 5 requests / 10 min per IP. Resets on
 * server restart — enough to deter scripted abuse without persistence cost.
 * For higher traffic, swap for an external store (Upstash, Redis).
 */
const rateBuckets = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;

function takeToken(ip: string): boolean {
  const now = Date.now();
  const bucket = rateBuckets.get(ip);
  if (!bucket || bucket.resetAt < now) {
    rateBuckets.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }
  if (bucket.count >= RATE_LIMIT) return false;
  bucket.count += 1;
  return true;
}

async function verifyTurnstile(
  token: string | undefined,
  ip: string,
): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET;
  if (!secret) {
    // No secret configured → skip verification (dev/local). Production must set it.
    return true;
  }
  if (!token) return false;
  const body = new URLSearchParams({
    secret,
    response: token,
    remoteip: ip,
  });
  try {
    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      { method: "POST", body },
    );
    const json = (await res.json()) as { success?: boolean };
    return Boolean(json.success);
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "anonymous";

  if (!takeToken(ip)) {
    return NextResponse.json(
      { ok: false, error: "Muitas tentativas. Tente novamente em alguns minutos." },
      { status: 429 },
    );
  }

  const form = await req.formData();

  if (form.get("hp")) {
    // Honeypot tripped — return 200 silently so bots don't get feedback.
    return NextResponse.json({ ok: true });
  }

  const name = String(form.get("name") || "").trim();
  const email = String(form.get("email") || "").trim();
  const phone = String(form.get("phone") || "").trim() || undefined;
  const subject = String(form.get("subject") || "").trim();
  const message = String(form.get("message") || "").trim();
  const token = String(form.get("cf-turnstile-response") || "") || undefined;

  if (!name || !email || !subject || !message) {
    return NextResponse.json(
      { ok: false, error: "Preencha nome, e-mail, assunto e mensagem." },
      { status: 400 },
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { ok: false, error: "E-mail inválido." },
      { status: 400 },
    );
  }

  if (!(await verifyTurnstile(token, ip))) {
    return NextResponse.json(
      { ok: false, error: "Falha no captcha. Recarregue e tente novamente." },
      { status: 400 },
    );
  }

  const payload = await getPayloadClient().catch(() => null);
  if (!payload) {
    return NextResponse.json(
      { ok: false, error: "Serviço temporariamente indisponível." },
      { status: 503 },
    );
  }

  try {
    await payload.create({
      collection: "contactMessages",
      data: {
        name,
        email,
        phone,
        subject,
        message,
        origin: req.headers.get("referer") || "",
        status: "new",
      } as never,
    });
  } catch (err) {
    payload.logger.error(
      `[contact] failed to persist message: ${(err as Error).message}`,
    );
    return NextResponse.json(
      { ok: false, error: "Não foi possível registrar sua mensagem." },
      { status: 500 },
    );
  }

  const to = process.env.CONTACT_TO || "wgbolsoni@gmail.com";
  const copyTo = process.env.CONTACT_COPY_TO || "wgb@wgbolsoni.net";
  const resendApiKey = process.env.RESEND_API_KEY;
  const { html, text } = renderContactEmail({
    name,
    email,
    phone,
    subject,
    message,
    origin: req.headers.get("referer") || undefined,
    receivedAt: new Date().toISOString(),
  });

  if (resendApiKey) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from:
            process.env.RESEND_FROM ||
            "WGBolsoni <site@wgbolsoni.net>",
          to: [to],
          bcc:
            copyTo && copyTo.toLowerCase() !== to.toLowerCase()
              ? [copyTo]
              : undefined,
          reply_to: email,
          subject: `[Contato site] ${subject}`,
          html,
          text,
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Resend ${response.status}: ${errorBody.slice(0, 500)}`);
      }

      payload.logger.info("[contact] email sent through Resend");
    } catch (err) {
      payload.logger.warn(
        `[contact] message persisted but Resend send failed: ${(err as Error).message}`,
      );
    }
  } else if (process.env.SMTP_HOST) {
    try {
      await payload.sendEmail({
        to,
        bcc: copyTo.toLowerCase() === to.toLowerCase() ? undefined : copyTo,
        replyTo: email,
        subject: `[Contato site] ${subject}`,
        html,
        text,
      });
    } catch (err) {
      payload.logger.warn(
        `[contact] message persisted but email send failed: ${(err as Error).message}`,
      );
      // Don't fail the response — message is safe in the DB.
    }
  } else {
    payload.logger.info(
      "[contact] message persisted (email provider not configured — set RESEND_API_KEY)",
    );
  }

  return NextResponse.json({ ok: true });
}
