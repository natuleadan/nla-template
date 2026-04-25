export function BrandColorScript() {
  const brand = process.env.NEXT_PUBLIC_BRAND_COLOR || "nla";
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `document.documentElement.dataset.brand=${JSON.stringify(brand)}`,
      }}
    />
  );
}
