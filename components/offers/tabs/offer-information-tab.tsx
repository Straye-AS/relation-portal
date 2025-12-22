"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";

export function OfferInformationTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5" />
          Informasjon
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Info className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">Kommer snart</h3>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Her vil du kunne se og redigere detaljert informasjon om tilbudet.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
