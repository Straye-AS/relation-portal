"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { useCustomers } from "@/hooks/useCustomers";
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
import Link from "next/link";
import { Plus, Eye } from "lucide-react";

export default function CustomersPage() {
  const { data: customers, isLoading } = useCustomers();

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Kunder</h1>
            <p className="text-muted-foreground">
              Oversikt over alle kunder og deres aktivitet
            </p>
          </div>
          <Link href="/customers/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Ny kunde
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <TableSkeleton rows={10} columns={6} />
        ) : !customers || customers.length === 0 ? (
          <div className="text-center py-12 border rounded-lg bg-muted/20">
            <p className="text-muted-foreground">Ingen kunder funnet</p>
            <Link href="/customers/new">
              <Button className="mt-4">Opprett din første kunde</Button>
            </Link>
          </div>
        ) : (
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Navn</TableHead>
                  <TableHead>Org.nr</TableHead>
                  <TableHead>Kontaktperson</TableHead>
                  <TableHead>E-post</TableHead>
                  <TableHead>By</TableHead>
                  <TableHead>Aktive tilbud</TableHead>
                  <TableHead>Total verdi</TableHead>
                  <TableHead className="text-right">Handling</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">
                      {customer.name}
                    </TableCell>
                    <TableCell>{customer.orgNumber}</TableCell>
                    <TableCell>{customer.contactPerson || "-"}</TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.city || "-"}</TableCell>
                    <TableCell>{customer.activeOffers || 0}</TableCell>
                    <TableCell>
                      {customer.totalValue
                        ? new Intl.NumberFormat("nb-NO", {
                            style: "currency",
                            currency: "NOK",
                            maximumFractionDigits: 0,
                          }).format(customer.totalValue)
                        : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/customers/${customer.id}`}>
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
