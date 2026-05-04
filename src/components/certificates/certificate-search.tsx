"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import {
  IconSearch,
  IconCertificate,
  IconClock,
  IconUser,
  IconCalendar,
  IconFileDescription,
  IconAlertCircle,
  IconCircleCheck,
  IconFileTypePdf,
  IconExternalLink,
} from "@tabler/icons-react";
import { verifyCertificates } from "@/lib/modules/certificates/actions";
import type { CertificateItem } from "@/lib/modules/certificates/schemas";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

type Status = "idle" | "loading" | "success" | "error";

interface CertificateData {
  name?: string;
  phone?: string;
  certificates?: CertificateItem[];
}

const typeOptions = [
  { value: "all", labelKey: "filterAll" },
  { value: "aprobacion", labelKey: "type_aprobacion" },
  { value: "asistencia", labelKey: "type_asistencia" },
  { value: "participacion", labelKey: "type_participacion" },
];

function ExpiryText({ expiryDate, labels }: { expiryDate: string | null; labels: Record<string, string> }) {
  if (!expiryDate) {
    return <span className="text-green-600 dark:text-green-400 text-sm font-medium">{labels.indefinite}</span>;
  }
  const now = new Date();
  const expiry = new Date(expiryDate);
  const expired = expiry < now;
  return (
    <span className={`text-sm font-medium ${expired ? "text-red-500" : "text-amber-600 dark:text-amber-400"}`}>
      {expired ? labels.expired : `${labels.expires}: ${expiryDate}`}
    </span>
  );
}

function CertificateCard({ cert, labels }: { cert: CertificateItem; labels: Record<string, string> }) {
  const typeLabel = labels[`type_${cert.type}`] || cert.type;

  return (
    <div className="rounded-lg border divide-y">
      <div className="px-4 py-3 space-y-2.5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5 min-w-0">
            <IconCertificate className="size-4 shrink-0 text-primary mt-0.5" />
            <div className="min-w-0">
              <h3 className="text-sm font-semibold leading-tight truncate">{cert.course}</h3>
              <p className="text-xs text-muted-foreground font-mono mt-px">{cert.code}</p>
            </div>
          </div>
          <Badge variant="outline" className="text-xs h-auto px-2 py-0.5 shrink-0">{typeLabel}</Badge>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <IconCalendar className="size-4 shrink-0" />
            {cert.startDate} → {cert.endDate}
          </span>
          <span className="flex items-center gap-1.5">
            <IconClock className="size-4 shrink-0" />
            {cert.hours}h
          </span>
          <span className="flex items-center gap-1.5 truncate">
            <IconUser className="size-4 shrink-0" />
            {cert.instructor}
          </span>
          <span className="flex items-center gap-1.5">
            <IconCertificate className="size-4 shrink-0" />
            <ExpiryText expiryDate={cert.expiryDate} labels={labels} />
          </span>
        </div>

        {cert.description && (
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <IconFileDescription className="size-4 shrink-0 mt-0.5" />
            <span className="truncate">{cert.description}</span>
          </div>
        )}
      </div>

      {cert.medias && (
        <a
          href={cert.medias}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-muted/50 transition-colors text-sm"
        >
          <IconFileTypePdf className="size-4 shrink-0 text-muted-foreground" />
          <span className="flex-1 truncate font-medium">
            {cert.medias.split("/").pop() || labels.defaultFilename}
          </span>
          <IconExternalLink className="size-4 shrink-0 text-muted-foreground" />
        </a>
      )}
    </div>
  );
}

export function CertificateSearch({
  labels,
}: {
  labels: Record<string, string>;
}) {
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [data, setData] = useState<CertificateData | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [filterType, setFilterType] = useState("all");

  const cleaned = phone.replace(/[^a-zA-Z0-9]/g, "");
  const isReady = cleaned.length >= 10;

  const handleSearch = async () => {
    if (!isReady) return;

    setStatus("loading");
    setData(null);
    setErrorMsg("");

    try {
      const result = await verifyCertificates(cleaned);

      if (result.success && result.data) {
        const d = result.data as CertificateData;
        if (!d.certificates || d.certificates.length === 0) {
          setErrorMsg(labels.notFound);
          setStatus("error");
        } else {
          setData(d);
          setStatus("success");
        }
      } else {
        setErrorMsg(result.code ? (labels[result.code] || labels.error) : labels.error);
        setStatus("error");
      }
    } catch {
      setErrorMsg(labels.error);
      setStatus("error");
    }
  };

  const filteredCerts = useMemo(() => {
    if (!data?.certificates) return [];
    if (filterType === "all") return data.certificates;
    return data.certificates.filter((c) => c.type === filterType);
  }, [data, filterType]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3">
        <Tooltip open={cleaned.length > 0 && !isReady}>
          <TooltipTrigger asChild>
            <Input name="certificate-id"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={labels.placeholder}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="sm:max-w-xs"
              aria-label={labels.placeholder}
            />
          </TooltipTrigger>
          <TooltipContent side="bottom" align="start">
            {labels.missing?.replace("{n}", String(10 - cleaned.length))}
          </TooltipContent>
        </Tooltip>
        <Button onClick={handleSearch} disabled={status === "loading" || !isReady} size="sm" className="gap-2 shrink-0" type="button">
          {status === "loading" ? (
            <Spinner className="size-4 mr-2" />
          ) : (
            <IconSearch className="size-4 mr-2" />
          )}
          {labels.button}
        </Button>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger name="certificate-type" className="sm:max-w-[180px] ml-auto">
            <SelectValue placeholder={labels.filterType} />
          </SelectTrigger>
          <SelectContent>
            {typeOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {labels[opt.labelKey] || opt.value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {status === "loading" && (
        <div className="flex flex-col items-center gap-3 py-12 text-muted-foreground">
          <Spinner className="size-6" />
          <p className="text-sm">{labels.loading}</p>
        </div>
      )}

      {status === "success" && data && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <IconCircleCheck className="size-5 text-primary" />
            <span className="font-semibold text-sm">
              {data.name} ({labels.resultsSummary?.replace("{count}", String(data.certificates?.length || 0))})
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCerts.map((cert) => (
              <CertificateCard key={cert.id} cert={cert} labels={labels} />
            ))}
          </div>

          {filteredCerts.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">
              {labels.noResults}
            </p>
          )}
        </div>
      )}

      {status === "error" && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-lg border text-sm">
          <IconAlertCircle className="size-5 text-muted-foreground shrink-0" />
          <span className="font-medium">{errorMsg}</span>
        </div>
      )}
    </div>
  );
}
