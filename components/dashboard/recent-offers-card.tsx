"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatRelativeDate } from "@/lib/utils";
import type { DomainOfferDTO } from "@/lib/.generated/data-contracts";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { FileText } from "lucide-react";
import { phaseLabels, phaseColors } from "./pipeline-overview";

interface RecentOffersCardProps {
  offers: DomainOfferDTO[];
}

export function RecentOffersCard({ offers }: RecentOffersCardProps) {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Siste tilbud</CardTitle>
        <FileText className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4 pt-4">
          {offers.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              Ingen tilbud funnet
            </p>
          ) : (
            <div className="divide-y">
              {offers.map((offer) => (
                <div
                  key={offer.id}
                  className="grid grid-cols-12 items-center gap-4 rounded-lg px-2 py-3 text-sm transition-colors hover:bg-muted/50"
                >
                  <div className="col-span-12 flex min-w-0 flex-col justify-center sm:col-span-5">
                    <Link
                      href={`/offers/${offer.id}`}
                      className="block truncate font-medium hover:underline"
                    >
                      {offer.title}
                    </Link>
                    <span className="truncate text-xs text-muted-foreground">
                      {offer.customerName}
                    </span>
                  </div>
                  <div className="col-span-6 flex items-center sm:col-span-3">
                    <Badge
                      variant="outline"
                      className={`max-w-full truncate border ${offer.phase ? phaseColors[offer.phase] : ""}`}
                    >
                      {offer.phase
                        ? phaseLabels[offer.phase] || offer.phase
                        : "-"}
                    </Badge>
                  </div>
                  <div className="col-span-3 flex items-center justify-end font-medium sm:col-span-2">
                    {formatCurrency(offer.value ?? 0)}
                  </div>
                  <div className="col-span-3 flex items-center justify-end text-xs text-muted-foreground sm:col-span-2">
                    {formatRelativeDate(offer.updatedAt)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
