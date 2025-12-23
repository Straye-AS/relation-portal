"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { useSuppliers } from "@/hooks/useSuppliers";
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
  Truck,
  Mail,
  Phone,
  MoreHorizontal,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  Globe,
} from "lucide-react";

import type { DomainSupplierDTO } from "@/lib/.generated/data-contracts";
import { SortByEnum6, SortOrderEnum5 } from "@/lib/.generated/data-contracts";
import { SupplierStatusBadge } from "@/components/suppliers/supplier-status-badge";
import { useQueryParams } from "@/hooks/useQueryParams";

const AddSupplierModal = dynamic(
  () =>
    import("@/components/suppliers/add-supplier-modal").then(
      (mod) => mod.AddSupplierModal
    ),
  { ssr: false }
);
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

// URL parameter schema for suppliers page
const suppliersParamsSchema = {
  page: { type: "number" as const, default: 1 },
  sortBy: { type: "string" as const, default: "name" },
  sortOrder: { type: "string" as const, default: "asc" },
  viewMode: { type: "string" as const, default: "list" },
};

function SuppliersPageContent() {
  const router = useRouter();
  const { params, setParam, setParams } = useQueryParams(suppliersParamsSchema);

  const { page, sortBy, sortOrder, viewMode } = params;
  const pageSize = 20;

  // Map string values to enum types
  const sortByEnum = sortBy as SortByEnum6;
  const sortOrderEnum = sortOrder as SortOrderEnum5;

  const { data, isLoading } = useSuppliers({
    page,
    pageSize,
    sortBy: sortByEnum,
    sortOrder: sortOrderEnum,
  });

  const suppliers: DomainSupplierDTO[] = data?.data ?? [];

  const handleSort = (key: SortByEnum6) => {
    if (sortBy === key) {
      setParam(
        "sortOrder",
        sortOrder === SortOrderEnum5.Asc
          ? SortOrderEnum5.Desc
          : SortOrderEnum5.Asc
      );
    } else {
      setParams({ sortBy: key, sortOrder: SortOrderEnum5.Asc });
    }
  };

  const handlePageChange = (newPage: number) => {
    setParam("page", newPage);
  };

  const handleViewModeChange = (mode: ViewMode) => {
    setParam("viewMode", mode);
  };

  const SortButton = ({
    column,
    label,
  }: {
    column: SortByEnum6;
    label: string;
  }) => {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-8 data-[state=open]:bg-accent"
        onClick={() => handleSort(column)}
      >
        <span>{label}</span>
        {sortBy === column ? (
          sortOrder === SortOrderEnum5.Asc ? (
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
                Leverandorer{" "}
                <span className="text-sm text-muted-foreground">
                  ({data?.total ?? 0})
                </span>
              </h1>
              <p className="text-muted-foreground">
                Oversikt over alle leverandorer og deres informasjon
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center rounded-lg border bg-background p-1">
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => handleViewModeChange("list")}
                >
                  <ListIcon className="h-4 w-4" />
                  <span className="sr-only">Liste visning</span>
                </Button>
                <Button
                  variant={viewMode === "card" ? "secondary" : "ghost"}
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => handleViewModeChange("card")}
                >
                  <LayoutGrid className="h-4 w-4" />
                  <span className="sr-only">Kort visning</span>
                </Button>
              </div>
              <AddSupplierModal />
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
            ) : suppliers.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center animate-in fade-in-50">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <Truck className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">
                  Ingen leverandorer
                </h3>
                <p className="mb-4 mt-2 max-w-sm text-sm text-muted-foreground">
                  Du har ikke lagt til noen leverandorer enda. Opprett din
                  forste leverandor for a komme i gang.
                </p>
                <AddSupplierModal />
              </div>
            ) : (
              <div className="duration-500 animate-in fade-in-50">
                {viewMode === "list" ? (
                  <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>
                            <SortButton
                              column={SortByEnum6.Name}
                              label="Leverandor"
                            />
                          </TableHead>
                          <TableHead>Kontaktinfo</TableHead>
                          <TableHead>
                            <SortButton
                              column={SortByEnum6.City}
                              label="Lokasjon"
                            />
                          </TableHead>
                          <TableHead>
                            <SortButton
                              column={SortByEnum6.Category}
                              label="Kategori"
                            />
                          </TableHead>
                          <TableHead>
                            <SortButton
                              column={SortByEnum6.Status}
                              label="Status"
                            />
                          </TableHead>
                          <TableHead className="text-right">Handling</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {suppliers.map((supplier) => (
                          <TableRow
                            key={supplier.id}
                            className="cursor-pointer hover:bg-muted/50"
                            onClick={() =>
                              router.push(`/suppliers/${supplier.id}`)
                            }
                          >
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-9 w-9">
                                  <AvatarImage
                                    src={`https://avatar.vercel.sh/${supplier.name}`}
                                    alt={supplier.name}
                                  />
                                  <AvatarFallback>
                                    {supplier.name
                                      ?.substring(0, 2)
                                      .toUpperCase() ?? "??"}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="font-medium">
                                  <div>
                                    {supplier.name}
                                    <NewBadge createdAt={supplier.createdAt} />
                                  </div>
                                  <Badge
                                    variant="outline"
                                    className="font-normal"
                                  >
                                    {supplier.orgNumber
                                      ? `Org.nr: ${supplier.orgNumber}`
                                      : "Uten org.nr"}
                                  </Badge>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col gap-1 text-sm">
                                {supplier.email && (
                                  <div className="flex items-center gap-2 text-muted-foreground">
                                    <Mail className="h-3 w-3" />
                                    <span>{supplier.email}</span>
                                  </div>
                                )}
                                {supplier.phone && (
                                  <div className="flex items-center gap-2 text-muted-foreground">
                                    <Phone className="h-3 w-3" />
                                    <span>{supplier.phone}</span>
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              {supplier.city ? (
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <MapPin className="h-3 w-3" />
                                  <span>{supplier.city}</span>
                                </div>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </TableCell>
                            <TableCell className="max-w-[200px]">
                              {supplier.category ? (
                                <Badge
                                  variant="secondary"
                                  className="inline-block max-w-full truncate align-middle"
                                  title={supplier.category}
                                >
                                  {supplier.category}
                                </Badge>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <SupplierStatusBadge
                                status={supplier.status ?? "active"}
                              />
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    className="h-8 w-8 p-0"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <span className="sr-only">Apne meny</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>
                                    Handlinger
                                  </DropdownMenuLabel>
                                  <DropdownMenuItem asChild>
                                    <Link
                                      href={`/suppliers/${supplier.id}`}
                                      className="cursor-pointer"
                                    >
                                      <Eye className="mr-2 h-4 w-4" />
                                      Se detaljer
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
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
                    {suppliers.map((supplier) => (
                      <Card
                        key={supplier.id}
                        className="flex flex-col overflow-hidden transition-all duration-200 hover:shadow-md"
                      >
                        <CardHeader className="flex flex-row items-center gap-4 bg-muted/40 pb-4">
                          <Avatar className="h-12 w-12 border-2 border-background">
                            <AvatarImage
                              src={`https://avatar.vercel.sh/${supplier.name}`}
                              alt={supplier.name}
                            />
                            <AvatarFallback className="text-lg font-bold">
                              {supplier.name?.substring(0, 2).toUpperCase() ??
                                "??"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="grid gap-1">
                            <CardTitle className="text-lg leading-none">
                              <Link
                                href={`/suppliers/${supplier.id}`}
                                className="decoration-primary underline-offset-4 hover:underline"
                              >
                                {supplier.name}
                                <NewBadge createdAt={supplier.createdAt} />
                              </Link>
                            </CardTitle>
                            <CardDescription>
                              {supplier.orgNumber ?? "Uten org.nr"}
                            </CardDescription>
                          </div>
                        </CardHeader>
                        <CardContent className="flex flex-1 flex-col gap-4 p-6">
                          <div className="flex items-center gap-2">
                            <SupplierStatusBadge
                              status={supplier.status ?? "active"}
                            />
                            {supplier.category && (
                              <Badge
                                variant="secondary"
                                className="inline-block max-w-[150px] truncate align-middle"
                                title={supplier.category}
                              >
                                {supplier.category}
                              </Badge>
                            )}
                          </div>

                          <div className="grid gap-2 text-sm">
                            {supplier.email && (
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Mail className="h-4 w-4" />
                                <span className="truncate">
                                  {supplier.email}
                                </span>
                              </div>
                            )}
                            {supplier.phone && (
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Phone className="h-4 w-4" />
                                <span>{supplier.phone}</span>
                              </div>
                            )}
                            {supplier.city && (
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <MapPin className="h-4 w-4" />
                                <span className="truncate">
                                  {supplier.address
                                    ? `${supplier.address}, `
                                    : ""}
                                  {supplier.postalCode} {supplier.city}
                                </span>
                              </div>
                            )}
                            {supplier.website && (
                              <div className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground">
                                <Globe className="h-4 w-4" />
                                <a
                                  href={
                                    supplier.website.startsWith("http")
                                      ? supplier.website
                                      : `https://${supplier.website}`
                                  }
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="truncate hover:underline"
                                >
                                  {supplier.website}
                                </a>
                              </div>
                            )}
                          </div>

                          <div className="mt-auto flex items-center justify-between border-t pt-4">
                            <span className="text-xs text-muted-foreground">
                              Opprettet{" "}
                              {supplier.createdAt
                                ? new Date(
                                    supplier.createdAt
                                  ).toLocaleDateString("nb-NO")
                                : "-"}
                            </span>
                            <Link href={`/suppliers/${supplier.id}`}>
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

            {data && suppliers.length > 0 && (
              <PaginationControls
                currentPage={page}
                totalPages={Math.ceil((data.total ?? 0) / pageSize)}
                onPageChange={handlePageChange}
                pageSize={pageSize}
                totalCount={data.total ?? 0}
                entityName="leverandorer"
              />
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default function SuppliersPage() {
  return (
    <Suspense
      fallback={
        <AppLayout disableScroll>
          <div className="flex h-full flex-col">
            <div className="flex-none space-y-4 border-b bg-background px-4 py-4 md:px-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">
                    Leverandorer
                  </h1>
                  <p className="text-muted-foreground">
                    Oversikt over alle leverandorer og deres informasjon
                  </p>
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8">
              <TableSkeleton rows={10} columns={6} />
            </div>
          </div>
        </AppLayout>
      }
    >
      <SuppliersPageContent />
    </Suspense>
  );
}
