"use client";

import { AppLayout } from "@/components/layout/app-layout";
import {
  useOfferWithDetails,
  useUpdateOfferTitle,
  useUpdateOfferValue,
  useUpdateOfferProbability,
  useUpdateOfferResponsible,
  useUpdateOfferProject,
  useAcceptOffer,
  useRejectOffer,
  useSendOffer,
  useUpdateOfferDueDate,
} from "@/hooks/useOffers";
import confetti from "canvas-confetti";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useUsers } from "@/hooks/useUsers";
import { useProjects } from "@/hooks/useProjects";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CardSkeleton } from "@/components/ui/card-skeleton";
import { OfferStatusBadge } from "@/components/offers/offer-status-badge";

import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Link as LinkIcon,
  Check,
  ChevronDown,
  Trophy,
  XCircle,
  Send,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { nb } from "date-fns/locale";
import { use, useState, useEffect } from "react";
import { InlineEdit } from "@/components/ui/inline-edit";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ProjectListTable } from "@/components/projects/project-list-table";
import { cn, getDueDateColor } from "@/lib/utils";
import type { DomainProjectDTO } from "@/lib/.generated/data-contracts";

import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";

import { OfferDescription } from "@/components/offers/offer-description";

export default function OfferDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const { data: offer, isLoading } = useOfferWithDetails(resolvedParams.id);
  const { data: users } = useUsers();
  // Fetch all projects (no filter in useProjects) so we can filter locally for "not completed"
  const { data: rawProjects } = useProjects();

  // Filter projects client-side: anything not "completed" is allowed.
  // Also support search.
  const [projectSearch, setProjectSearch] = useState("");

  const projects = (rawProjects as DomainProjectDTO[] | undefined)?.filter(
    (p) => p.status !== "completed"
  );

  const filteredProjects = projects?.filter((p) => {
    if (!projectSearch) return true;
    const searchLower = projectSearch.toLowerCase();
    const nameMatch = p.name?.toLowerCase().includes(searchLower);
    const numberMatch = p.projectNumber?.toLowerCase().includes(searchLower);
    const customerMatch = p.customerName?.toLowerCase().includes(searchLower);
    return nameMatch || numberMatch || customerMatch;
  });

  // Mutations
  const updateTitle = useUpdateOfferTitle();
  const updateValue = useUpdateOfferValue();
  const updateProbability = useUpdateOfferProbability();
  const updateResponsible = useUpdateOfferResponsible();
  const updateProject = useUpdateOfferProject();
  const updateDueDate = useUpdateOfferDueDate();

  const acceptOffer = useAcceptOffer();
  const rejectOffer = useRejectOffer();
  const sendOffer = useSendOffer();

  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isResponsibleModalOpen, setIsResponsibleModalOpen] = useState(false);
  // Local state for "Customer Won" checkbox since it's not in backend yet
  const [isCustomerWon, setIsCustomerWon] = useState(false);
  const [localProbability, setLocalProbability] = useState(0);
  // Confirmation state
  const [confirmationAction, setConfirmationAction] = useState<
    "send" | "win" | "loss" | null
  >(null);

  // Sync local probability when offer loads or updates
  // Calculator state
  const [calcCost, setCalcCost] = useState(0);
  const [calcPrice, setCalcPrice] = useState(0);
  const [editingEconomyField, setEditingEconomyField] = useState<
    "cost" | "price" | null
  >(null);

  // Sync calc state with offer data
  useEffect(() => {
    if (offer) {
      if (offer.probability !== undefined) {
        setLocalProbability(offer.probability);
      }

      // Initial calculation from offer data
      // Use budgetSummary if available, otherwise fall back to items or 0
      const currentCost =
        offer.budgetSummary?.totalCost ??
        (offer.items ?? []).reduce((sum, item) => sum + (item.cost ?? 0), 0);

      const currentVal = offer.value ?? 0;

      setCalcCost(currentCost);
      setCalcPrice(currentVal);
    }
  }, [offer]);

  const calcDB = calcPrice - calcCost;
  const calcDG = calcPrice > 0 ? (calcDB / calcPrice) * 100 : 0;

  if (isLoading) {
    return (
      <AppLayout>
        <div className="space-y-6">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </AppLayout>
    );
  }

  if (!offer) {
    return (
      <AppLayout>
        <div className="py-12 text-center">
          <p className="text-muted-foreground">Tilbud ikke funnet</p>
          <Link href="/offers">
            <Button className="mt-4">Tilbake til tilbud</Button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/offers">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <span className="mb-1 block font-mono text-sm uppercase tracking-wider text-muted-foreground">
                {offer.offerNumber ? `Tilbud: ${offer.offerNumber}` : "Tilbud"}
              </span>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold">
                  <InlineEdit
                    value={offer.title || ""}
                    onSave={async (val) => {
                      await updateTitle.mutateAsync({
                        id: offer.id!,
                        data: { title: String(val) },
                      });
                    }}
                    className="-ml-1 border-transparent p-0 text-3xl font-bold hover:border-transparent hover:bg-transparent"
                  />
                </h1>
              </div>
              <p className="text-muted-foreground">
                Opprettet{" "}
                {formatDistanceToNow(
                  new Date(offer.createdAt ?? new Date().toISOString()),
                  {
                    addSuffix: true,
                    locale: nb,
                  }
                )}
              </p>
            </div>
          </div>
          {/* Status actions */}
          {(offer.phase === "draft" || offer.phase === "in_progress") && (
            <Button
              className="bg-purple-600 text-white hover:bg-purple-700"
              onClick={() => setConfirmationAction("send")}
            >
              <Send className="mr-2 h-4 w-4" />
              Marker som sendt
            </Button>
          )}

          {offer.phase === "sent" && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Avgjør skjebne <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  className="text-green-600 focus:bg-green-50 focus:text-green-600"
                  onClick={() => setConfirmationAction("win")}
                >
                  <Trophy className="mr-2 h-4 w-4" />
                  Vunnet
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-600 focus:bg-red-50 focus:text-red-600"
                  onClick={() => setConfirmationAction("loss")}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Tapt
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Confirmation Dialog */}
          <AlertDialog
            open={!!confirmationAction}
            onOpenChange={(open) => !open && setConfirmationAction(null)}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {confirmationAction === "send" && "Marker som sendt?"}
                  {confirmationAction === "win" && "Marker som vunnet?"}
                  {confirmationAction === "loss" && "Marker som tapt?"}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {confirmationAction === "send" && (
                    <>
                      Er du sikker på at du vil markere tilbudet som sendt?
                      Dette vil endre statusen til sendt og indikere at kunden
                      har mottatt tilbudet.
                    </>
                  )}
                  {confirmationAction === "win" && (
                    <>
                      Gratulerer! Er du sikker på at du vil markere tilbudet som
                      vunnet? Dette vil opprette et prosjekt (hvis valgt) og er
                      en viktig milepæl.
                    </>
                  )}
                  {confirmationAction === "loss" && (
                    <>
                      Er du sikker på at du vil markere tilbudet som tapt? Dette
                      arkiverer tilbudet som tapt, men du kan alltids finne det
                      igjen senere.
                    </>
                  )}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Avbryt</AlertDialogCancel>
                <AlertDialogAction
                  className={cn(
                    confirmationAction === "win" &&
                      "bg-green-600 hover:bg-green-700",
                    confirmationAction === "loss" &&
                      "bg-red-600 hover:bg-red-700",
                    confirmationAction === "send" &&
                      "bg-purple-600 hover:bg-purple-700"
                  )}
                  onClick={() => {
                    if (confirmationAction === "send") {
                      sendOffer.mutate(offer.id!);
                    } else if (confirmationAction === "win") {
                      acceptOffer.mutate({ id: offer.id! });
                      confetti({
                        particleCount: 100,
                        spread: 70,
                        origin: { y: 0.6 },
                        colors: ["#22c55e", "#16a34a", "#15803d"],
                      });
                    } else if (confirmationAction === "loss") {
                      rejectOffer.mutate({ id: offer.id! });
                    }
                    setConfirmationAction(null);
                  }}
                >
                  {confirmationAction === "send" && "Send tilbud"}
                  {confirmationAction === "win" && "Bekreft vunnet"}
                  {confirmationAction === "loss" && "Bekreft tapt"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Tilbudsinfo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Kunde</p>
                <Link
                  href={`/customers/${offer.customerId}`}
                  className="font-medium hover:underline"
                >
                  {offer.customerName}
                </Link>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Fase</p>
                <OfferStatusBadge
                  className="mt-1"
                  phase={offer.phase || "draft"}
                />
              </div>

              <div>
                <p className="mb-1 text-sm text-muted-foreground">Frist</p>
                <div className="flex items-center gap-2">
                  <Input
                    type="date"
                    value={offer.dueDate ? offer.dueDate.split("T")[0] : ""}
                    onChange={(e) => {
                      // Ensure we send ISO format or at least YYYY-MM-DD as expected by backend
                      // If user clears, we might want to send null or empty string?
                      // Input type=date returns YYYY-MM-DD
                      updateDueDate.mutate({
                        id: offer.id!,
                        data: {
                          dueDate: e.target.value
                            ? new Date(e.target.value).toISOString()
                            : undefined,
                        },
                      });
                    }}
                    className={cn("w-[160px]", getDueDateColor(offer.dueDate))}
                  />
                  {offer.dueDate && (
                    <span
                      className={cn(
                        "text-sm font-medium",
                        getDueDateColor(offer.dueDate)
                      )}
                    >
                      {formatDistanceToNow(new Date(offer.dueDate), {
                        addSuffix: true,
                        locale: nb,
                      })}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <p className="mb-1 text-sm text-muted-foreground">Ansvarlig</p>
                <div className="group flex items-center gap-2">
                  {offer.responsibleUserId ? (
                    <Button
                      variant="ghost"
                      onClick={() => setIsResponsibleModalOpen(true)}
                      className="-ml-1 h-auto justify-start p-0 pl-1 text-left font-medium hover:bg-transparent hover:text-primary"
                    >
                      {(users || []).find(
                        (u) => u.id === offer.responsibleUserId
                      )?.name || "Ukjent bruker"}
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 border-dashed"
                      onClick={() => setIsResponsibleModalOpen(true)}
                    >
                      <Plus className="mr-2 h-3 w-3" />
                      Sett Straye ansvarlig
                    </Button>
                  )}

                  <CommandDialog
                    open={isResponsibleModalOpen}
                    onOpenChange={setIsResponsibleModalOpen}
                  >
                    <CommandInput placeholder="Søk etter ansatt..." />
                    <CommandList>
                      <CommandEmpty>Ingen ansatte funnet.</CommandEmpty>
                      <CommandGroup heading="Handlinger">
                        <CommandItem
                          onSelect={() => {
                            updateResponsible.mutate({
                              id: offer.id!,
                              data: { responsibleUserId: "" },
                            });
                            setIsResponsibleModalOpen(false);
                          }}
                        >
                          <span
                            className={cn(
                              "mr-2 flex h-4 w-4 items-center justify-center opacity-0",
                              !offer.responsibleUserId && "opacity-100"
                            )}
                          >
                            <Check className="h-4 w-4" />
                          </span>
                          Ingen (Fjern ansvarlig)
                        </CommandItem>
                      </CommandGroup>
                      <CommandSeparator />
                      <CommandGroup heading="Ansatte">
                        {(users || []).map((user) => (
                          <CommandItem
                            key={user.id}
                            value={user.name}
                            onSelect={() => {
                              updateResponsible.mutate({
                                id: offer.id!,
                                data: { responsibleUserId: user.id! },
                              });
                              setIsResponsibleModalOpen(false);
                            }}
                          >
                            <span
                              className={cn(
                                "mr-2 flex h-4 w-4 items-center justify-center opacity-0",
                                offer.responsibleUserId === user.id &&
                                  "opacity-100"
                              )}
                            >
                              <Check className="h-4 w-4" />
                            </span>
                            <div className="flex flex-col">
                              <span>{user.name}</span>
                              {user.email && (
                                <span className="text-xs text-muted-foreground">
                                  {user.email}
                                </span>
                              )}
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </CommandDialog>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground">
                    Kunde har vunnet sitt prosjekt?
                  </p>
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <Checkbox
                    id="customer-won"
                    checked={isCustomerWon}
                    onCheckedChange={(checked) => setIsCustomerWon(!!checked)}
                    className={cn(
                      "h-5 w-5",
                      isCustomerWon
                        ? "border-green-600 bg-green-600 text-primary-foreground data-[state=checked]:border-green-600 data-[state=checked]:bg-green-600"
                        : "border-muted-foreground"
                    )}
                  />
                  <label
                    htmlFor="customer-won"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {isCustomerWon ? "Ja" : "Nei"}
                  </label>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Sannsynlighet</p>
                <div className="w-full">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-medium">{localProbability}%</span>
                  </div>
                  <Slider
                    value={[localProbability]}
                    max={90}
                    min={10}
                    step={10}
                    onValueChange={(val) => setLocalProbability(val[0])}
                    onValueCommit={async (val) => {
                      await updateProbability.mutateAsync({
                        id: offer.id!,
                        data: { probability: val[0] },
                      });
                    }}
                  />
                </div>
              </div>

              {/* Linked Project Section */}
              {/* Linked Project Section */}
              <div>
                <p className="text-sm text-muted-foreground">
                  Tilknyttet Prosjekt
                </p>
                <div className="mt-1 flex items-center gap-2">
                  {offer.projectId ? (
                    <Button
                      variant="ghost"
                      onClick={() => setIsProjectModalOpen(true)}
                      className="-ml-1 h-auto justify-start p-0 pl-1 text-left font-medium hover:bg-transparent hover:text-primary"
                    >
                      <LinkIcon className="mr-2 h-3 w-3" />
                      {(projects || []).find(
                        (p: DomainProjectDTO) => p.id === offer.projectId
                      )?.name || "Ukjent prosjekt"}
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8"
                      onClick={() => setIsProjectModalOpen(true)}
                    >
                      <Plus className="mr-2 h-3 w-3" />
                      Koble til prosjekt
                    </Button>
                  )}

                  <Dialog
                    open={isProjectModalOpen}
                    onOpenChange={setIsProjectModalOpen}
                  >
                    <DialogContent className="flex max-h-[80vh] max-w-4xl flex-col">
                      <DialogHeader>
                        <DialogTitle>Velg prosjekt</DialogTitle>
                      </DialogHeader>
                      <div className="flex flex-1 flex-col space-y-4 overflow-hidden">
                        <Input
                          placeholder="Søk etter prosjekt..."
                          value={projectSearch}
                          onChange={(e) => setProjectSearch(e.target.value)}
                          className="focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                        <div className="flex-1 overflow-auto rounded-md border">
                          <ProjectListTable
                            compact={true}
                            projects={filteredProjects || []}
                            onProjectClick={(project) => {
                              updateProject.mutate({
                                id: offer.id!,
                                data: { projectId: project.id! },
                              });
                              setIsProjectModalOpen(false);
                            }}
                          />
                        </div>
                        <div className="flex justify-end">
                          <Button
                            variant="outline"
                            onClick={() => {
                              updateProject.mutate({
                                id: offer.id!,
                                data: { projectId: "" },
                              });
                              setIsProjectModalOpen(false);
                            }}
                          >
                            Fjern tilknytning
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  {offer.projectId && (
                    <Link
                      href={`/projects/${offer.projectId}`}
                      className="ml-2 text-sm text-muted-foreground hover:underline"
                    >
                      (Gå til prosjekt)
                    </Link>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Økonomi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Total kost (forventet)
                  </p>
                  {editingEconomyField === "cost" ? (
                    <Input
                      type="number"
                      value={calcCost || ""}
                      onChange={(e) => setCalcCost(Number(e.target.value))}
                      className="font-mono"
                      placeholder="0"
                      autoFocus
                      onBlur={() => setEditingEconomyField(null)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          setEditingEconomyField(null);
                        }
                      }}
                    />
                  ) : (
                    <div
                      className="cursor-pointer text-2xl font-bold hover:underline"
                      onClick={() => setEditingEconomyField("cost")}
                    >
                      {new Intl.NumberFormat("nb-NO", {
                        style: "currency",
                        currency: "NOK",
                        maximumFractionDigits: 0,
                      }).format(calcCost || 0)}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Total pris (eks. mva)
                  </p>
                  {editingEconomyField === "price" ? (
                    <Input
                      type="number"
                      value={calcPrice || ""}
                      onChange={(e) => setCalcPrice(Number(e.target.value))}
                      className="font-mono"
                      placeholder="0"
                      autoFocus
                      onBlur={() => setEditingEconomyField(null)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          setEditingEconomyField(null);
                        }
                      }}
                    />
                  ) : (
                    <div
                      className="cursor-pointer text-2xl font-bold hover:underline"
                      onClick={() => setEditingEconomyField("price")}
                    >
                      {new Intl.NumberFormat("nb-NO", {
                        style: "currency",
                        currency: "NOK",
                        maximumFractionDigits: 0,
                      }).format(calcPrice || 0)}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4 rounded-lg bg-muted/50 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">
                    Forventet DG (%)
                  </p>
                  <p className="text-2xl font-bold">
                    {calcDG ? Number(calcDG.toFixed(2)) : 0} %
                  </p>
                </div>
                <div className="flex items-center justify-between border-t pt-2">
                  <p className="text-sm text-muted-foreground">Forventet DB</p>
                  <p className="font-mono font-medium text-green-600">
                    {new Intl.NumberFormat("nb-NO", {
                      style: "currency",
                      currency: "NOK",
                      maximumFractionDigits: 0,
                    }).format(calcDB || 0)}
                  </p>
                </div>
              </div>

              {offer.value !== Math.round(calcPrice) && calcPrice > 0 && (
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() =>
                    updateValue.mutate({
                      id: offer.id!,
                      data: { value: Math.round(calcPrice) },
                    })
                  }
                >
                  Oppdater Total verdi ({Math.round(calcPrice).toLocaleString()}{" "}
                  kr)
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        <OfferDescription
          offerId={offer.id!}
          initialDescription={offer.description || ""}
        />

        {offer.notes && (
          <Card>
            <CardHeader>
              <CardTitle>Notater</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{offer.notes}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
