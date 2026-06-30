type ContactPayload = {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  origin?: string;
  receivedAt: string;
};

const escape = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

/**
 * Responsive HTML template for the contact notification. Designed to render
 * legibly in Gmail, Apple Mail, and Outlook web — table-based layout, inline
 * styles, no external assets.
 */
export function renderContactEmail(p: ContactPayload): {
  html: string;
  text: string;
} {
  const rows: [string, string][] = [
    ["Nome", p.name],
    ["E-mail", p.email],
    ...(p.phone ? ([["Telefone", p.phone]] as [string, string][]) : []),
    ["Assunto", p.subject],
    ["Recebido em", new Date(p.receivedAt).toLocaleString("pt-BR")],
    ...(p.origin ? ([["Origem", p.origin]] as [string, string][]) : []),
  ];

  const html = `<!doctype html>
<html lang="pt-BR">
<body style="margin:0;padding:24px;background:#f4f5f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#1f2933">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e4e7eb">
    <tr>
      <td style="background:#2f8049;padding:20px 28px;color:#ffffff">
        <p style="margin:0;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;opacity:0.85">WG Bolsoni · site institucional</p>
        <p style="margin:6px 0 0;font-size:20px;font-weight:700">Nova mensagem pelo formulário</p>
      </td>
    </tr>
    <tr>
      <td style="padding:24px 28px">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border-collapse:collapse;font-size:14px">
          ${rows
            .map(
              ([k, v]) => `
            <tr>
              <td style="padding:10px 12px;background:#f9fafb;border:1px solid #e4e7eb;width:140px;color:#52606d;font-weight:600">${escape(k)}</td>
              <td style="padding:10px 12px;border:1px solid #e4e7eb">${escape(v)}</td>
            </tr>`,
            )
            .join("")}
        </table>

        <div style="margin-top:24px;padding:18px;background:#f9fafb;border-radius:12px;border:1px solid #e4e7eb">
          <p style="margin:0 0 8px;font-size:12px;font-weight:600;color:#52606d;letter-spacing:0.04em;text-transform:uppercase">Mensagem</p>
          <p style="margin:0;white-space:pre-line;font-size:15px;line-height:1.55;color:#1f2933">${escape(p.message)}</p>
        </div>

        <p style="margin:24px 0 0;font-size:12px;color:#7b8794">
          Responder este e-mail vai diretamente para <strong>${escape(p.email)}</strong> (Reply-To configurado).
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `Nova mensagem pelo formulário — WG Bolsoni

${rows.map(([k, v]) => `${k}: ${v}`).join("\n")}

Mensagem:
${p.message}

(Responder este e-mail vai diretamente para ${p.email}.)`;

  return { html, text };
}
