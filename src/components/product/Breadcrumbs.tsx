import { Fragment } from "react";
import { Link } from "react-router-dom";

export interface BreadcrumbItem {
  name: string;
  to?: string;
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <Fragment key={`${item.name}-${i}`}>
              {i > 0 && (
                <li aria-hidden="true" className="text-muted-foreground/60">
                  /
                </li>
              )}
              <li>
                {item.to && !isLast ? (
                  <Link to={item.to} className="hover:text-foreground">
                    {item.name}
                  </Link>
                ) : (
                  <span aria-current={isLast ? "page" : undefined} className={isLast ? "font-medium text-foreground" : ""}>
                    {item.name}
                  </span>
                )}
              </li>
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}