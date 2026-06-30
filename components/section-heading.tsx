import { Reveal } from "./reveal";

type Props = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  align?: "left" | "center";
};

export function SectionHeading({ eyebrow, title, subtitle, align = "left" }: Props) {
  const alignCls =
    align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-2xl";
  return (
    <div className={alignCls}>
      {eyebrow && (
        <Reveal>
          <p className="mb-3 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-300">
            <span className="h-px w-6 bg-brand-500" />
            {eyebrow}
          </p>
        </Reveal>
      )}
      {title && (
        <Reveal delay={0.05}>
          <h2 className="text-balance text-[length:var(--text-fluid-2xl)] font-bold leading-[1.05]">
            {title}
          </h2>
        </Reveal>
      )}
      {subtitle && (
        <Reveal delay={0.1}>
          <p className="text-pretty mt-4 text-[length:var(--text-fluid-lg)] text-[var(--content-soft)]">
            {subtitle}
          </p>
        </Reveal>
      )}
    </div>
  );
}
