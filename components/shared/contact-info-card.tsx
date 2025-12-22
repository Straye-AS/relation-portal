"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InlineEdit } from "@/components/ui/inline-edit";
import { Mail, Phone, Globe, MapPin } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

interface ContactInfoCardProps {
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
  postalCode?: string;
  city?: string;
  country?: string;
  createdAt?: string;
  createdByName?: string;
  updatedAt?: string;
  updatedByName?: string;
  onUpdateEmail?: (email: string) => Promise<void>;
  onUpdatePhone?: (phone: string) => Promise<void>;
  onUpdateWebsite?: (website: string) => Promise<void>;
  onUpdateAddress?: (address: string) => Promise<void>;
  onUpdatePostalCode?: (postalCode: string) => Promise<void>;
  onUpdateCity?: (city: string) => Promise<void>;
}

export function ContactInfoCard({
  email,
  phone,
  website,
  address,
  postalCode,
  city,
  country,
  createdAt,
  createdByName,
  updatedAt,
  updatedByName,
  onUpdateEmail,
  onUpdatePhone,
  onUpdateWebsite,
  onUpdateAddress,
  onUpdatePostalCode,
  onUpdateCity,
}: ContactInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Kontaktinfo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
            <Mail className="h-4 w-4 text-foreground" />
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <p className="text-sm font-medium leading-none">E-post</p>
            <InlineEdit
              value={email || ""}
              className="-ml-1 h-auto p-0 px-1 text-sm text-muted-foreground hover:bg-transparent"
              type="email"
              placeholder="Legg til e-post"
              onSave={async (value) => {
                const emailValue = String(value);
                if (
                  emailValue &&
                  !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)
                ) {
                  toast.error("Ugyldig e-postadresse");
                  throw new Error("Invalid email");
                }
                await onUpdateEmail?.(emailValue);
              }}
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
            <Phone className="h-4 w-4 text-foreground" />
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <p className="text-sm font-medium leading-none">Telefon</p>
            <InlineEdit
              value={phone || ""}
              className="-ml-1 h-auto p-0 px-1 text-sm text-muted-foreground hover:bg-transparent"
              type="tel"
              placeholder="Legg til telefon"
              onSave={async (value) => {
                const phoneValue = String(value);
                if (phoneValue && !/^[\d\s+\-()]+$/.test(phoneValue)) {
                  toast.error("Ugyldig telefonnummer");
                  throw new Error("Invalid phone");
                }
                await onUpdatePhone?.(phoneValue);
              }}
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
            <Globe className="h-4 w-4 text-foreground" />
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <p className="text-sm font-medium leading-none">Nettside</p>
            <InlineEdit
              value={website || ""}
              className="-ml-1 h-auto p-0 px-1 text-sm text-muted-foreground hover:bg-transparent"
              placeholder="Legg til nettside"
              onSave={async (value) => {
                await onUpdateWebsite?.(String(value));
              }}
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
            <MapPin className="h-4 w-4 text-foreground" />
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <p className="text-sm font-medium leading-none">Adresse</p>
            <div className="flex flex-col gap-1 text-sm text-muted-foreground">
              <InlineEdit
                value={address || ""}
                className="-ml-1 h-auto p-0 px-1 hover:bg-transparent"
                placeholder="Gateadresse"
                onSave={async (value) => {
                  await onUpdateAddress?.(String(value));
                }}
              />
              <div className="flex gap-2">
                <InlineEdit
                  value={postalCode || ""}
                  className="-ml-1 h-auto p-0 px-1 hover:bg-transparent"
                  editClassName="w-48"
                  placeholder="Postnr"
                  onSave={async (value) => {
                    await onUpdatePostalCode?.(String(value));
                  }}
                />
                <InlineEdit
                  value={city || ""}
                  className="-ml-1 h-auto flex-1 p-0 px-1 hover:bg-transparent"
                  placeholder="Sted"
                  onSave={async (value) => {
                    await onUpdateCity?.(String(value));
                  }}
                />
              </div>
              {country && country !== "Norge" && (
                <span className="text-sm text-muted-foreground">{country}</span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 border-t bg-muted/30 px-6 py-4 text-xs text-muted-foreground">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-28 shrink-0">Opprettet av</span>
            {createdByName ?? (
              <Badge variant="secondary" className="h-4 px-1 text-[10px]">
                System
              </Badge>
            )}
          </div>
          <span>
            {createdAt
              ? format(new Date(createdAt), "dd.MM.yyyy HH:mm")
              : "Ukjent"}
          </span>
        </div>
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-28 shrink-0">Sist oppdatert av</span>
            {updatedByName ?? (
              <Badge variant="secondary" className="h-4 px-1 text-[10px]">
                System
              </Badge>
            )}
          </div>
          <span>
            {updatedAt
              ? format(new Date(updatedAt), "dd.MM.yyyy HH:mm")
              : "Ukjent"}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
