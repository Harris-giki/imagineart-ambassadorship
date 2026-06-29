import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type Variant = "brand" | "ghost" | "white" | "muted";
type Size = "md" | "lg";

interface CommonProps {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
}

const base =
  "inline-flex items-center justify-center gap-2 rounded-[10px] font-sans font-medium tracking-[-0.005em] " +
  "transition-opacity duration-200 ease-out cursor-pointer border-0 active:translate-y-px";

const sizes: Record<Size, string> = {
  md: "h-10 px-[18px] text-[14px]",
  lg: "h-12 px-[22px] text-[15px]",
};

const variants: Record<Variant, string> = {
  brand:
    "bg-content-primary text-white transition-colors hover:bg-black",
  ghost:
    "bg-transparent text-content-primary border border-border-secondary transition-colors hover:bg-black/[0.04] hover:border-border-tertiary",
  white:
    "bg-white text-content-primary border border-black/[0.08] shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition-colors hover:bg-white/90",
  muted:
    "bg-[#EDEDED] text-content-primary transition-colors hover:bg-[#E3E3E3]",
};

export function buttonClass({
  variant = "brand",
  size = "md",
  className = "",
}: { variant?: Variant; size?: Size; className?: string } = {}) {
  return `${base} ${sizes[size]} ${variants[variant]} ${className}`.trim();
}

type AnchorProps = CommonProps &
  Omit<ComponentPropsWithoutRef<typeof Link>, "className" | "children">;

export function ButtonLink({
  variant,
  size,
  className,
  children,
  href,
  ...rest
}: AnchorProps) {
  return (
    <Link
      href={href}
      className={buttonClass({ variant, size, className })}
      {...rest}
    >
      {children}
    </Link>
  );
}

type ButtonProps = CommonProps &
  Omit<ComponentPropsWithoutRef<"button">, "className" | "children">;

export function Button({
  variant,
  size,
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={buttonClass({ variant, size, className })}
      {...rest}
    >
      {children}
    </button>
  );
}
