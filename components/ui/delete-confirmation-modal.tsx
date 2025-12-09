"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, AlertTriangle } from "lucide-react";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  title: string;
  description: string;
  itemTitle?: string;
  isLoading?: boolean;
}

export function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  itemTitle,
  isLoading,
}: DeleteConfirmationModalProps) {
  const [code, setCode] = useState("");
  const [inputCode, setInputCode] = useState("");
  const [error, setError] = useState(false);

  // Generate random 4-digit code when modal opens
  useEffect(() => {
    if (isOpen) {
      const randomCode = Math.floor(1000 + Math.random() * 9000).toString();
      setCode(randomCode);
      setInputCode("");
      setError(false);
    }
  }, [isOpen]);

  const handleConfirm = async () => {
    if (inputCode !== code) {
      setError(true);
      return;
    }
    await onConfirm();
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && inputCode === code) {
      handleConfirm();
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !open && !isLoading && onClose()}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-red-100 p-3 text-red-600 dark:bg-red-900/30 dark:text-red-400">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription className="pt-2">
                {description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {itemTitle && (
          <div className="my-2 rounded-md bg-muted p-3 text-sm font-medium">
            {itemTitle}
          </div>
        )}

        <div className="space-y-4 py-4">
          <div className="rounded-md border border-orange-200 bg-orange-50 p-4 dark:border-orange-800/30 dark:bg-orange-900/10">
            <p className="text-sm font-medium text-orange-800 dark:text-orange-300">
              Sikkerhetskontroll: Skriv inn koden for å bekrefte sletting.
            </p>
            <div className="mt-3 flex justify-center">
              <span className="select-none rounded bg-white px-4 py-1.5 text-xl font-bold tracking-widest text-slate-900 shadow-sm dark:bg-slate-950 dark:text-slate-100">
                {code}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="verification-code">Skriv inn koden</Label>
            <Input
              id="verification-code"
              value={inputCode}
              onChange={(e) => {
                setInputCode(e.target.value);
                if (error) setError(false);
              }}
              onKeyDown={handleKeyDown}
              placeholder={code}
              className={error ? "border-red-500 ring-red-500" : ""}
              autoComplete="off"
            />
            {error && (
              <p className="text-sm text-red-500">
                Koden stemmer ikke. Prøv igjen.
              </p>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2 sm:justify-end">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isLoading}
          >
            Avbryt
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={inputCode !== code || isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Slett
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
