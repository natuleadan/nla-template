import { cn } from "@/lib/config/utils";

interface ProseProps {
  html: string;
  className?: string;
}

export function Prose({ html, className }: ProseProps) {
  return (
    <div
      className={cn("prose-html space-y-3", className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
