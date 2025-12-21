"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface OfferNotesCardProps {
  notes?: string;
}

export function OfferNotesCard({ notes }: OfferNotesCardProps) {
  if (!notes) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notater</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{notes}</p>
      </CardContent>
    </Card>
  );
}
