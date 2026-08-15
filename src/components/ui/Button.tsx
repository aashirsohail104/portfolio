import { type ButtonHTMLAttributes, type ReactNode } from "react";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "destructive";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary: "bg-brand text-brand-foreground hover:opacity-90",
  secondary: "bg-accent text-accent-foreground hover:bg-accent/70",
  outline: "border border-input bg-transparent hover:bg-muted",
  ghost: "hover:bg-muted",
  destructive: "bg-destructive text-white hover:opacity-90",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  as_child?: boolean;
  children?: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  as_child = false,
  ...props
}: ButtonProps) {
  if (as_child && props.children) {
    const child = props.children as ReactNode;
    return <ButtonShell variant={variant} size={size} className={className} as_child>{child}</ButtonShell>;
  }
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  );
}

function ButtonShell({
  variant,
  size,
  className,
  as_child,
  children,
}: {
  variant: Variant;
  size: Size;
  className: string;
  as_child: boolean;
  children: ReactNode;
}) {
  // When used as_child, the single child element receives the button styles.
  const child = as_child && typeof children === "object" ? (children as ReactNode) : children;
  return (
    <span
      className={`inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all active:scale-[0.98] focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-ring ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {child}
    </span>
  );
}