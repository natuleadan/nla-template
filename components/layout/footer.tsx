import Link from "next/link";
import { Button } from "@/components/ui/button";
import { IconBrandInstagram, IconBrandTwitter, IconBrandYoutube } from "@tabler/icons-react";
import { Copyright } from "./copyright";
import { brand, nav } from "@/lib/config/site";

export function Footer() {
  const [storeCol, companyCol, legalCol] = nav.footer.columns;

  return (
    <footer className="border-t bg-muted/30">
      <div className="py-12 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid gap-8 md:grid-cols-5">
          <div className="md:col-span-2 order-2 md:order-none">
            <Link href="/" className="text-2xl font-bold">
              {brand.name}
            </Link>
            <p className="mt-3 text-sm text-muted-foreground max-w-xs">
              {brand.description}
            </p>
            <div className="mt-4 flex gap-2">
              <Button variant="ghost" size="icon">
                <IconBrandInstagram className="size-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <IconBrandTwitter className="size-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <IconBrandYoutube className="size-5" />
              </Button>
            </div>
            <Copyright brandName={brand.name} />
          </div>

          <div className="order-1 md:order-none col-span-1 md:col-span-1">
            <h3 className="mb-4 font-semibold">{storeCol.title}</h3>
            <ul className="space-y-2">
              {storeCol.links.map((link) => (
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
          </div>

          <div className="order-1 md:order-none">
            <h3 className="mb-4 font-semibold">{companyCol.title}</h3>
            <ul className="space-y-2">
              {companyCol.links.map((link) => (
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
          </div>

          <div className="order-1 md:order-none">
            <h3 className="mb-4 font-semibold">{legalCol.title}</h3>
            <ul className="space-y-2">
              {legalCol.links.map((link) => (
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
          </div>
        </div>
      </div>
    </footer>
  );
}
