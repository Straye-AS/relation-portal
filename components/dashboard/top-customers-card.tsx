"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Customer } from "@/types";
import { Building2 } from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

interface TopCustomer extends Partial<Customer> {
  customerId?: string; // Add fallback for ID
  wonOfferCount?: number;
  wonOfferValue?: number;
  offerCount?: number; // Keeping for backward compatibility if needed, though prompt says "previously: all offers count"
  economicValue?: number; // Keeping for backward compatibility
  totalValue?: number; // Keeping for backward compatibility
}

interface TopCustomersCardProps {
  customers: TopCustomer[];
}

export function TopCustomersCard({ customers }: TopCustomersCardProps) {
  // Memoize sorted customers to prevent re-sorting on every render
  const sortedCustomers = useMemo(() => {
    return [...customers].sort((a, b) => {
      // Priority: wonOfferValue -> economicValue -> totalValue
      const valA = a.wonOfferValue ?? a.economicValue ?? a.totalValue ?? 0;
      const valB = b.wonOfferValue ?? b.economicValue ?? b.totalValue ?? 0;
      return valB - valA;
    });
  }, [customers]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Topp Kunder</CardTitle>
        <Building2 className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sortedCustomers.length === 0 && (
            <p className="py-4 text-center text-sm text-muted-foreground">
              Ingen kunder
            </p>
          )}
          {sortedCustomers.map((customer, index) => {
            const customerId = customer.id || customer.customerId;
            if (!customerId) return null;

            return (
              <Link
                key={customerId}
                href={`/customers/${customerId}`}
                className="flex h-[88px] items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
              >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <Badge variant="outline" className="text-xs">
                    {index + 1}
                  </Badge>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-semibold">
                      {customer.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {customer.wonOfferCount ??
                        customer.offerCount ??
                        customer.activeOffers ??
                        0}{" "}
                      vunnet
                    </p>
                  </div>
                </div>
                <div className="ml-4 text-right">
                  <p className="text-sm font-bold">
                    {formatCurrency(
                      customer.wonOfferValue ??
                        customer.economicValue ??
                        customer.totalValue ??
                        0
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Vunnede prosjekter
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
