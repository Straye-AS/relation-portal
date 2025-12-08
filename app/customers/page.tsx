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
import type { DomainCustomerDTO } from "@/lib/.generated/data-contracts";

export default function CustomersPage() {
  const { data, isLoading } = useCustomers();

  // Extract customers from paginated response
  const customers: DomainCustomerDTO[] = data?.data ?? [];

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
        ) : customers.length === 0 ? (
          <div className="rounded-lg border bg-muted/20 py-12 text-center">
            <p className="text-muted-foreground">Ingen kunder funnet</p>
            <Link href="/customers/new">
              <Button className="mt-4">Opprett din første kunde</Button>
            </Link>
          </div>
        ) : (
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Navn</TableHead>
                  <TableHead>Org.nr</TableHead>
                  <TableHead>E-post</TableHead>
                  <TableHead>By</TableHead>
                  <TableHead className="text-right">Handling</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">
                      {customer.name}
                    </TableCell>
                    <TableCell>{customer.orgNumber ?? "-"}</TableCell>
                    <TableCell>{customer.email ?? "-"}</TableCell>
                    <TableCell>{customer.city ?? "-"}</TableCell>
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

        {/* Pagination info */}
        {data && (
          <div className="text-center text-sm text-muted-foreground">
            Viser {customers.length} av {data.total ?? customers.length} kunder
          </div>
        )}
      </div>
    </AppLayout>
  );
}
