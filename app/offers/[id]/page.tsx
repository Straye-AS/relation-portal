"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { useOffer } from "@/hooks/useOffers";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CardSkeleton } from "@/components/ui/card-skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { ArrowLeft, Edit } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { nb } from "date-fns/locale";
import { use } from "react";

export default function OfferDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const { data: offer, isLoading } = useOffer(resolvedParams.id);

  if (isLoading) {
    return (
      <AppLayout>
        <div className="space-y-6">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </AppLayout>
    );
  }

  if (!offer) {
    return (
      <AppLayout>
        <div className="py-12 text-center">
          <p className="text-muted-foreground">Tilbud ikke funnet</p>
          <Link href="/offers">
            <Button className="mt-4">Tilbake til tilbud</Button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  const items = offer.items ?? [];
  const totalCost = items.reduce((sum, item) => sum + (item.cost ?? 0), 0);
  const totalRevenue = items.reduce(
    (sum, item) => sum + (item.revenue ?? 0),
    0
  );
  const overallMargin = ((totalRevenue - totalCost) / totalRevenue) * 100;

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/offers">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">{offer.title}</h1>
              <p className="text-muted-foreground">
                Opprettet{" "}
                {formatDistanceToNow(
                  new Date(offer.createdAt ?? new Date().toISOString()),
                  {
                    addSuffix: true,
                    locale: nb,
                  }
                )}
              </p>
            </div>
          </div>
          <Button>
            <Edit className="mr-2 h-4 w-4" />
            Rediger
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Tilbudsinfo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Kunde</p>
                <Link
                  href={`/customers/${offer.customerId}`}
                  className="font-medium hover:underline"
                >
                  {offer.customerName}
                </Link>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Fase</p>
                <Badge className="mt-1">{offer.phase}</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="font-medium">{offer.status}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ansvarlig</p>
                <p className="font-medium">{offer.responsibleUserName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Sannsynlighet</p>
                <div className="mt-1 flex items-center gap-2">
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-primary transition-all"
                      style={{ width: `${offer.probability ?? 0}%` }}
                    />
                  </div>
                  <span className="font-medium">{offer.probability ?? 0}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Økonomi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Total verdi</p>
                <p className="text-2xl font-bold">
                  {new Intl.NumberFormat("nb-NO", {
                    style: "currency",
                    currency: "NOK",
                    maximumFractionDigits: 0,
                  }).format(offer.value ?? 0)}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total kostnad</p>
                  <p className="font-bold text-red-600">
                    {new Intl.NumberFormat("nb-NO", {
                      style: "currency",
                      currency: "NOK",
                      maximumFractionDigits: 0,
                    }).format(totalCost)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total inntekt</p>
                  <p className="font-bold text-green-600">
                    {new Intl.NumberFormat("nb-NO", {
                      style: "currency",
                      currency: "NOK",
                      maximumFractionDigits: 0,
                    }).format(totalRevenue)}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Samlet margin</p>
                <p className="text-xl font-bold text-primary">
                  {overallMargin.toFixed(1)}%
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {offer.description && (
          <Card>
            <CardHeader>
              <CardTitle>Beskrivelse</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{offer.description}</p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Disipliner</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Disiplin</TableHead>
                  <TableHead>Mengde</TableHead>
                  <TableHead className="text-right">Kostnad</TableHead>
                  <TableHead className="text-right">Inntekt</TableHead>
                  <TableHead className="text-right">Margin</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      {item.discipline}
                    </TableCell>
                    <TableCell>
                      {item.quantity} {item.unit}
                    </TableCell>
                    <TableCell className="text-right">
                      {new Intl.NumberFormat("nb-NO", {
                        style: "currency",
                        currency: "NOK",
                        maximumFractionDigits: 0,
                      }).format(item.cost ?? 0)}
                    </TableCell>
                    <TableCell className="text-right">
                      {new Intl.NumberFormat("nb-NO", {
                        style: "currency",
                        currency: "NOK",
                        maximumFractionDigits: 0,
                      }).format(item.revenue ?? 0)}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {(item.margin ?? 0).toFixed(1)}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {offer.notes && (
          <Card>
            <CardHeader>
              <CardTitle>Notater</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{offer.notes}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
