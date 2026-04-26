import Link from "next/link";
import { IconMail, IconBrandInstagram, IconBrandFacebook, IconBrandTwitter, IconBrandYoutube } from "@tabler/icons-react";
import { Copyright } from "./copyright";
import { FooterDynamicCards } from "./footer-dynamic-cards";
import { brand, nav } from "@/lib/config/site";
import {
  getSocialEmail,
  getSocialInstagram,
  getSocialFacebook,
  getSocialTwitter,
  getSocialYoutube,
} from "@/lib/env.public";

export function Footer() {
  const empresaCol = nav.footer.columns.find((c) => c.title === "Empresa");

  const email = getSocialEmail();
  const instagram = getSocialInstagram();
  const facebook = getSocialFacebook();
  const twitter = getSocialTwitter();
  const youtube = getSocialYoutube();

  const socialLinks: { href: string; label: string; icon: React.ReactNode }[] = [];
  if (email) socialLinks.push({ href: `mailto:${email}`, label: "Correo", icon: <IconMail className="size-5" /> });
  if (instagram) socialLinks.push({ href: `https://instagram.com/${instagram}`, label: "Instagram", icon: <IconBrandInstagram className="size-5" /> });
  if (facebook) socialLinks.push({ href: `https://facebook.com/${facebook}`, label: "Facebook", icon: <IconBrandFacebook className="size-5" /> });
  if (twitter) socialLinks.push({ href: `https://x.com/${twitter}`, label: "Twitter", icon: <IconBrandTwitter className="size-5" /> });
  if (youtube) socialLinks.push({ href: `https://youtube.com/${youtube}`, label: "YouTube", icon: <IconBrandYoutube className="size-5" /> });

  return (
    <footer className="border-t bg-muted/30">
      <div className="py-12 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          <div>
            <Link href="/" className="text-2xl font-bold">
              {brand.name}
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">
              {brand.description}
            </p>
          </div>

          <FooterDynamicCards />

          {empresaCol && (
            <nav aria-label={empresaCol.title}>
              <h3 className="mb-4 font-semibold">{empresaCol.title}</h3>
              <ul className="space-y-2">
                {empresaCol.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>

        <div className="mt-12 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
          <Copyright brandName={brand.name} />
          {socialLinks.length > 0 && (
            <div className="flex gap-2">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-9 w-9"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
