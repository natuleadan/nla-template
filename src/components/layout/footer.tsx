"use client";

import Link from "next/link";
import {
  IconMail,
  IconBrandInstagram,
  IconBrandFacebook,
  IconBrandTwitter,
  IconBrandYoutube,
} from "@tabler/icons-react";
import { Copyright } from "./copyright";
import { FooterDynamicCards } from "./footer-dynamic-cards";
import { brand } from "@/lib/config/site";
import { useLang } from "@/lib/locale/context";
import { getConfig } from "@/lib/locale/config";

export function Footer() {
  const lang = useLang();
  const cfg = getConfig(lang);
  const { nav, ui, brand: brandText } = cfg;
  const l = (href: string) => (href === "/" ? `/${lang}` : `/${lang}${href}`);

  const empresaCol = nav.footer.columns.find(
    (c) => c.title === "Empresa" || c.title === "Company",
  );

  const socialLinks: { href: string; label: string; icon: React.ReactNode }[] =
    [];
  if (brand.socialEmail)
    socialLinks.push({
      href: `mailto:${brand.socialEmail}`,
      label: ui.social.correo,
      icon: <IconMail className="size-5" />,
    });
  if (brand.socialInstagram)
    socialLinks.push({
      href: `https://instagram.com/${brand.socialInstagram}`,
      label: ui.social.instagram,
      icon: <IconBrandInstagram className="size-5" />,
    });
  if (brand.socialFacebook)
    socialLinks.push({
      href: `https://facebook.com/${brand.socialFacebook}`,
      label: ui.social.facebook,
      icon: <IconBrandFacebook className="size-5" />,
    });
  if (brand.socialTwitter)
    socialLinks.push({
      href: `https://x.com/${brand.socialTwitter}`,
      label: ui.social.twitter,
      icon: <IconBrandTwitter className="size-5" />,
    });
  if (brand.socialYoutube)
    socialLinks.push({
      href: `https://youtube.com/${brand.socialYoutube}`,
      label: ui.social.youtube,
      icon: <IconBrandYoutube className="size-5" />,
    });

  return (
    <footer className="border-t bg-muted/30">
      <div className="py-12 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          <div>
            <Link href={`/${lang}`} className="text-2xl font-bold">
              {brand.name}
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">
              {brandText.description}
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
                      href={l(link.href)}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors line-clamp-1"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
        <div className="mt-4 pt-4 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
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
