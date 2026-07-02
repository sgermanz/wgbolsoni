/**
 * Replaces Payload's default hexagon wordmark on the login screen
 * (admin.components.graphics.Logo) with the client's official logo. Same
 * white-card treatment as the public navbar/footer (components/brand.tsx):
 * the logo's fixed colors assume a white backdrop, and Payload's own admin
 * theme can go dark independently of the public site, so the card is
 * always white regardless.
 *
 * Inline styles, not Tailwind: the admin bundle only loads custom.scss —
 * Tailwind's generated CSS isn't present here, so utility classes are inert
 * (confirmed: the logo rendered at its raw 199×78 SVG size, ignoring h-10).
 */
export default function AdminLogo() {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        borderRadius: 12,
        background: "#fff",
        padding: "12px 16px",
        boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
        border: "1px solid rgba(0,0,0,0.06)",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo.svg"
        alt="WG Bolsoni"
        style={{ height: 40, width: "auto", display: "block" }}
      />
    </span>
  );
}
