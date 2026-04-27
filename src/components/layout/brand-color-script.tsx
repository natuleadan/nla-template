import { getBrandColor } from "@/lib/env";

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
