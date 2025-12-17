"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatRelativeDate } from "@/lib/utils";
import type { DomainOfferDTO } from "@/lib/.generated/data-contracts";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { FileCheck } from "lucide-react"; // Using FileCheck for orders
import { phaseLabels, phaseColors } from "./pipeline-overview";

interface RecentOrdersCardProps {
  orders: DomainOfferDTO[];
}

export function RecentOrdersCard({ orders }: RecentOrdersCardProps) {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Siste ordre</CardTitle>
        <FileCheck className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4 pt-4">
          {orders.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              Ingen ordre funnet
            </p>
          ) : (
            <div className="divide-y">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="grid grid-cols-12 items-center gap-4 rounded-lg px-2 py-3 text-sm transition-colors hover:bg-muted/50"
                >
                  <div className="col-span-12 flex min-w-0 flex-col justify-center sm:col-span-5">
                    <Link
                      href={`/offers/${order.id}`}
                      className="block truncate font-medium hover:underline"
                    >
                      {order.title}
                    </Link>
                    <span className="truncate text-xs text-muted-foreground">
                      {order.customerName}
                    </span>
                  </div>
                  <div className="col-span-6 flex items-center sm:col-span-3">
                    <Badge
                      variant="outline"
                      className={`max-w-full truncate border ${order.phase ? phaseColors[order.phase] : ""}`}
                    >
                      {order.phase
                        ? phaseLabels[order.phase] || order.phase
                        : "-"}
                    </Badge>
                  </div>
                  <div className="col-span-3 flex items-center justify-end font-medium sm:col-span-2">
                    {formatCurrency(order.value ?? 0)}
                  </div>
                  <div className="col-span-3 flex items-center justify-end text-xs text-muted-foreground sm:col-span-2">
                    {formatRelativeDate(order.updatedAt)}
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
