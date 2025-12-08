"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import type { DomainOfferDTO } from "@/lib/.generated/data-contracts";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { format } from "date-fns";
import { nb } from "date-fns/locale";

interface RecentOffersCardProps {
  offers: DomainOfferDTO[];
}

export function RecentOffersCard({ offers }: RecentOffersCardProps) {
  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="text-sm font-medium">Siste tilbud</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {offers.length === 0 ? (
            <p className="text-sm text-muted-foreground">Ingen tilbud funnet</p>
          ) : (
            <div className="divide-y">
              {offers.map((offer) => (
                <div
                  key={offer.id}
                  className="grid grid-cols-12 gap-4 rounded-lg px-2 py-3 text-sm transition-colors hover:bg-muted/50"
                >
                  <div className="col-span-4 flex flex-col justify-center">
                    <Link
                      href={`/offers/${offer.id}`}
                      className="truncate font-medium hover:underline"
                    >
                      {offer.title}
                    </Link>
                    <span className="truncate text-xs text-muted-foreground">
                      {offer.customerName}
                    </span>
                  </div>
                  <div className="col-span-3 flex items-center">
                    <Badge variant="outline" className="max-w-full truncate">
                      {offer.phase}
                    </Badge>
                  </div>
                  <div className="col-span-3 flex items-center font-medium">
                    {formatCurrency(offer.value ?? 0)}
                  </div>
                  <div className="col-span-2 flex items-center justify-end text-xs text-muted-foreground">
                    {offer.updatedAt
                      ? format(new Date(offer.updatedAt), "d. MMM", {
                          locale: nb,
                        })
                      : "-"}
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
