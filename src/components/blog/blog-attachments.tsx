import {
  IconFile,
  IconFileTypePdf,
  IconFileSpreadsheet,
  IconFileTypeDoc,
  IconFileZip,
  IconMusic,
  IconVideo,
  IconExternalLink,
  IconPaperclip,
} from "@tabler/icons-react";

interface Attachment {
  name: string;
  url: string;
  size?: string;
}

interface BlogAttachmentsProps {
  attachments: Attachment[];
  columns?: 1 | 3;
  title?: string;
}

const iconMap: Record<string, typeof IconFile> = {
  pdf: IconFileTypePdf,
  xlsx: IconFileSpreadsheet,
  xls: IconFileSpreadsheet,
  csv: IconFileSpreadsheet,
  doc: IconFileTypeDoc,
  docx: IconFileTypeDoc,
  zip: IconFileZip,
  rar: IconFileZip,
  "7z": IconFileZip,
  mp3: IconMusic,
  wav: IconMusic,
  ogg: IconMusic,
  m4a: IconMusic,
  flac: IconMusic,
  mp4: IconVideo,
  avi: IconVideo,
  mkv: IconVideo,
  webm: IconVideo,
  mov: IconVideo,
};

function getExtension(url: string): string {
  return url.split(".").pop()?.toLowerCase() || "";
}

export function BlogAttachments({
  attachments,
  columns = 1,
  title = "Adjuntos",
}: BlogAttachmentsProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <IconPaperclip className="size-4 text-muted-foreground shrink-0" />
        <span className="text-sm text-muted-foreground">{title}</span>
      </div>
      {columns === 3 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {attachments.map((att, i) => {
            const ext = getExtension(att.url);
            const Icon = iconMap[ext] || IconFile;
            return (
              <a
                key={i}
                href={att.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-lg border p-4 hover:bg-muted/50 transition-colors"
              >
                <Icon className="size-5 shrink-0 text-muted-foreground" />
                <span className="flex-1 text-sm font-medium truncate">
                  {att.name}
                </span>
                {att.size && (
                  <span className="text-xs text-muted-foreground shrink-0">
                    {att.size}
                  </span>
                )}
                <IconExternalLink className="size-4 shrink-0 text-muted-foreground" />
              </a>
            );
          })}
        </div>
      ) : (
        <div className="divide-y rounded-lg border">
          {attachments.map((att, i) => {
            const ext = getExtension(att.url);
            const Icon = iconMap[ext] || IconFile;
            return (
              <a
                key={i}
                href={att.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors"
              >
                <Icon className="size-5 shrink-0 text-muted-foreground" />
                <span className="flex-1 text-sm font-medium truncate">
                  {att.name}
                </span>
                {att.size && (
                  <span className="text-xs text-muted-foreground shrink-0">
                    {att.size}
                  </span>
                )}
                <IconExternalLink className="size-4 shrink-0 text-muted-foreground" />
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
