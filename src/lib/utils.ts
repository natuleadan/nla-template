export function safeJsonLd(data: unknown): string {
  if (typeof data === "undefined" || data === null) return "";
  try {
    return JSON.stringify(data, (key, value) => {
      if (typeof value === "undefined" || value === null) return undefined;
      return value;
    })
      .replace(/<\/script>/gi, "<\\/script>")
      .replace(/<!--/g, "<\\!--");
  } catch {
    return "";
  }
}
