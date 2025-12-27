"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteOfferDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isDeleting?: boolean;
  isDraft?: boolean;
}

export function DeleteOfferDialog({
  open,
  onOpenChange,
  onConfirm,
  isDeleting,
  isDraft,
}: DeleteOfferDialogProps) {
  const itemLabel = isDraft ? "forespørselen" : "tilbudet";
  const buttonLabel = isDraft ? "Slett forespørsel" : "Slett tilbud";

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{buttonLabel}?</AlertDialogTitle>
          <AlertDialogDescription>
            Dette vil permanent slette {itemLabel} og all tilhørende data. Denne
            handlingen kan ikke angres.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Avbryt</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={isDeleting}
          >
            {isDeleting ? "Sletter..." : buttonLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
