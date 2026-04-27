import { cn } from "@/lib/config/utils";
import DOMPurify from "isomorphic-dompurify";

interface ProseProps {
  html: string;
  className?: string;
}

export function Prose({ html, className }: ProseProps) {
  const sanitized = DOMPurify.sanitize(html);

  return (
    <div
      className={cn("prose-html space-y-3", className)}
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
}
