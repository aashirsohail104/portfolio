export const BASE_URL = "https://anas.electronics";

export interface PageMeta {
  title: string;
  description: string;
  canonicalPath?: string;
  ogImage?: string;
  ogType?: string;
  noIndex?: boolean;
}

function upsert(
  headSelector: string,
  tag: string,
  attrs: Record<string, string>
): Element {
  const existing = document.head.querySelector(headSelector);
  const el = existing ?? document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    el.setAttribute(key, value);
  }
  if (!existing) {
    document.head.appendChild(el);
  }
  return el;
}

export function setPageMeta(meta: PageMeta): void {
  document.title = meta.title;

  upsert('meta[name="description"]', "meta", {
    name: "description",
    content: meta.description,
  });
  upsert('meta[property="og:title"]', "meta", {
    property: "og:title",
    content: meta.title,
  });
  upsert('meta[property="og:description"]', "meta", {
    property: "og:description",
    content: meta.description,
  });

  const canonicalPath = meta.canonicalPath ?? "";
  const canonicalUrl = BASE_URL + canonicalPath;

  upsert('link[rel="canonical"]', "link", {
    rel: "canonical",
    href: canonicalUrl,
  });
  upsert('meta[property="og:url"]', "meta", {
    property: "og:url",
    content: canonicalUrl,
  });
  upsert('meta[property="og:image"]', "meta", {
    property: "og:image",
    content: meta.ogImage ?? `${BASE_URL}/og-image.png`,
  });
  upsert('meta[property="og:type"]', "meta", {
    property: "og:type",
    content: meta.ogType ?? "website",
  });

  if (meta.noIndex) {
    upsert('meta[name="robots"]', "meta", {
      name: "robots",
      content: "noindex, nofollow",
    });
  } else {
    document.head.querySelector('meta[name="robots"]')?.remove();
  }
}

function upsertJsonLd(id: string, data: object): void {
  const scriptId = `jsonld-${id}`;
  const existing = document.getElementById(scriptId) as HTMLScriptElement | null;
  const script = existing ?? document.createElement("script");
  script.type = "application/ld+json";
  script.id = scriptId;
  script.textContent = JSON.stringify(data);
  if (!existing) document.head.appendChild(script);
}

export function setJsonLd(blocks: { id: string; data: object }[]): void {
  for (const block of blocks) {
    upsertJsonLd(block.id, block.data);
  }
}