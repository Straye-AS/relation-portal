"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { useOffers } from "@/hooks/useOffers";
import { Button } from "@/components/ui/button";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Plus, Eye } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { nb } from "date-fns/locale";

const phaseColors: Record<string, string> = {
  Lead: "bg-gray-500",
  Qualification: "bg-blue-500",
  Proposal: "bg-yellow-500",
  Sent: "bg-orange-500",
  Negotiation: "bg-purple-500",
  Won: "bg-green-500",
  Lost: "bg-red-500",
};

export default function OffersPage() {
  const { data: offers, isLoading } = useOffers();

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Tilbud</h1>
            <p className="text-muted-foreground">
              Administrer alle tilbud og deres status
            </p>
          </div>
          <Link href="/offers/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nytt tilbud
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <TableSkeleton rows={10} columns={6} />
        ) : !offers || offers.length === 0 ? (
          <div className="text-center py-12 border rounded-lg bg-muted/20">
            <p className="text-muted-foreground">Ingen tilbud funnet</p>
            <Link href="/offers/new">
              <Button className="mt-4">Opprett ditt første tilbud</Button>
            </Link>
          </div>
        ) : (
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tittel</TableHead>
                  <TableHead>Kunde</TableHead>
                  <TableHead>Fase</TableHead>
                  <TableHead>Verdi</TableHead>
                  <TableHead>Sannsynlighet</TableHead>
                  <TableHead>Ansvarlig</TableHead>
                  <TableHead>Oppdatert</TableHead>
                  <TableHead className="text-right">Handling</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {offers.map((offer) => (
                  <TableRow key={offer.id}>
                    <TableCell className="font-medium">{offer.title}</TableCell>
                    <TableCell>{offer.customerName}</TableCell>
                    <TableCell>
                      <Badge
                        className={phaseColors[offer.phase]}
                        variant="secondary"
                      >
                        {offer.phase}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Intl.NumberFormat("nb-NO", {
                        style: "currency",
                        currency: "NOK",
                        maximumFractionDigits: 0,
                      }).format(offer.value)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-full max-w-[100px] bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${offer.probability}%` }}
                          />
                        </div>
                        <span className="text-sm">{offer.probability}%</span>
                      </div>
                    </TableCell>
                    <TableCell>{offer.responsibleUserName}</TableCell>
                    <TableCell>
                      {formatDistanceToNow(new Date(offer.updatedAt), {
                        addSuffix: true,
                        locale: nb,
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/offers/${offer.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
