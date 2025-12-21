"use client";

import { type KeyboardEvent } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NewBadge } from "@/components/ui/new-badge";
import { MapPin, Mail, Phone } from "lucide-react";
import type { DomainCustomerDTO } from "@/lib/.generated/data-contracts";

interface CustomerListTableProps {
  customers: DomainCustomerDTO[];
  onCustomerClick?: (customer: DomainCustomerDTO) => void;
  compact?: boolean;
}

export function CustomerListTable({
  customers,
  onCustomerClick,
  compact = false,
}: CustomerListTableProps) {
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Kunde</TableHead>
            {!compact && <TableHead>Kontaktinfo</TableHead>}
            <TableHead>Lokasjon</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => {
            const handleKeyDown = (e: KeyboardEvent<HTMLTableRowElement>) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onCustomerClick?.(customer);
              }
            };

            return (
              <TableRow
                key={customer.id}
                className="cursor-pointer hover:bg-muted/50 focus-visible:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                onClick={() => onCustomerClick?.(customer)}
                onKeyDown={handleKeyDown}
                tabIndex={0}
                role="link"
                aria-label={`Åpne kunde: ${customer.name}`}
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage
                        src={`https://avatar.vercel.sh/${customer.name}`}
                        alt={customer.name}
                      />
                      <AvatarFallback>
                        {customer.name?.substring(0, 2).toUpperCase() ?? "??"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="font-medium">
                      <div>
                        {customer.name}
                        <NewBadge createdAt={customer.createdAt} />
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {customer.orgNumber
                          ? `Org: ${customer.orgNumber}`
                          : "Privatperson"}
                      </div>
                    </div>
                  </div>
                </TableCell>
                {!compact && (
                  <TableCell>
                    <div className="flex flex-col gap-1 text-sm">
                      {customer.email && (
                        <div className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground">
                          <Mail className="h-3 w-3" />
                          <span className="truncate">{customer.email}</span>
                        </div>
                      )}
                      {customer.phone && (
                        <div className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground">
                          <Phone className="h-3 w-3" />
                          <span>{customer.phone}</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                )}
                <TableCell>
                  {customer.city ? (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>{customer.city}</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center rounded-md border border-transparent bg-secondary px-2 py-0.5 text-xs font-semibold text-secondary-foreground transition-colors hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                      Aktiv
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
