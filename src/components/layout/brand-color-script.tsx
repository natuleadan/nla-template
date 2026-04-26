import { getBrandColor } from "@/lib/config/env";

export function BrandColorScript() {
  const brand = getBrandColor();
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `document.documentElement.dataset.brand=${JSON.stringify(brand)}`,
      }}
    />
  );
}
