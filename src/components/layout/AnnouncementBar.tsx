import { siteInfo } from "./siteInfo";

export function AnnouncementBar() {
  return (
    <div className="relative overflow-hidden overflow-x-hidden bg-brand text-brand-foreground">
      <div className="flex w-max animate-marquee whitespace-nowrap">
        <MarqueeGroup />
        <MarqueeGroup hidden />
      </div>
    </div>
  );
}

function MarqueeGroup({ hidden = false }: { hidden?: boolean }) {
  const linkTabIndex = hidden ? -1 : undefined;
  return (
    <div aria-hidden={hidden || undefined} className="flex shrink-0 items-center py-1.5 text-sm">
      <span className="flex items-center gap-2 px-6">
        <span aria-hidden="true" className="size-1.5 rounded-full bg-neon" />
        <span className="font-medium">Solar inverters &amp; lithium batteries now in stock</span>
      </span>
      <MarqueeSep />
      <span className="flex items-center gap-2 px-6">
        <ClockIcon />
        {siteInfo.workingHours}
      </span>
      <MarqueeSep />
      <a href={siteInfo.telHref} tabIndex={linkTabIndex} className="flex items-center gap-2 px-6 transition-opacity hover:opacity-80">
        <PhoneIcon />
        {siteInfo.phone}
      </a>
      <MarqueeSep />
      <a
        href={siteInfo.waHref}
        target="_blank"
        rel="noreferrer"
        tabIndex={linkTabIndex}
        className="flex items-center gap-2 px-6 font-semibold transition-opacity hover:opacity-80"
      >
        <ChatIcon />
        Chat on WhatsApp
      </a>
      <MarqueeSep />
      <span className="flex items-center gap-2 px-6">
        <TruckIcon />
        {siteInfo.delivery}
      </span>
    </div>
  );
}

function MarqueeSep() {
  return (
    <span aria-hidden="true" className="text-brand-foreground/50">
      •
    </span>
  );
}

function ClockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.4 2.1L8.1 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c1 .3 1.9.5 2.9.6a2 2 0 0 1 1.6 2Z" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.6 8.6 0 0 1-3.5-.7L3 21l1.8-5.5A8.4 8.4 0 1 1 21 11.5Z" />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M14 17h-9m-2-8h12v8m4-1h2v-4l-3-3h-3" />
      <circle cx="7" cy="17" r="2" />
      <circle cx="17" cy="17" r="2" />
    </svg>
  );
}
