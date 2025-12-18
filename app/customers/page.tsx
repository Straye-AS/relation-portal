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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye,
  LayoutGrid,
  List as ListIcon,
  MapPin,
  Building2,
  Mail,
  Phone,
  MoreHorizontal,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
} from "lucide-react";

import type { DomainCustomerDTO } from "@/lib/.generated/data-contracts";
import { useState } from "react";
import { AddCustomerModal } from "@/components/customers/add-customer-modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NewBadge } from "@/components/ui/new-badge";
import { PaginationControls } from "@/components/pagination-controls";
import { Badge } from "@/components/ui/badge";

type ViewMode = "list" | "card";

export default function CustomersPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const [sortBy, setSortBy] = useState<string>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const { data, isLoading } = useCustomers({
    page,
    pageSize,
    sortBy: sortBy as any,
    sortOrder: sortOrder as any,
  });

  const [viewMode, setViewMode] = useState<ViewMode>("list");

  // Extract customers from paginated response
  const customers: DomainCustomerDTO[] = data?.data ?? [];

  const handleSort = (key: string) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(key);
      setSortOrder("asc");
    }
  };

  const SortButton = ({ column, label }: { column: string; label: string }) => {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-8 data-[state=open]:bg-accent"
        onClick={() => handleSort(column)}
      >
        <span>{label}</span>
        {sortBy === column ? (
          sortOrder === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : (
            <ArrowDown className="ml-2 h-4 w-4" />
          )
        ) : (
          <ArrowUpDown className="ml-2 h-4 w-4 opacity-30" />
        )}
      </Button>
    );
  };

  return (
    <AppLayout disableScroll>
      <div className="flex h-full flex-col">
        <div className="flex-none space-y-4 border-b bg-background px-4 py-4 md:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Kunder{" "}
                <span className="text-sm text-muted-foreground">
                  ({data?.total ?? 0})
                </span>
              </h1>
              <p className="text-muted-foreground">
                Oversikt over alle kunder og deres informasjon
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center rounded-lg border bg-background p-1">
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setViewMode("list")}
                >
                  <ListIcon className="h-4 w-4" />
                  <span className="sr-only">Liste visning</span>
                </Button>
                <Button
                  variant={viewMode === "card" ? "secondary" : "ghost"}
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setViewMode("card")}
                >
                  <LayoutGrid className="h-4 w-4" />
                  <span className="sr-only">Kort visning</span>
                </Button>
              </div>
              <AddCustomerModal />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8">
          <div className="space-y-6">
            {isLoading ? (
              viewMode === "list" ? (
                <TableSkeleton rows={10} columns={6} />
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-[200px] animate-pulse rounded-lg border bg-muted/20"
                    />
                  ))}
                </div>
              )
            ) : customers.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center animate-in fade-in-50">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <Building2 className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">Ingen kunder</h3>
                <p className="mb-4 mt-2 max-w-sm text-sm text-muted-foreground">
                  Du har ikke lagt til noen kunder enda. Opprett din første
                  kunde for å komme i gang.
                </p>
                <AddCustomerModal />
              </div>
            ) : (
              <div className="duration-500 animate-in fade-in-50">
                {viewMode === "list" ? (
                  <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>
                            <SortButton column="name" label="Kunde" />
                          </TableHead>
                          <TableHead>Kontaktinfo</TableHead>
                          <TableHead>
                            <SortButton column="city" label="Lokasjon" />
                          </TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Handling</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {customers.map((customer) => (
                          <TableRow
                            key={customer.id}
                            className="cursor-pointer hover:bg-muted/50"
                            onClick={() =>
                              router.push(`/customers/${customer.id}`)
                            }
                          >
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-9 w-9">
                                  <AvatarImage
                                    src={`https://avatar.vercel.sh/${customer.name}`}
                                    alt={customer.name}
                                  />
                                  <AvatarFallback>
                                    {customer.name
                                      ?.substring(0, 2)
                                      .toUpperCase() ?? "??"}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="font-medium">
                                  <div>
                                    {customer.name}
                                    <NewBadge createdAt={customer.createdAt} />
                                  </div>
                                  <Badge
                                    variant="outline"
                                    className="font-normal"
                                  >
                                    {customer.orgNumber
                                      ? `Org.nr: ${customer.orgNumber}`
                                      : "Privatperson"}
                                  </Badge>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col gap-1 text-sm">
                                {customer.email && (
                                  <div className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground">
                                    <Mail className="h-3 w-3" />
                                    <a
                                      href={`mailto:${customer.email}`}
                                      className="hover:underline"
                                    >
                                      {customer.email}
                                    </a>
                                  </div>
                                )}
                                {customer.phone && (
                                  <div className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground">
                                    <Phone className="h-3 w-3" />
                                    <a
                                      href={`tel:${customer.phone}`}
                                      className="hover:underline"
                                    >
                                      {customer.phone}
                                    </a>
                                  </div>
                                )}
                              </div>
                            </TableCell>
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
                              {/* Placeholder for status or active projects/offers count */}
                              <div className="flex items-center gap-2">
                                <span className="inline-flex items-center rounded-md border border-transparent bg-secondary px-2 py-0.5 text-xs font-semibold text-secondary-foreground transition-colors hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                                  Aktiv
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    className="h-8 w-8 p-0"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <span className="sr-only">Åpne meny</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>
                                    Handlinger
                                  </DropdownMenuLabel>
                                  <DropdownMenuItem asChild>
                                    <Link
                                      href={`/customers/${customer.id}`}
                                      className="cursor-pointer"
                                    >
                                      <Eye className="mr-2 h-4 w-4" />
                                      Se detaljer
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  {/* Add edit/delete actions here later */}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {customers.map((customer) => (
                      <Card
                        key={customer.id}
                        className="flex flex-col overflow-hidden transition-all duration-200 hover:shadow-md"
                      >
                        <CardHeader className="flex flex-row items-center gap-4 bg-muted/40 pb-4">
                          <Avatar className="h-12 w-12 border-2 border-background">
                            <AvatarImage
                              src={`https://avatar.vercel.sh/${customer.name}`}
                              alt={customer.name}
                            />
                            <AvatarFallback className="text-lg font-bold">
                              {customer.name?.substring(0, 2).toUpperCase() ??
                                "??"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="grid gap-1">
                            <CardTitle className="text-lg leading-none">
                              <Link
                                href={`/customers/${customer.id}`}
                                className="decoration-primary underline-offset-4 hover:underline"
                              >
                                {customer.name}
                                <NewBadge createdAt={customer.createdAt} />
                              </Link>
                            </CardTitle>
                            <CardDescription>
                              {customer.orgNumber ?? "Privatperson"}
                            </CardDescription>
                          </div>
                        </CardHeader>
                        <CardContent className="flex flex-1 flex-col gap-4 p-6">
                          <div className="grid gap-2 text-sm">
                            {customer.email && (
                              <div className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground">
                                <Mail className="h-4 w-4" />
                                <a
                                  href={`mailto:${customer.email}`}
                                  className="truncate hover:underline"
                                >
                                  {customer.email}
                                </a>
                              </div>
                            )}
                            {customer.phone && (
                              <div className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground">
                                <Phone className="h-4 w-4" />
                                <a
                                  href={`tel:${customer.phone}`}
                                  className="hover:underline"
                                >
                                  {customer.phone}
                                </a>
                              </div>
                            )}
                            {customer.city && (
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <MapPin className="h-4 w-4" />
                                <span className="truncate">
                                  {customer.address
                                    ? `${customer.address}, `
                                    : ""}
                                  {customer.postalCode} {customer.city}
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="mt-auto flex items-center justify-between border-t pt-4">
                            <span className="text-xs text-muted-foreground">
                              Opprettet{" "}
                              {customer.createdAt
                                ? new Date(
                                    customer.createdAt
                                  ).toLocaleDateString("nb-NO")
                                : "-"}
                            </span>
                            <Link href={`/customers/${customer.id}`}>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8"
                              >
                                Se detaljer
                              </Button>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Pagination info */}
            {data && customers.length > 0 && (
              <PaginationControls
                currentPage={page}
                totalPages={Math.ceil((data.total ?? 0) / pageSize)}
                onPageChange={setPage}
                pageSize={pageSize}
                totalCount={data.total ?? 0}
                entityName="kunder"
              />
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
