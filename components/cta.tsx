import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";

type Variant = "primary" | "brand" | "ghost";

const styles: Record<Variant, string> = {
  primary:
    "bg-accent-500 text-white shadow-sm hover:bg-accent-600 hover:-translate-y-0.5",
  brand:
    "bg-brand-600 text-white shadow-sm hover:bg-brand-700 hover:-translate-y-0.5",
  ghost:
    "border border-[var(--border)] text-[var(--content)] hover:bg-[var(--surface-2)]",
};

type Props = {
  href: string;
  children: ReactNode;
  variant?: Variant;
  external?: boolean;
  className?: string;
};

export function CTA({ href, children, variant = "primary", external, className }: Props) {
  const cls = cn(
    "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition duration-300",
    styles[variant],
    className,
  );

  const Icon = external ? ArrowUpRight : ArrowRight;
  const content = (
    <>
      {children}
      <Icon className="h-4 w-4" />
    </>
  );

  if (external) {
    return (
      <a className={cls} href={href} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }
  return (
    <Link className={cls} href={href}>
      {content}
    </Link>
  );
}
