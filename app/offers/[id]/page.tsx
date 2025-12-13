"use client";

import { AppLayout } from "@/components/layout/app-layout";
import {
  useOfferWithDetails,
  useUpdateOfferTitle,
  useUpdateOfferValue,
  useUpdateOfferProbability,
  useUpdateOfferResponsible,
  useUpdateOfferProject,
  useDeleteOfferProject,
  useAcceptOffer,
  useRejectOffer,
  useSendOffer,
  useUpdateOfferDueDate,
  useUpdateOfferExternalReference,
  useUpdateCustomerHasWonOffer,
} from "@/hooks/useOffers";

import confetti from "canvas-confetti";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
  Link as LinkIcon,
  Check,
  ChevronDown,
  Trophy,
  XCircle,
  Send,
  Calendar as CalendarIcon,
} from "lucide-react";
import { formatDistanceToNow, addDays, format } from "date-fns";
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
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
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

  const projects = (
    rawProjects?.data as DomainProjectDTO[] | undefined
  )?.filter((p) => p.status !== "completed");

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
  const deleteProject = useDeleteOfferProject();
  const updateDueDate = useUpdateOfferDueDate();
  const updateExternalReference = useUpdateOfferExternalReference();
  const updateCustomerHasWonOffer = useUpdateCustomerHasWonOffer();

  const acceptOffer = useAcceptOffer();
  const rejectOffer = useRejectOffer();
  const sendOffer = useSendOffer();

  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isResponsibleModalOpen, setIsResponsibleModalOpen] = useState(false);

  const [isSendDetailsModalOpen, setIsSendDetailsModalOpen] = useState(false);
  const [sendDate, setSendDate] = useState<Date>(new Date());
  const [expirationDate, setExpirationDate] = useState<Date>(
    addDays(new Date(), 60)
  );
  const [localProbability, setLocalProbability] = useState(0);

  // Project confirmation state
  const [pendingProject, setPendingProject] = useState<any>(null);
  const [showDisconnectConfirm, setShowDisconnectConfirm] = useState(false);
  const [showChangeConfirm, setShowChangeConfirm] = useState(false);

  // Confirmation state
  const [confirmationAction, setConfirmationAction] = useState<
    "win" | "loss" | null
  >(null);

  const [projectCreationName, setProjectCreationName] = useState("");

  useEffect(() => {
    if (confirmationAction === "win" && offer) {
      setProjectCreationName(`[AUTO] ${offer.title || ""}`);
    }
  }, [confirmationAction, offer]);

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

      const currentCost = offer.cost ?? 0;

      const currentVal = offer.value ?? 0;

      setCalcCost(currentCost);
      setCalcPrice(currentVal);
    }
  }, [offer]);

  const calcDB = calcPrice - calcCost;
  const calcDG = calcPrice > 0 ? (calcDB / calcPrice) * 100 : 0;

  const isLocked =
    (offer?.phase as string) === "won" ||
    (offer?.phase as string) === "lost" ||
    (offer?.phase as string) === "archived";

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
    <AppLayout disableScroll>
      <div className="flex h-full flex-col">
        <div className="flex-none border-b bg-background px-4 py-4 md:px-8">
          <div className="mx-auto w-full max-w-[1920px]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href="/offers">
                  <Button variant="ghost" size="icon">
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                </Link>
                <div>
                  <span className="mb-1 block font-mono text-sm uppercase tracking-wider text-muted-foreground">
                    {offer.offerNumber
                      ? `Tilbud: ${offer.offerNumber}`
                      : "Tilbud"}
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
                  onClick={() => {
                    const today = new Date();
                    setSendDate(today);
                    setExpirationDate(addDays(today, 60));
                    setIsSendDetailsModalOpen(true);
                  }}
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
                      {confirmationAction === "win" && "Marker som vunnet?"}
                      {confirmationAction === "loss" && "Marker som tapt?"}
                    </AlertDialogTitle>
                    <AlertDialogDescription asChild>
                      <div className="space-y-4">
                        {confirmationAction === "win" && (
                          <>
                            {!offer.projectId ? (
                              <>
                                <p>
                                  Gratulerer! Siden dette tilbudet ikke er
                                  koblet til et prosjekt, vil et prosjekt bli
                                  opprettet automatisk når du bekrefter.
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Dette vil være standardnavnet, men du kan
                                  valgfritt endre det i inntastingsfeltet
                                  nedenfor.
                                </p>
                                <div className="pt-2">
                                  <Label htmlFor="project-name">
                                    Prosjektnavn
                                  </Label>
                                  <Input
                                    id="project-name"
                                    value={projectCreationName}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      // Capitalize first letter logic
                                      const washed =
                                        val.charAt(0).toUpperCase() +
                                        val.slice(1);
                                      setProjectCreationName(washed);
                                    }}
                                    className="mt-1"
                                    placeholder="Prosjektnavn..."
                                  />
                                  {projectCreationName.length <= 2 && (
                                    <p className="mt-1 text-xs text-red-500">
                                      Navnet må være lenger enn 2 tegn
                                    </p>
                                  )}
                                </div>
                              </>
                            ) : (
                              <p>
                                Gratulerer! Er du sikker på at du vil markere
                                tilbudet som vunnet? Dette er en viktig milepæl.
                              </p>
                            )}
                          </>
                        )}
                        {confirmationAction === "loss" && (
                          <p>
                            Er du sikker på at du vil markere tilbudet som tapt?
                            Dette markerer tilbudet som tapt, og vil ikke lenger
                            telle inn mot tilbuds- eller ordrereserve.
                          </p>
                        )}
                      </div>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Avbryt</AlertDialogCancel>
                    <AlertDialogAction
                      className={cn(
                        confirmationAction === "win" &&
                          "bg-green-600 hover:bg-green-700",
                        confirmationAction === "loss" &&
                          "bg-red-600 hover:bg-red-700"
                      )}
                      disabled={
                        confirmationAction === "win" &&
                        !offer.projectId &&
                        projectCreationName.length <= 2
                      }
                      onClick={() => {
                        if (confirmationAction === "win") {
                          acceptOffer.mutate({
                            id: offer.id!,
                            createProject: !offer.projectId, // Only create if not connected
                            projectName: !offer.projectId
                              ? projectCreationName
                              : undefined,
                          });
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
                      {confirmationAction === "win" &&
                        "Bekreft at tilbudet er vunnet"}
                      {confirmationAction === "loss" && "Marker som tapt"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8">
          <div className="mx-auto w-full max-w-[1920px] space-y-6">
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
                    <p className="mb-1 text-sm text-muted-foreground">
                      Ekstern referanse
                    </p>
                    <InlineEdit
                      value={(offer as any).externalReference || ""}
                      placeholder="Legg til ekstern ref..."
                      onSave={async (val) => {
                        await updateExternalReference.mutateAsync({
                          id: offer.id!,
                          externalReference: String(val),
                        });
                      }}
                      className="-ml-1 w-full border-transparent p-1 px-1 font-medium hover:border-input hover:bg-transparent"
                    />
                  </div>

                  <div>
                    <p className="mb-1 text-sm text-muted-foreground">Frist</p>
                    <div className="flex items-center gap-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="ghost"
                            disabled={isLocked}
                            className={cn(
                              "-ml-1 h-auto w-[160px] justify-start border border-transparent p-1 px-1 text-left font-medium hover:border-input hover:bg-transparent",
                              !offer.dueDate && "text-muted-foreground",
                              isLocked &&
                                "cursor-default hover:border-transparent"
                            )}
                          >
                            {offer.dueDate ? (
                              format(new Date(offer.dueDate), "dd.MM.yyyy")
                            ) : (
                              <span className="text-muted-foreground">
                                dd.mm.yyyy
                              </span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-auto border-slate-800 bg-slate-950 p-4 text-slate-50"
                          align="start"
                        >
                          <Calendar
                            mode="single"
                            selected={
                              offer.dueDate
                                ? new Date(offer.dueDate)
                                : undefined
                            }
                            onSelect={(date) => {
                              updateDueDate.mutate({
                                id: offer.id!,
                                data: {
                                  dueDate: date
                                    ? date.toISOString()
                                    : undefined,
                                },
                              });
                            }}
                            disabled={(date) => date < new Date("1900-01-01")}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
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
                    <p className="mb-1 text-sm text-muted-foreground">
                      Ansvarlig
                    </p>
                    <div className="group flex items-center gap-2">
                      <div
                        role={isLocked ? undefined : "button"}
                        onClick={() =>
                          !isLocked && setIsResponsibleModalOpen(true)
                        }
                        className={cn(
                          "-ml-1 w-full rounded border border-transparent p-1 px-1 font-medium transition-colors",
                          isLocked
                            ? "cursor-default"
                            : "cursor-pointer hover:border-input hover:bg-transparent"
                        )}
                      >
                        {offer.responsibleUserId ? (
                          (users || []).find(
                            (u) => u.id === offer.responsibleUserId
                          )?.name || "Ukjent bruker"
                        ) : (
                          <span className="italic text-muted-foreground">
                            Sett Straye ansvarlig
                          </span>
                        )}
                      </div>

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
                        checked={offer.customerHasWonProject || false}
                        onCheckedChange={(checked) =>
                          updateCustomerHasWonOffer.mutate({
                            id: offer.id!,
                            customerHasWonProject: !!checked,
                          })
                        }
                        disabled={isLocked}
                        className={cn(
                          "h-5 w-5",
                          offer.customerHasWonProject
                            ? "border-green-600 bg-green-600 text-primary-foreground data-[state=checked]:border-green-600 data-[state=checked]:bg-green-600"
                            : "border-muted-foreground"
                        )}
                      />
                      <label
                        htmlFor="customer-won"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {offer.customerHasWonProject ? "Ja" : "Nei"}
                      </label>
                    </div>
                  </div>

                  <div className="border-t pt-4 text-xs text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Opprettet:</span>
                      <span>
                        {offer.createdAt
                          ? format(
                              new Date(offer.createdAt),
                              "dd.MM.yyyy HH:mm"
                            )
                          : "Ukjent"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sist oppdatert:</span>
                      <span>
                        {offer.updatedAt
                          ? format(
                              new Date(offer.updatedAt),
                              "dd.MM.yyyy HH:mm"
                            )
                          : "Ukjent"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Økonomi</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-wrap gap-4">
                    <div className="min-w-[200px] flex-1 space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">
                        Total kost
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
                          className={cn(
                            "text-2xl font-bold",
                            !isLocked && "cursor-pointer hover:underline"
                          )}
                          onClick={() =>
                            !isLocked && setEditingEconomyField("cost")
                          }
                        >
                          {new Intl.NumberFormat("nb-NO", {
                            style: "currency",
                            currency: "NOK",
                            maximumFractionDigits: 0,
                          }).format(calcCost || 0)}
                        </div>
                      )}
                    </div>
                    <div className="min-w-[200px] flex-1 space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">
                        Total pris
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
                          className={cn(
                            "text-2xl font-bold",
                            !isLocked && "cursor-pointer hover:underline"
                          )}
                          onClick={() =>
                            !isLocked && setEditingEconomyField("price")
                          }
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
                      <p className="text-sm text-muted-foreground">
                        Forventet DB
                      </p>
                      <p className="font-mono font-medium text-green-600">
                        {new Intl.NumberFormat("nb-NO", {
                          style: "currency",
                          currency: "NOK",
                          maximumFractionDigits: 0,
                        }).format(calcDB || 0)}
                      </p>
                    </div>
                  </div>

                  {offer.value !== Math.round(calcPrice) &&
                    calcPrice > 0 &&
                    !isLocked && (
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
                        Oppdater Total verdi (
                        {Math.round(calcPrice).toLocaleString()} kr)
                      </Button>
                    )}

                  <div className="space-y-4 border-t pt-4">
                    <div>
                      <p className="mb-1 text-sm text-muted-foreground">
                        Sannsynlighet
                      </p>
                      <div className="w-full">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="font-medium">
                            {localProbability}%
                          </span>
                        </div>
                        <Slider
                          value={[localProbability]}
                          max={90}
                          min={10}
                          step={10}
                          disabled={isLocked}
                          onValueChange={(val) => setLocalProbability(val[0])}
                          onValueCommit={async (val) => {
                            if (isLocked) return;
                            await updateProbability.mutateAsync({
                              id: offer.id!,
                              data: { probability: val[0] },
                            });
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <p className="mb-1 text-sm text-muted-foreground">
                        Tilknyttet Prosjekt
                      </p>
                      <div className="flex items-center gap-2">
                        <div
                          role={isLocked ? undefined : "button"}
                          onClick={() =>
                            !isLocked && setIsProjectModalOpen(true)
                          }
                          className={cn(
                            "-ml-1 flex-1 rounded border border-transparent p-1 px-1 font-medium transition-colors",
                            isLocked
                              ? "cursor-default"
                              : "cursor-pointer hover:border-input hover:bg-transparent"
                          )}
                        >
                          {offer.projectId ? (
                            <div className="flex items-center gap-2">
                              <LinkIcon className="h-3 w-3 text-muted-foreground" />
                              <span>
                                {offer.projectName || "Ukjent prosjekt"}
                              </span>
                            </div>
                          ) : (
                            <span className="italic text-muted-foreground">
                              Koble til prosjekt
                            </span>
                          )}
                        </div>

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
                                onChange={(e) =>
                                  setProjectSearch(e.target.value)
                                }
                                className="focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0"
                              />
                              <div className="flex-1 overflow-auto rounded-md border">
                                <ProjectListTable
                                  compact={true}
                                  projects={filteredProjects || []}
                                  onProjectClick={(project) => {
                                    setPendingProject(project);
                                    setShowChangeConfirm(true);
                                  }}
                                />
                              </div>
                              <div className="flex justify-end">
                                <Button
                                  variant="destructive"
                                  onClick={() => setShowDisconnectConfirm(true)}
                                >
                                  Fjern tilknytning
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <AlertDialog
                          open={showChangeConfirm}
                          onOpenChange={setShowChangeConfirm}
                        >
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Endre prosjekt?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Er du sikker på at du vil endre tilknyttet
                                prosjekt til{" "}
                                <span className="font-medium text-foreground">
                                  {pendingProject?.name}
                                </span>
                                ?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel
                                onClick={() => setPendingProject(null)}
                              >
                                Avbryt
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => {
                                  if (pendingProject) {
                                    updateProject.mutate({
                                      id: offer.id!,
                                      data: { projectId: pendingProject.id! },
                                    });
                                    setIsProjectModalOpen(false);
                                    setPendingProject(null);
                                  }
                                }}
                              >
                                Endre prosjekt
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>

                        <AlertDialog
                          open={showDisconnectConfirm}
                          onOpenChange={setShowDisconnectConfirm}
                        >
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Fjern tilknytning?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Er du sikker på at du vil fjerne tilknytningen
                                til prosjektet?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Avbryt</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-600 hover:bg-red-700"
                                onClick={() => {
                                  deleteProject.mutate(offer.id!);
                                  setIsProjectModalOpen(false);
                                }}
                              >
                                Fjern tilknytning
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>

                        {offer.projectId && (
                          <Link
                            href={`/projects/${offer.projectId}`}
                            className="ml-auto whitespace-nowrap text-sm text-muted-foreground hover:underline"
                          >
                            (Gå til prosjekt)
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <OfferDescription
              offerId={offer.id!}
              initialDescription={offer.description || ""}
              readOnly={isLocked}
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
        </div>
      </div>

      <Dialog
        open={isSendDetailsModalOpen}
        onOpenChange={setIsSendDetailsModalOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send tilbud</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="sent-date">Sendt dato</Label>
              <Input
                id="sent-date"
                type="date"
                value={sendDate ? format(sendDate, "yyyy-MM-dd") : ""}
                onChange={(e) => {
                  if (e.target.value) {
                    const date = new Date(e.target.value);
                    setSendDate(date);
                    setExpirationDate(addDays(date, 60));
                  }
                }}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="expiration-date">
                Vedståelsesfrist (60 dager)
              </Label>
              <Input
                id="expiration-date"
                type="date"
                value={
                  expirationDate ? format(expirationDate, "yyyy-MM-dd") : ""
                }
                onChange={(e) => {
                  if (e.target.value) {
                    setExpirationDate(new Date(e.target.value));
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsSendDetailsModalOpen(false)}
            >
              Avbryt
            </Button>
            <Button
              className="bg-purple-600 text-white hover:bg-purple-700"
              onClick={() => {
                sendOffer.mutate({
                  id: offer.id!,
                  sentDate: sendDate.toISOString(),
                  expirationDate: expirationDate.toISOString(),
                });
                setIsSendDetailsModalOpen(false);
              }}
            >
              Bekreft og send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
