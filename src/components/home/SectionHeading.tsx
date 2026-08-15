import type { ReactNode } from "react";

export function SectionHeading({
  id,
  title,
  action,
}: {
  id: string;
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <h2 id={id} className="text-xl font-bold text-foreground sm:text-2xl">
        {title}
      </h2>
      {action}
    </div>
  );
}
