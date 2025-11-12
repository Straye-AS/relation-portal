"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Customer } from "@/types";
import { Building2 } from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

interface TopCustomersCardProps {
    customers: Customer[];
}

export function TopCustomersCard({ customers }: TopCustomersCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Topp Kunder</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {customers.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-4">
                            Ingen kunder
                        </p>
                    )}
                    {customers.map((customer, index) => (
                        <Link
                            key={customer.id}
                            href={`/customers/${customer.id}`}
                            className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                        >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <Badge variant="outline" className="text-xs">
                                    {index + 1}
                                </Badge>
                                <div className="min-w-0 flex-1">
                                    <h3 className="font-semibold text-sm truncate">{customer.name}</h3>
                                    <p className="text-xs text-muted-foreground">
                                        {customer.activeOffers || 0} aktive tilbud
                                    </p>
                                </div>
                            </div>
                            <div className="text-right ml-4">
                                <p className="text-sm font-bold">{formatCurrency(customer.totalValue || 0)}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

