import { Clock, MapPin, MessageCircle, Phone, Truck } from "lucide-react";

import { ContactForm } from "@/components/contact/ContactForm";
import { siteInfo } from "@/components/layout/siteInfo";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { usePageMeta } from "@/lib/seo/usePageMeta";

interface ContactRow {
  icon: typeof MapPin;
  label: string;
  value: string;
  href?: string;
  external?: boolean;
}

function formatWhatsApp(phoneE164: string): string {
  if (phoneE164.length === 12) {
    return `+${phoneE164.slice(0, 2)} ${phoneE164.slice(2, 5)} ${phoneE164.slice(5)}`;
  }
  return `+${phoneE164}`;
}

const CONTACT_ROWS: ContactRow[] = [
  { icon: MapPin, label: "Address", value: siteInfo.address },
  { icon: Phone, label: "Phone", value: siteInfo.phone, href: siteInfo.telHref },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: formatWhatsApp(siteInfo.phoneE164),
    href: siteInfo.waHref,
    external: true,
  },
  { icon: Clock, label: "Working hours", value: siteInfo.workingHours },
  { icon: Truck, label: "Delivery", value: siteInfo.delivery },
];

export default function ContactPage() {
  usePageMeta({
    title: "Contact — Anas Electronics",
    description:
      "Reach Anas Electronics by phone, WhatsApp or in person at Korangi No. 6 Market, Karachi — delivery available across Pakistan.",
    canonicalPath: "/contact",
  });

  return (
    <div className="container-page py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold text-foreground">Contact Anas Electronics</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Questions about chargers, inverters or delivery? Call, WhatsApp or send a message and
          we&apos;ll get back to you.
        </p>
      </header>

      <div className="grid items-start gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Get in touch</CardTitle>
            <CardDescription>Real answers from the Anas Electronics team.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-5">
              {CONTACT_ROWS.map((row) => {
                const Icon = row.icon;
                return (
                  <li key={row.label} className="flex items-start gap-3">
                    <span
                      aria-hidden="true"
                      className="grid size-10 shrink-0 place-items-center rounded-full bg-muted text-brand"
                    >
                      <Icon className="size-5" />
                    </span>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        {row.label}
                      </p>
                      {row.href ? (
                        <a
                          href={row.href}
                          className="mt-0.5 block text-sm font-medium text-foreground transition-colors hover:text-brand"
                          {...(row.external ? { target: "_blank", rel: "noreferrer" } : {})}
                        >
                          {row.value}
                        </a>
                      ) : (
                        <p className="mt-0.5 text-sm font-medium text-foreground">{row.value}</p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>

            <a
              href={siteInfo.waHref}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-brand px-6 text-base font-semibold text-brand-foreground shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover sm:w-auto"
            >
              <MessageCircle className="size-5" aria-hidden="true" />
              Chat on WhatsApp
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Send us a message</CardTitle>
            <CardDescription>Fill in the form and we&apos;ll reply by phone or WhatsApp.</CardDescription>
          </CardHeader>
          <CardContent>
            <ContactForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
