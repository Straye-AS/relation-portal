"use client";

import { useState } from "react";
import { addDays, format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OfferStatusBadge } from "@/components/offers/offer-status-badge";

interface SendOfferDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (sentDate: string, expirationDate: string) => void;
}

export function SendOfferDialog({
  open,
  onOpenChange,
  onConfirm,
}: SendOfferDialogProps) {
  const [sendDate, setSendDate] = useState<Date>(new Date());
  const [expirationDate, setExpirationDate] = useState<Date>(
    addDays(new Date(), 60)
  );

  const handleConfirm = () => {
    onConfirm(sendDate.toISOString(), expirationDate.toISOString());
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send tilbud</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <p className="text-sm text-muted-foreground">
            Dette vil sette tilbudet til fasen <OfferStatusBadge phase="sent" />
            . For å gjøre dette trenger vi å vite når tilbudet er sendt, og hvor
            lenge det er gyldig for kunden. Nedenfor ser du default verdiene for
            sendt dato og vedståelsesfrist. Disse kan du endre som du vil.
          </p>
          <div className="grid gap-2">
            <Label htmlFor="sent-date">Sendt dato</Label>
            <Input
              id="sent-date"
              type="date"
              value={sendDate ? format(sendDate, "yyyy-MM-dd") : ""}
              onChange={(e) => {
                if (e.target.value) {
                  const date = new Date(e.target.value);
                  setSendDate(date);
                  setExpirationDate(addDays(date, 60));
                }
              }}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="expiration-date">Vedståelsesfrist (60 dager)</Label>
            <Input
              id="expiration-date"
              type="date"
              value={expirationDate ? format(expirationDate, "yyyy-MM-dd") : ""}
              onChange={(e) => {
                if (e.target.value) {
                  setExpirationDate(new Date(e.target.value));
                }
              }}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Avbryt
          </Button>
          <Button
            className="bg-purple-600 text-white hover:bg-purple-700"
            onClick={handleConfirm}
          >
            Bekreft og send
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
