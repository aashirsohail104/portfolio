import { Link } from "react-router-dom";

export function EmptyState({
  title,
  message,
  actionHref,
  actionLabel,
}: {
  title: string;
  message: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-card px-6 py-16 text-center">
      <div className="grid h-12 w-12 place-items-center rounded-full bg-muted text-muted-foreground" aria-hidden="true">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.3-4.3M8 11h6M11 8v6" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="max-w-sm text-sm text-muted-foreground">{message}</p>
      {actionHref && actionLabel && (
        <Link
          to={actionHref}
          className="mt-1 inline-flex h-10 items-center justify-center rounded-md border border-input bg-transparent px-4 text-sm font-medium transition-colors hover:bg-muted"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}