import { type HTMLAttributes, type ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLElement> {
  as?: "div" | "article" | "section" | "li";
  children: ReactNode;
}

export function Card({ as: Tag = "div", className = "", children, ...props }: CardProps) {
  return (
    <Tag
      className={`rounded-lg border border-border bg-card text-card-foreground shadow-card ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
}

export function CardHeader({ className = "", children }: { className?: string; children: ReactNode }) {
  return <div className={`flex flex-col gap-1 p-5 ${className}`}>{children}</div>;
}

export function CardTitle({ className = "", children }: { className?: string; children: ReactNode }) {
  return <h3 className={`text-lg font-semibold text-foreground ${className}`}>{children}</h3>;
}

export function CardDescription({ className = "", children }: { className?: string; children: ReactNode }) {
  return <p className={`text-sm text-muted-foreground ${className}`}>{children}</p>;
}

export function CardContent({ className = "", children }: { className?: string; children: ReactNode }) {
  return <div className={`p-5 pt-0 ${className}`}>{children}</div>;
}

export function CardFooter({ className = "", children }: { className?: string; children: ReactNode }) {
  return <div className={`flex items-center gap-2 p-5 pt-0 ${className}`}>{children}</div>;
}