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
  useUpdateOfferCustomer,
  useUpdateOfferExpirationDate,
  useUpdateOfferCost,
} from "@/hooks/useOffers";
import { useAllCustomers } from "@/hooks/useCustomers";

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
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CardSkeleton } from "@/components/ui/card-skeleton";
import { OfferStatusBadge } from "@/components/offers/offer-status-badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import Link from "next/link";
import {
  ArrowLeft,
  Link as LinkIcon,
  Info,
  X,
  Check,
  ChevronDown,
  Trophy,
  XCircle,
  Send,
  Pencil,
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
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ProjectListTable } from "@/components/projects/project-list-table";
import { CustomerListTable } from "@/components/customers/customer-list-table";
import { cn, formatOfferNumber } from "@/lib/utils";
import { SmartDatePicker } from "@/components/ui/smart-date-picker";
import type { DomainProjectDTO } from "@/lib/.generated/data-contracts";

import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";

import { OfferDescription } from "@/components/offers/offer-description";
import { ProjectPhaseBadge } from "@/components/projects/project-phase-badge";

export default function OfferDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const { data: offer, isLoading } = useOfferWithDetails(resolvedParams.id);
  const { data: users } = useUsers();
  const { data: customers } = useAllCustomers();

  // Fetch all projects (no filter in useProjects) so we can filter locally for "not completed"
  const { data: rawProjects } = useProjects();

  // Filter projects client-side: anything not "completed" is allowed.
  // Also support search.
  const [projectSearch, setProjectSearch] = useState("");
  const [customerSearch, setCustomerSearch] = useState("");

  const projects = (
    rawProjects?.data as DomainProjectDTO[] | undefined
  )?.filter((p) => p.phase === "tilbud" && p.id !== offer?.projectId);

  const filteredProjects = projects?.filter((p) => {
    if (!projectSearch) return true;
    const searchLower = projectSearch.toLowerCase();
    const nameMatch = p.name?.toLowerCase().includes(searchLower);
    const numberMatch = p.projectNumber?.toLowerCase().includes(searchLower);
    const customerMatch = p.customerName?.toLowerCase().includes(searchLower);
    return nameMatch || numberMatch || customerMatch;
  });

  const filteredCustomers = (customers || []).filter((c) => {
    if (!customerSearch) return true;
    const searchLower = customerSearch.toLowerCase();
    return (
      c.name?.toLowerCase().includes(searchLower) ||
      c.city?.toLowerCase().includes(searchLower) ||
      c.orgNumber?.toString().includes(searchLower)
    );
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
  const updateOfferCustomer = useUpdateOfferCustomer();
  const updateExpirationDate = useUpdateOfferExpirationDate();
  const updateCost = useUpdateOfferCost();

  const acceptOffer = useAcceptOffer();
  const rejectOffer = useRejectOffer();
  const sendOffer = useSendOffer();

  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isResponsibleModalOpen, setIsResponsibleModalOpen] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);

  const [isSendDetailsModalOpen, setIsSendDetailsModalOpen] = useState(false);
  const [isProbabilityPromptOpen, setIsProbabilityPromptOpen] = useState(false);
  const [probabilityContext, setProbabilityContext] = useState<
    "won" | "reverted"
  >("won");
  const [pendingProbability, setPendingProbability] = useState(0);
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
  const [showLockedAlert, setShowLockedAlert] = useState(true);

  useEffect(() => {
    if (confirmationAction === "win" && offer) {
      setProjectCreationName(`[AUTO] ${offer.title || ""}`);
    }
  }, [confirmationAction, offer]);

  // Sync local probability when offer loads or updates
  useEffect(() => {
    if (offer) {
      if (offer.probability !== undefined) {
        setLocalProbability(offer.probability);
      }
    }
  }, [offer]);

  const calcCost = offer?.cost ?? 0;
  const calcPrice = offer?.value ?? 0;

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
                      ? `Tilbud: ${formatOfferNumber(
                          offer.offerNumber,
                          offer.phase
                        )}`
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
                              <>
                                <p>
                                  Herlig! Er du sikker på at du vil markere
                                  tilbudet som vunnet?
                                </p>
                                <Alert className="mt-4 border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
                                  <Info className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                                  <AlertTitle className="ml-2 text-amber-900 dark:text-amber-100">
                                    Obs: Andre tilbud vil utløpe
                                  </AlertTitle>
                                  <AlertDescription className="ml-2 text-amber-800 dark:text-amber-200">
                                    Dette tilbudet er en del av et prosjekt.
                                    Hvis du vinner dette, vil alle andre aktive
                                    tilbud i samme prosjekt automatisk settes
                                    til &apos;Utgått&apos;.
                                  </AlertDescription>
                                </Alert>
                                <div className="mt-2 text-sm text-muted-foreground">
                                  Tilbudet vil bli låst for redigering for å
                                  sikre historikken. Prosjektet overtar som{" "}
                                  <ProjectPhaseBadge phase="active" /> fase, og
                                  alle videre endringer gjøres der.
                                </div>
                              </>
                            )}
                          </>
                        )}
                        {confirmationAction === "loss" && (
                          <>
                            <p>
                              Det var kjedelig! Er du sikker på at du vil
                              markere tilbudet som tapt?
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Tilbudet låses for redigering for å sikre
                              historikk, og tas ut av aktiv pipeline.
                            </p>
                          </>
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
            {(offer.phase === "won" || offer.phase === "lost") &&
              showLockedAlert && (
                <Alert
                  className={cn(
                    "relative border pr-12",
                    offer.phase === "won"
                      ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20"
                      : "border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/20"
                  )}
                >
                  <Info
                    className={cn(
                      "h-4 w-4",
                      offer.phase === "won"
                        ? "text-green-800 dark:text-green-300"
                        : "text-orange-800 dark:text-orange-300"
                    )}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "absolute right-2 top-2 h-8 w-8 !pl-0",
                      offer.phase === "won"
                        ? "text-green-800 hover:bg-green-100 hover:text-green-900 dark:text-green-300 dark:hover:bg-green-800/30 dark:hover:text-green-200"
                        : "text-orange-800 hover:bg-orange-100 hover:text-orange-900 dark:text-orange-300 dark:hover:bg-orange-800/30 dark:hover:text-orange-200"
                    )}
                    onClick={() => setShowLockedAlert(false)}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Lukk</span>
                  </Button>
                  <AlertTitle
                    className={cn(
                      offer.phase === "won"
                        ? "text-green-900 dark:text-green-100"
                        : "text-orange-900 dark:text-orange-100"
                    )}
                  >
                    Tilbudet er {offer.phase === "won" ? "vunnet" : "tapt"}!
                  </AlertTitle>
                  <AlertDescription
                    className={cn(
                      offer.phase === "won"
                        ? "text-green-800 dark:text-green-200"
                        : "text-orange-800 dark:text-orange-200"
                    )}
                  >
                    Du kan ikke endre alle verdiene på tilbudet da det{" "}
                    {offer.phase === "won"
                      ? "nå er i hendene på prosjektet"
                      : "er låst for redigering"}
                    . Dette for å ikke endre historikken etter at tilbudet ble
                    lukket.
                    {offer.phase === "won" && offer.projectId && (
                      <p>
                        Det er sannsynligvis prosjektet du har lyst til å endre
                        om det er det du er ute etter. Her er linken:{" "}
                        <Link
                          href={`/projects/${offer.projectId}`}
                          className="font-medium underline hover:opacity-80"
                        >
                          {offer.projectName || "Gå til prosjekt"}
                        </Link>
                      </p>
                    )}
                  </AlertDescription>
                </Alert>
              )}
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Tilbudsinfo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Kunde</p>
                    <div className="flex items-center gap-2">
                      {offer.customerId ? (
                        <Link
                          href={`/customers/${offer.customerId}`}
                          className="font-medium hover:underline"
                        >
                          {offer.customerName}
                        </Link>
                      ) : (
                        <span className="font-medium">
                          {offer.customerName}
                        </span>
                      )}
                      {!isLocked && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => setIsCustomerModalOpen(true)}
                        >
                          <Pencil className="h-3 w-3" />
                        </Button>
                      )}
                    </div>

                    <Dialog
                      open={isCustomerModalOpen}
                      onOpenChange={setIsCustomerModalOpen}
                    >
                      <DialogContent className="flex max-h-[80vh] max-w-4xl flex-col">
                        <DialogHeader>
                          <DialogTitle>Bytt kunde</DialogTitle>
                          <DialogDescription>
                            Søk etter og velg kunden som dette tilbudet skal
                            tilhøre.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex flex-1 flex-col space-y-4 overflow-hidden">
                          <Input
                            placeholder="Søk etter kunde..."
                            value={customerSearch}
                            onChange={(e) => setCustomerSearch(e.target.value)}
                            className="focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0"
                          />
                          <div className="flex-1 overflow-auto rounded-md border">
                            <CustomerListTable
                              compact={true}
                              customers={filteredCustomers}
                              onCustomerClick={(customer) => {
                                updateOfferCustomer.mutate({
                                  id: offer.id!,
                                  data: { customerId: customer.id! },
                                });
                                setIsCustomerModalOpen(false);
                              }}
                            />
                          </div>
                          <div className="flex justify-start">
                            <Button
                              variant="outline"
                              onClick={() => {
                                if (offer.customerId) {
                                  window.open(
                                    `/customers/${offer.customerId}`,
                                    "_blank"
                                  );
                                }
                                setIsCustomerModalOpen(false);
                              }}
                            >
                              <LinkIcon className="mr-2 h-4 w-4" />
                              Gå til kundeside for nåværende kunde
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
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
                          "-ml-1 rounded border border-transparent p-1 px-1 font-medium transition-colors",
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
                        onCheckedChange={(checked) => {
                          const isChecked = !!checked;
                          updateCustomerHasWonOffer.mutate({
                            id: offer.id!,
                            customerHasWonProject: isChecked,
                          });
                          setProbabilityContext(isChecked ? "won" : "reverted");
                          setPendingProbability(localProbability);
                          setIsProbabilityPromptOpen(true);
                        }}
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

                  <div className="flex flex-wrap gap-6">
                    <div className="min-w-[200px] flex-1">
                      <p className="mb-1 text-sm text-muted-foreground">
                        Frist <span className="text-xs">(valgfritt)</span>
                      </p>
                      <SmartDatePicker
                        value={
                          offer.dueDate ? new Date(offer.dueDate) : undefined
                        }
                        onSelect={(date) => {
                          updateDueDate.mutate({
                            id: offer.id!,
                            data: {
                              dueDate: date ? date.toISOString() : undefined,
                            },
                          });
                        }}
                        disabled={isLocked}
                        disabledDates={(date) => date < new Date("1900-01-01")}
                        className="w-full"
                      />
                    </div>
                    {(offer.phase === "sent" ||
                      offer.phase === "won" ||
                      offer.phase === "lost") && (
                      <div className="min-w-[200px] flex-1">
                        <p className="mb-1 text-sm text-muted-foreground">
                          Vedståelsesfrist{" "}
                          <span className="text-xs">(valgfritt)</span>
                        </p>
                        <SmartDatePicker
                          value={
                            offer.expirationDate
                              ? new Date(offer.expirationDate)
                              : undefined
                          }
                          onSelect={(date) => {
                            updateExpirationDate.mutate({
                              id: offer.id!,
                              expirationDate: date
                                ? date.toISOString()
                                : undefined,
                            });
                          }}
                          disabled={isLocked}
                          disabledDates={(date) =>
                            date < new Date("1900-01-01")
                          }
                          className="w-full"
                        />
                      </div>
                    )}
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

              <Card className="flex h-full flex-col">
                <CardHeader>
                  <CardTitle>Økonomi</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col space-y-6">
                  <div className="flex flex-wrap gap-4">
                    <div className="min-w-[200px] flex-1 space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">
                        Total kost
                      </p>
                      <InlineEdit
                        type="currency"
                        value={offer.cost || 0}
                        onSave={async (val) => {
                          await updateCost.mutateAsync({
                            id: offer.id!,
                            cost: Number(val),
                          });
                        }}
                        className="-ml-2 border-transparent p-2 text-2xl font-bold hover:border-input hover:bg-transparent"
                      />
                    </div>
                    <div className="min-w-[200px] flex-1 space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">
                        Total pris
                      </p>
                      <InlineEdit
                        type="currency"
                        value={offer.value || 0}
                        onSave={async (val) => {
                          await updateValue.mutateAsync({
                            id: offer.id!,
                            data: { value: Number(val) },
                          });
                        }}
                        className="-ml-2 border-transparent p-2 text-2xl font-bold hover:border-input hover:bg-transparent"
                      />
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

                  <div className="space-y-6 border-t pt-6">
                    <div>
                      <p className="mb-2 text-sm text-muted-foreground">
                        Sannsynlighet: {localProbability}%
                      </p>
                      <div className="w-full">
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
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="mt-auto flex flex-col items-start p-6 pt-0">
                  <div className="w-full">
                    <p className="mb-1 text-sm text-muted-foreground">
                      Tilknyttet Prosjekt
                    </p>
                    <div className="flex items-center gap-2">
                      {offer.projectId ? (
                        <Link
                          href={`/projects/${offer.projectId}`}
                          className="flex items-center gap-2 font-medium hover:underline"
                        >
                          <LinkIcon className="h-3 w-3 text-muted-foreground" />
                          <span>{offer.projectName || "Ukjent prosjekt"}</span>
                        </Link>
                      ) : (
                        <span className="italic text-muted-foreground">
                          Ikke tilknyttet prosjekt
                        </span>
                      )}
                      {!isLocked && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => setIsProjectModalOpen(true)}
                        >
                          <Pencil className="h-3 w-3" />
                        </Button>
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
                            onChange={(e) => setProjectSearch(e.target.value)}
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
                          <AlertDialogTitle>Endre prosjekt?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Er du sikker på at du vil endre tilknyttet prosjekt
                            til{" "}
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

                    {/* Probability Update Modal */}
                    <AlertDialog
                      open={isProbabilityPromptOpen}
                      onOpenChange={setIsProbabilityPromptOpen}
                    >
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Oppdater sannsynlighet?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            {probabilityContext === "won"
                              ? "Det at kunden har vunnet sitt prosjekt er gode nyheter! Dette påvirker ofte våre vinnersjanser positivt. Ønsker du å oppjustere sannsynligheten for dette tilbudet?"
                              : "Siden kunden ikke lenger er markert som vinner av prosjektet, kan dette påvirke våre vinnersjanser. Ønsker du å justere sannsynligheten for dette tilbudet?"}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="py-4">
                          <div className="mb-4 flex items-center justify-between">
                            <span className="text-sm font-medium">
                              Ny sannsynlighet:
                            </span>
                            <span className="font-bold">
                              {pendingProbability}%
                            </span>
                          </div>
                          <Slider
                            value={[pendingProbability]}
                            max={90}
                            min={10}
                            step={10}
                            onValueChange={(val) =>
                              setPendingProbability(val[0])
                            }
                          />
                        </div>
                        <AlertDialogFooter>
                          <AlertDialogCancel>
                            Nei, behold dagens ({localProbability}%)
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => {
                              updateProbability.mutate({
                                id: offer.id!,
                                data: { probability: pendingProbability },
                              });
                              setLocalProbability(pendingProbability);
                              setIsProbabilityPromptOpen(false);
                            }}
                          >
                            Ja, oppdater
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
                            Er du sikker på at du vil fjerne tilknytningen til
                            prosjektet?
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
                  </div>
                </CardFooter>
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
