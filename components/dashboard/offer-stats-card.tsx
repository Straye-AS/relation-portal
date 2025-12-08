"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, CheckCircle, XCircle, Archive } from "lucide-react";

interface OfferStatsCardProps {
  activeOffers: number;
  wonOffers: number;
  lostOffers: number;
  totalOffers: number;
}

export function OfferStatsCard({
  activeOffers,
  wonOffers,
  lostOffers,
  totalOffers,
}: OfferStatsCardProps) {
  const stats = [
    {
      label: "Aktive",
      value: activeOffers,
      icon: FileText,
      color: "text-blue-500",
    },
    {
      label: "Vunnet",
      value: wonOffers,
      icon: CheckCircle,
      color: "text-green-500",
    },
    {
      label: "Tapt",
      value: lostOffers,
      icon: XCircle,
      color: "text-red-500",
    },
    {
      label: "Totalt",
      value: totalOffers,
      icon: Archive,
      color: "text-purple-500",
    },
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Tilbudsstatistikk</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex items-center space-x-2 rounded-lg border p-2"
            >
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  {stat.label}
                </p>
                <p className="text-lg font-bold">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
