import siteData from "@data/site.json";

interface SiteContact {
  name?: string;
  address?: string;
  phone?: string;
  whatsapp?: string;
  workingHours?: string;
}

export interface SiteInfo {
  name: string;
  address: string;
  phone: string;
  phoneE164: string;
  telHref: string;
  waHref: string;
  workingHours: string;
  delivery: string;
}

const site = siteData as unknown as { brand?: string; contact?: SiteContact; delivery?: string };

export const siteInfo: SiteInfo = (() => {
  const phone = site.contact?.phone ?? "0312 3581962";
  const digits = (site.contact?.whatsapp ?? phone).replace(/\D/g, "");
  return {
    name: site.contact?.name ?? site.brand ?? "Anas Electronics",
    address: site.contact?.address ?? "",
    phone,
    phoneE164: digits,
    telHref: `tel:+${digits}`,
    waHref: `https://wa.me/${digits}`,
    workingHours: site.contact?.workingHours ?? "Mon - Sun 11:00AM to 07:00PM | Friday OFF",
    delivery: site.delivery ?? "Available across Pakistan",
  };
})();
