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
import {
  IconBrandWhatsapp,
  IconCheck,
  IconChevronDown,
} from "@tabler/icons-react";
import type { CountryCode } from "@/lib/config/data/country-codes.en";
import { useLang } from "@/hooks/use-lang";
import { getConfig } from "@/lib/locale/config";
import notificationService from "@/hooks/use-notification";
import { getSavedPhone, savePhone } from "@/lib/internal/cookies/client";
import { getWhatsappNumber } from "@/lib/env.public";
import type { WhatsAppOptions } from "@/hooks/use-whatsapp";
import { whatsappSendAction } from "@/lib/actions/whatsapp-send";

interface WhatsAppDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  options: WhatsAppOptions | null;
  defaultCountryCode?: string;
  ycloudEnabled?: boolean;
}

export function WhatsAppDialog({
  open,
  onOpenChange,
  options,
  defaultCountryCode,
  ycloudEnabled = false,
}: WhatsAppDialogProps) {
  const lang = useLang();
  const { countryCodes } = getConfig(lang);
  const cfg = getConfig(lang);
  const t = cfg.ui.whatsapp;
  const [countryCode, setCountryCode] = useState<CountryCode>(
    () =>
      countryCodes.find((c) => c.code === (defaultCountryCode || "EC")) ||
      countryCodes[0],
  );
  const [phoneNumber, setPhoneNumber] = useState("");
  const [codeOpen, setCodeOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      setPhoneNumber("");
      setCodeOpen(false);
      setCountryCode(
        countryCodes.find((c) => c.code === (defaultCountryCode || "EC")) ||
          countryCodes[0],
      );
    }
  }, [open, defaultCountryCode, countryCodes]);

  useEffect(() => {
    if (!defaultCountryCode) {
      const fromLocale = Intl.DateTimeFormat()
        .resolvedOptions()
        .locale?.split("-")[1]
        ?.toUpperCase();
      if (fromLocale) {
        const found = countryCodes.find((c) => c.code === fromLocale);
        if (found) setCountryCode(found);
      }
    }
  }, [defaultCountryCode, countryCodes]);

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
  const strippedDigits =
    rawDigits.startsWith(countryCode.dial) &&
    rawDigits.length > countryCode.dial.length
      ? rawDigits.slice(countryCode.dial.length).replace(/^0+/, "")
      : normalDigits;
  const digits =
    strippedDigits.length === countryCode.digits
      ? strippedDigits
      : normalDigits;
  const fullNumber = `+${countryCode.dial}${digits}`;
  const isValid = digits.length === countryCode.digits;

  const handleSend = async () => {
    if (!isValid || !options) return;

    if (!ycloudEnabled) {
      const phone = getWhatsappNumber();
      const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(options.message)}`;
      window.open(waUrl, "_blank");
      onOpenChange(false);
      options.onSuccess?.();
      return;
    }

    onOpenChange(false);
    const result = await whatsappSendAction({
      to: fullNumber,
      message: options.message,
      productId: options.productId,
      productName: options.productName,
    });

    if (result.success) {
      savePhone(fullNumber);
      notificationService.success(t.notification.success);
      options.onSuccess?.();
    } else {
      notificationService.error(result.error || t.notification.error);
    }
  };

  const handleCodeSelect = (code: string) => {
    const country = countryCodes.find((c) => c.code === code);
    if (country) {
      setCountryCode(country);
      setCodeOpen(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        if (!val) onOpenChange(val);
      }}
    >
      <DialogContent className="sm:max-w-md" closeLabel={cfg.ui.navbar.closeAria}>
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
                          <span className="text-muted-foreground">
                            +{country.dial}
                          </span>
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

            <Input name="whatsapp-phone"
              placeholder={t.dialog.phonePlaceholder}
              value={phoneNumber}
              onChange={(e) =>
                setPhoneNumber(e.target.value.replace(/[^0-9]/g, ""))
              }
              className="flex-1"
              type="tel"
              autoComplete="tel"
            />
          </div>

          <p className="text-xs text-muted-foreground">{t.dialog.hint}</p>

          {options?.showPreview && options?.message && (
            <div className="rounded-lg bg-muted p-3">
              <p className="text-xs font-medium text-muted-foreground mb-1">
                {t.dialog.previewLabel}
              </p>
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
          >
            {t.dialog.cancel}
          </Button>
          <Button
            onClick={handleSend}
            disabled={!isValid}
            className="gap-2"
          >
            <IconBrandWhatsapp className="size-4" />
            {t.dialog.send}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
