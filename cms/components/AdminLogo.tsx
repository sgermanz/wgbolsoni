/**
 * Replaces Payload's default hexagon wordmark on the login screen
 * (admin.components.graphics.Logo) with the client's official logo. No
 * wrapper card — the login page background is already white/light.
 *
 * Inline styles, not Tailwind: the admin bundle only loads custom.scss,
 * so utility classes are inert here (confirmed once: the logo rendered
 * at its raw 199×78 SVG size, ignoring h-10).
 */
export default function AdminLogo() {
  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src="/logo.svg"
      alt="WG Bolsoni"
      style={{ height: 56, width: "auto", display: "block" }}
    />
  );
}
