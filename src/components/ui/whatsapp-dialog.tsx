"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { IconBrandWhatsapp, IconCheck, IconChevronDown } from "@tabler/icons-react";
import { countryCodes, type CountryCode } from "@/lib/config/data/country-codes";
import { ui } from "@/lib/config/site";
import notificationService from "@/lib/modules/notification";
import { getSavedPhone, savePhone } from "@/lib/modules/cookies/client";
import type { WhatsAppOptions } from "@/components/whatsapp-provider";

const t = ui.whatsapp;

interface WhatsAppDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  options: WhatsAppOptions | null;
  defaultCountryCode?: string;
}

export function WhatsAppDialog({
  open,
  onOpenChange,
  options,
  defaultCountryCode,
}: WhatsAppDialogProps) {
  const [countryCode, setCountryCode] = useState<CountryCode>(() =>
    countryCodes.find((c) => c.code === (defaultCountryCode || "EC")) || countryCodes[0],
  );
  const [phoneNumber, setPhoneNumber] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [codeOpen, setCodeOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      setSent(false);
      setPhoneNumber("");
      setSending(false);
      setCodeOpen(false);
      setCountryCode(countryCodes.find((c) => c.code === (defaultCountryCode || "EC")) || countryCodes[0]);
    }
  }, [open, defaultCountryCode]);

  useEffect(() => {
    if (!defaultCountryCode) {
      const fromLocale = Intl.DateTimeFormat().resolvedOptions().locale?.split("-")[1]?.toUpperCase();
      if (fromLocale) {
        const found = countryCodes.find((c) => c.code === fromLocale);
        if (found) setCountryCode(found);
      }
    }
  }, [defaultCountryCode]);

  useEffect(() => {
    if (open) {
      const saved = getSavedPhone();
      if (saved) {
        const digits = saved.replace(/\D/g, "").replace(/^0+/, "");
        setPhoneNumber(digits);
      }
    }
  }, [open]);

  const rawDigits = phoneNumber.replace(/\D/g, "");
  const normalDigits = rawDigits.replace(/^0+/, "");
  const strippedDigits = rawDigits.startsWith(countryCode.dial) && rawDigits.length > countryCode.dial.length
    ? rawDigits.slice(countryCode.dial.length).replace(/^0+/, "")
    : normalDigits;
  const digits = strippedDigits.length === countryCode.digits ? strippedDigits : normalDigits;
  const fullNumber = `+${countryCode.dial}${digits}`;
  const isValid = digits.length === countryCode.digits;

  const handleSend = async () => {
    if (!isValid || !options) return;

    setSending(true);
    try {
      const res = await fetch("/api/v1/whatsapp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: fullNumber,
          message: options.message,
          productId: options.productId,
          productName: options.productName,
        }),
      });

      if (res.ok) {
        setSent(true);
        savePhone(fullNumber);
        notificationService.success(t.notification.success);
        options.onSuccess?.();
      } else {
        const body = await res.json().catch(() => ({}));
        const msg = res.status === 429 ? t.notification.rateLimit : t.notification.error;
        notificationService.error(body.error || msg);
      }
    } catch {
      notificationService.error(t.notification.error);
    } finally {
      setSending(false);
    }
  };

  const handleCodeSelect = (code: string) => {
    const country = countryCodes.find((c) => c.code === code);
    if (country) {
      setCountryCode(country);
      setCodeOpen(false);
    }
  };

  const handleRetry = () => {
    setSent(false);
    setPhoneNumber("");
  };

  if (sent) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.sent.title}</DialogTitle>
            <DialogDescription>{t.sent.description}</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-3 py-6">
            <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
              <IconBrandWhatsapp className="size-6 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground text-center">{t.sent.message}</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleRetry}>
              {t.sent.retry}
            </Button>
            <Button onClick={() => onOpenChange(false)}>
              {t.sent.close}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={(val) => { if (!sending) onOpenChange(val); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{options?.title || t.dialog.title}</DialogTitle>
          <DialogDescription>{t.dialog.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="flex gap-2">
              <Popover open={codeOpen} onOpenChange={setCodeOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={codeOpen}
                  className="w-40 shrink-0 justify-between gap-1 h-8"
                >
                  <span className="mr-1">{countryCode.flag}</span>
                  <span>+{countryCode.dial}</span>
                  <IconChevronDown className="size-3 shrink-0 text-muted-foreground" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-72 p-0" align="start">
                <Command>
                  <CommandInput placeholder={t.dialog.searchCountry} />
                  <CommandList>
                    <CommandEmpty>{t.dialog.countryNotFound}</CommandEmpty>
                    <CommandGroup>
                      {countryCodes.map((country) => (
                        <CommandItem
                          key={country.code}
                          value={`${country.name} ${country.dial}`}
                          onSelect={() => handleCodeSelect(country.code)}
                        >
                          <span className="mr-2">{country.flag}</span>
                          <span className="flex-1">{country.name}</span>
                          <span className="text-muted-foreground">+{country.dial}</span>
                          {countryCode.code === country.code && (
                            <IconCheck className="ml-2 size-4 text-primary" />
                          )}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            <Input
              placeholder={t.dialog.phonePlaceholder}
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9]/g, ""))}
              className="flex-1"
              type="tel"
              autoComplete="tel"
              disabled={sending}
            />
            </div>

          <p className="text-xs text-muted-foreground">{t.dialog.hint}</p>

          {options?.showPreview && options?.message && (
            <div className="rounded-lg bg-muted p-3">
              <p className="text-xs font-medium text-muted-foreground mb-1">{t.dialog.previewLabel}</p>
              <p className="text-sm whitespace-pre-wrap break-words">
                {options.message}
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={sending}
          >
            {t.dialog.cancel}
          </Button>
          <Button
            onClick={handleSend}
            disabled={!isValid || sending}
            className="gap-2"
          >
            {sending ? (
              <>{t.dialog.sending}</>
            ) : (
              <>
                <IconBrandWhatsapp className="size-4" />
                {t.dialog.send}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
