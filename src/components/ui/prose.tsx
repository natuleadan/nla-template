import { cn } from "@/lib/utils";
import xss from "xss";

interface ProseProps {
  html: string;
  className?: string;
}

export function Prose({ html, className }: ProseProps) {
  const sanitized = xss(html);

  return (
    <div
      className={cn("prose-html space-y-3", className)}
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
}
