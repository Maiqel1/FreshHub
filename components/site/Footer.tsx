import { business, contact, externalOrderLinks } from "@/lib/links";

export function Footer() {
  return (
    <footer id="location" className="scroll-mt-[132px] mt-[72px] border-t border-divider">
      <div className="mx-auto grid max-w-[1180px] gap-9 px-5 pt-14 pb-6 md:grid-cols-[1.2fr_1fr_1fr] md:px-10">
        <div>
          <h4 className="mb-3.5 text-[13px] uppercase tracking-[0.08em] text-orange">
            Location &amp; hours
          </h4>
          <p
            className={`mb-1.5 text-[14px] ${
              business.addressPending ? "italic text-text-mute/70" : "text-text-mute"
            }`}
          >
            {business.address}
          </p>
          <p
            className={`mb-1.5 text-[14px] ${
              business.addressPending ? "italic text-text-mute/70" : "text-text-mute"
            }`}
          >
            {business.hours}
          </p>
        </div>

        <div>
          <h4 className="mb-3.5 text-[13px] uppercase tracking-[0.08em] text-orange">
            Contact
          </h4>
          <p className="mb-1.5 text-[14px] text-text-mute">Call: {contact.phone}</p>
          <p className="mb-1.5 text-[14px]">
            <a
              className="text-gold hover:text-orange"
              href={`https://wa.me/${contact.whatsappNumber}`}
            >
              Order on WhatsApp
            </a>
          </p>
          <p className="mb-1.5 text-[14px]">
            <a className="text-gold hover:text-orange" href={`mailto:${contact.email}`}>
              {contact.email}
            </a>
          </p>
        </div>

        <div>
          <h4 className="mb-3.5 text-[13px] uppercase tracking-[0.08em] text-orange">
            Also on
          </h4>
          <p className="mb-1.5 text-[14px]">
            <a
              className="text-gold hover:text-orange"
              href={externalOrderLinks.glovo}
              target="_blank"
              rel="noopener noreferrer"
            >
              Order on Glovo
            </a>
          </p>
          <p className="mb-1.5 text-[14px]">
            <a
              className="text-gold hover:text-orange"
              href={externalOrderLinks.chowdeck}
              target="_blank"
              rel="noopener noreferrer"
            >
              Order on Chowdeck
            </a>
          </p>
        </div>
      </div>

      <div className="mx-auto flex max-w-[1180px] flex-wrap justify-between gap-2 px-5 pb-10 pt-5 text-[12px] text-text-mute md:px-10">
        <span>© 2026 FreshHub. Fresh food, made to order.</span>
        <a className="text-text-mute hover:text-gold" href="/admin">
          Staff login
        </a>
      </div>
    </footer>
  );
}
