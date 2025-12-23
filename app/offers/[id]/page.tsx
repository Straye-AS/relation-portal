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
  useDeleteOffer,
  useAcceptOffer,
  useRejectOffer,
  useSendOffer,
  useUpdateOfferDueDate,
  useUpdateOfferExternalReference,
  useUpdateCustomerHasWonOffer,
  useUpdateOfferCustomer,
  useUpdateOfferExpirationDate,
  useUpdateOfferSentDate,
  useUpdateOfferStartDate,
  useUpdateOfferEndDate,
  useUpdateOfferCost,
  useAdvanceOffer,
  useAcceptOrder,
  useCompleteOffer,
  useReopenOffer,
  useRevertToSent,
  useUpdateOfferHealth,
} from "@/hooks/useOffers";
import { useCompanyStore } from "@/store/company-store"; // Imported for company access
import { useCustomers } from "@/hooks/useCustomers";

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
import { useProjects, useProjectOffers } from "@/hooks/useProjects";
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
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Link as LinkIcon,
  Info,
  Check,
  ChevronDown,
  Trophy,
  XCircle,
  X,
  Send,
  Pencil,
  Undo2,
  Trash2,
  MoreVertical,
  Loader2,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { PaginationControls } from "@/components/pagination-controls";
import { formatDistanceToNow, format } from "date-fns";
import { nb } from "date-fns/locale";
import { use, useState, useEffect, useMemo } from "react";
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
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ProjectListTable } from "@/components/projects/project-list-table";
import { CustomerListTable } from "@/components/customers/customer-list-table";
import { cn, formatOfferNumber } from "@/lib/utils";
import { SmartDatePicker } from "@/components/ui/smart-date-picker";
import type { DomainProjectDTO } from "@/lib/.generated/data-contracts";
import type { Project } from "@/lib/api/types";
import { COMPANIES, type CompanyId } from "@/lib/api/types";

import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";

import { OfferDescription } from "@/components/offers/offer-description";
import { OfferHealthBadge } from "@/components/offers/offer-health-badge";
import { Progress } from "@/components/ui/progress";

import { Badge } from "@/components/ui/badge";
import { DeleteConfirmationModal } from "@/components/ui/delete-confirmation-modal";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { OfferNotesCard, SendOfferDialog } from "@/components/offers/detail";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OfferInformationTab } from "@/components/offers/tabs/offer-information-tab";
import { OfferEconomyTab } from "@/components/offers/tabs/offer-economy-tab";
import { OfferSuppliersTab } from "@/components/offers/tabs/offer-suppliers-tab";
import { OfferFileManager } from "@/components/files/entity-file-manager";

export default function OfferDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { data: offer, isLoading } = useOfferWithDetails(resolvedParams.id);
  const { userCompany: _userCompany } = useCompanyStore();
  const { data: users } = useUsers();

  // Modal states - declared early so they can be used in query hooks
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  const searchParams = useSearchParams();
  // Tab state
  const [activeTab, setActiveTab] = useState(
    searchParams.get("tab") || "overview"
  );

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("tab", value);
    // Use replace to update URL without adding to history stack, keep scroll position
    router.replace(`?${newParams.toString()}`, { scroll: false });
  };

  // Customer search and pagination state
  const [customerSearch, setCustomerSearch] = useState("");
  const [debouncedCustomerSearch, setDebouncedCustomerSearch] = useState("");
  const [customerPage, setCustomerPage] = useState(1);
  const customerPageSize = 10;

  // Debounce customer search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedCustomerSearch(customerSearch);
      setCustomerPage(1); // Reset to first page on new search
    }, 300);
    return () => clearTimeout(timer);
  }, [customerSearch]);

  // Only fetch customers when modal is open (lazy loading) with server-side search
  const { data: customersData, isLoading: isLoadingCustomers } = useCustomers(
    {
      page: customerPage,
      pageSize: customerPageSize,
      search: debouncedCustomerSearch || undefined,
      sortBy: "name" as any,
      sortOrder: "asc" as any,
    },
    { enabled: isCustomerModalOpen }
  );

  // Fetch all projects (no filter in useProjects) so we can filter locally for "not completed"
  const { data: rawProjects } = useProjects(undefined, {
    enabled: isProjectModalOpen,
  });

  // Fetch offers for the current project to check if there are other active offers from the same company
  const { data: projectOffers } = useProjectOffers(offer?.projectId ?? "");

  // Check if there are other active offers from the same company in this project
  const hasOtherActiveOffersFromSameCompany = useMemo(() => {
    if (!projectOffers || !offer?.projectId || !offer?.companyId) return false;
    const activePhases = ["draft", "in_progress", "sent"];
    return projectOffers.some(
      (o) =>
        o.id !== offer.id &&
        o.companyId === offer.companyId &&
        activePhases.includes(o.phase ?? "")
    );
  }, [projectOffers, offer?.id, offer?.projectId, offer?.companyId]);

  // Filter projects client-side: anything not "completed" is allowed.
  // Also support search.
  const [projectSearch, setProjectSearch] = useState("");

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

  // Extract customers from paginated response
  const customers = customersData?.data ?? [];
  const customerTotalPages = Math.ceil(
    (customersData?.total ?? 0) / customerPageSize
  );

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
  const updateSentDate = useUpdateOfferSentDate();
  const updateStartDate = useUpdateOfferStartDate();
  const updateEndDate = useUpdateOfferEndDate();
  const updateCost = useUpdateOfferCost();

  const acceptOffer = useAcceptOffer();
  const rejectOffer = useRejectOffer();
  const sendOffer = useSendOffer();
  const advanceOffer = useAdvanceOffer();
  const acceptOrder = useAcceptOrder();
  const completeOffer = useCompleteOffer();
  const reopenOffer = useReopenOffer();
  const revertToSent = useRevertToSent();
  const updateHealth = useUpdateOfferHealth();
  const deleteOffer = useDeleteOffer();

  const [isResponsibleModalOpen, setIsResponsibleModalOpen] = useState(false);

  const [isSendDetailsModalOpen, setIsSendDetailsModalOpen] = useState(false);
  const [isProbabilityPromptOpen, setIsProbabilityPromptOpen] = useState(false);
  const [probabilityContext, setProbabilityContext] = useState<
    "won" | "reverted"
  >("won");
  const [pendingProbability, setPendingProbability] = useState(0);
  const [localProbability, setLocalProbability] = useState(0);
  const [localCompletionPercent, setLocalCompletionPercent] = useState(0);

  // Project confirmation state
  const [pendingProject, setPendingProject] = useState<any>(null);
  const [showDisconnectConfirm, setShowDisconnectConfirm] = useState(false);
  const [showChangeConfirm, setShowChangeConfirm] = useState(false);

  // Confirmation state
  const [confirmationAction, setConfirmationAction] = useState<
    "win" | "loss" | null
  >(null);

  const [projectCreationName, setProjectCreationName] = useState("");
  const [orderStartDate, setOrderStartDate] = useState<Date | undefined>();
  const [orderEndDate, setOrderEndDate] = useState<Date | undefined>();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showReopenConfirm, setShowReopenConfirm] = useState(false);
  const [showCompleteConfirm, setShowCompleteConfirm] = useState(false);
  const [showRevertToSentConfirm, setShowRevertToSentConfirm] = useState(false);

  useEffect(() => {
    if (confirmationAction === "win" && offer) {
      setProjectCreationName(`[AUTO] ${offer.title || ""}`);
    }
  }, [confirmationAction, offer]);

  // Sync local probability and completion when offer loads or updates
  useEffect(() => {
    if (offer) {
      if (offer.probability !== undefined) {
        setLocalProbability(offer.probability);
      }
      if (offer.completionPercent !== undefined) {
        setLocalCompletionPercent(offer.completionPercent);
      }
    }
  }, [offer]);

  const calcCost = offer?.cost ?? 0;
  const calcPrice = offer?.value ?? 0;

  const calcDB = calcPrice - calcCost;
  const calcDG = calcPrice > 0 ? (calcDB / calcPrice) * 100 : 0;

  const isLocked =
    (offer?.phase as string) === "won" ||
    (offer?.phase as string) === "order" ||
    (offer?.phase as string) === "completed" ||
    (offer?.phase as string) === "lost" ||
    (offer?.phase as string) === "archived";

  // Partial lock allows editing external_reference and responsible in order phase
  const isPartiallyLocked =
    (offer?.phase as string) === "won" ||
    (offer?.phase as string) === "completed" ||
    (offer?.phase as string) === "lost" ||
    (offer?.phase as string) === "archived";

  // Cost and price can still be edited in completed phase to adjust calculations
  const isCostPriceLocked =
    (offer?.phase as string) === "won" ||
    (offer?.phase as string) === "lost" ||
    (offer?.phase as string) === "archived";

  const isOrderPhase = (offer?.phase as string) === "order";
  const isCompletedPhase = (offer?.phase as string) === "completed";

  const _dwTotalCost =
    (offer?.dwMaterialCosts ?? 0) +
    (offer?.dwEmployeeCosts ?? 0) +
    (offer?.dwOtherCosts ?? 0);

  const _dwInvoiced = offer?.dwTotalIncome ?? 0;

  const showOrderPhase = false;

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
          <div className="w-full">
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
                      {isLocked ? (
                        <span>{offer.title || ""}</span>
                      ) : (
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
                      )}
                    </h1>
                    <OfferStatusBadge
                      phase={offer.phase || "draft"}
                      className="px-3 py-1 text-base"
                    />
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
              <div className="flex items-center gap-2">
                {(offer.phase === "draft" || offer.phase === "in_progress") && (
                  <Button
                    className="bg-purple-600 text-white hover:bg-purple-700"
                    onClick={() => setIsSendDetailsModalOpen(true)}
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
                        className="cursor-pointer text-green-600 focus:bg-green-50 focus:text-green-600"
                        onClick={() => setConfirmationAction("win")}
                      >
                        <Trophy className="mr-2 h-4 w-4" />
                        Konverter til ordre
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-600"
                        onClick={() => setConfirmationAction("loss")}
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Tapt
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer text-muted-foreground focus:bg-gray-100"
                        onClick={() =>
                          advanceOffer.mutate({
                            id: offer.id!,
                            phase: "in_progress",
                          })
                        }
                      >
                        <Undo2 className="mr-2 h-4 w-4" />
                        Tilbake til <OfferStatusBadge phase="in_progress" />
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}

                {offer.phase === "order" && (
                  <Button
                    className="bg-slate-600 text-white hover:bg-slate-700"
                    onClick={() => setShowCompleteConfirm(true)}
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Marker som ferdig
                  </Button>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-5 w-5 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {isCompletedPhase && (
                      <DropdownMenuItem
                        className="cursor-pointer text-amber-600 focus:bg-amber-50 focus:text-amber-600"
                        onClick={() => setShowReopenConfirm(true)}
                      >
                        <Undo2 className="mr-2 h-4 w-4" />
                        Gjenåpne som ordre
                      </DropdownMenuItem>
                    )}
                    {isOrderPhase && (
                      <DropdownMenuItem
                        className="cursor-pointer text-amber-600 focus:bg-amber-50 focus:text-amber-600"
                        onClick={() => setShowRevertToSentConfirm(true)}
                      >
                        <Undo2 className="mr-2 h-4 w-4" />
                        Tilbakestill til sendt
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-600"
                      onClick={() => setShowDeleteConfirm(true)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Slett tilbud
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Confirmation Dialog */}
                <AlertDialog
                  open={!!confirmationAction}
                  onOpenChange={(open) => !open && setConfirmationAction(null)}
                >
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        {confirmationAction === "win" && "Konverter til ordre?"}
                        {confirmationAction === "loss" && "Marker som tapt?"}
                      </AlertDialogTitle>
                      <AlertDialogDescription asChild>
                        <div className="space-y-4">
                          {confirmationAction === "win" && (
                            <>
                              {!offer.projectId ? (
                                <>
                                  <p>
                                    <strong>Gratulerer!</strong>
                                    <br /> Siden dette tilbudet ikke er koblet
                                    til et prosjekt, vil et prosjekt bli
                                    opprettet automatisk nar du bekrefter.
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    Dette vil være standardnavnet, men du kan
                                    valgfritt endre det nedenfor til noe som gir
                                    mer mening.
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
                                        Navnet ma vaere lenger enn 2 tegn
                                      </p>
                                    )}
                                  </div>
                                </>
                              ) : (
                                <>
                                  <p>
                                    Herlig! Er du sikker pa at du vil konvertere
                                    tilbudet som ordre?
                                  </p>
                                  {hasOtherActiveOffersFromSameCompany && (
                                    <Alert className="mt-4 border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
                                      <Info className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                                      <AlertTitle className="ml-2 text-amber-900 dark:text-amber-100">
                                        Obs! Andre tilbud vil utlope
                                      </AlertTitle>
                                      <AlertDescription className="ml-2 text-amber-800 dark:text-amber-200">
                                        Dette tilbudet er en del av et prosjekt.
                                        Hvis du gjør om tilbudet til ordre, vil
                                        alle andre aktive tilbud for{" "}
                                        <span
                                          className="font-medium"
                                          style={{
                                            color:
                                              COMPANIES[
                                                offer.companyId as CompanyId
                                              ]?.color,
                                          }}
                                        >
                                          {COMPANIES[
                                            offer.companyId as CompanyId
                                          ]?.name || "dette selskapet"}
                                        </span>{" "}
                                        i samme prosjekt automatisk settes til{" "}
                                        <OfferStatusBadge phase="expired" />
                                      </AlertDescription>
                                    </Alert>
                                  )}
                                  <div className="mt-4 flex flex-wrap gap-4">
                                    <div className="min-w-[140px] flex-1">
                                      <Label className="text-sm text-muted-foreground">
                                        Startdato{" "}
                                        <span className="text-xs">
                                          (valgfritt)
                                        </span>
                                      </Label>
                                      <SmartDatePicker
                                        value={orderStartDate}
                                        onSelect={setOrderStartDate}
                                        disabledDates={(date) => {
                                          if (
                                            orderEndDate &&
                                            date > orderEndDate
                                          )
                                            return true;
                                          return false;
                                        }}
                                        className="mt-1 w-full"
                                      />
                                    </div>
                                    <div className="min-w-[140px] flex-1">
                                      <Label className="text-sm text-muted-foreground">
                                        Sluttdato{" "}
                                        <span className="text-xs">
                                          (valgfritt)
                                        </span>
                                      </Label>
                                      <SmartDatePicker
                                        value={orderEndDate}
                                        onSelect={setOrderEndDate}
                                        disabledDates={(date) => {
                                          if (
                                            orderStartDate &&
                                            date < orderStartDate
                                          )
                                            return true;
                                          return false;
                                        }}
                                        className="mt-1 w-full"
                                      />
                                    </div>
                                  </div>
                                  <div className="mt-2 text-sm text-muted-foreground">
                                    Tilbudet gar over til ordrefase. Du kan
                                    følge opp okonomi og fremdrift direkte pa
                                    tilbudet.
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
                        onClick={async () => {
                          if (confirmationAction === "win") {
                            if (!offer.projectId) {
                              // Use acceptOffer which creates a project
                              await acceptOffer.mutateAsync({
                                id: offer.id!,
                                createProject: true,
                                projectName: projectCreationName,
                              });
                            } else {
                              // Use acceptOrder for the sent -> order transition
                              await acceptOrder.mutateAsync({ id: offer.id! });
                            }
                            // Update start/end dates if provided
                            if (orderStartDate) {
                              updateStartDate.mutate({
                                id: offer.id!,
                                startDate: orderStartDate.toISOString(),
                              });
                            }
                            if (orderEndDate) {
                              updateEndDate.mutate({
                                id: offer.id!,
                                endDate: orderEndDate.toISOString(),
                              });
                            }
                            // Reset date state
                            setOrderStartDate(undefined);
                            setOrderEndDate(undefined);
                            confetti({
                              particleCount: 100,
                              spread: 70,
                              origin: { y: 0.6 },
                              colors: ["#f59e0b", "#d97706", "#b45309"],
                            });
                          } else if (confirmationAction === "loss") {
                            rejectOffer.mutate({ id: offer.id! });
                          }
                          setConfirmationAction(null);
                        }}
                      >
                        {confirmationAction === "win" && "Aksepter som ordre"}
                        {confirmationAction === "loss" && "Marker som tapt"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <DeleteConfirmationModal
                  isOpen={showDeleteConfirm}
                  onClose={() => setShowDeleteConfirm(false)}
                  onConfirm={async () => {
                    await deleteOffer.mutateAsync(offer.id!);
                    router.push("/offers");
                  }}
                  title="Slett tilbud?"
                  description="Dette vil slette tilbudet permanent. Handlingen kan ikke angres."
                />

                {/* Reopen Confirmation Dialog */}
                <AlertDialog
                  open={showReopenConfirm}
                  onOpenChange={setShowReopenConfirm}
                >
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Gjenåpne som ordre?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Er du sikker på at du vil gjenåpne dette tilbudet som en
                        aktiv ordre? Dette vil flytte tilbudet tilbake til
                        ordrefasen slik at du kan fortsette å oppdatere
                        kostnader, fakturering og fremdrift.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Avbryt</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-amber-600 hover:bg-amber-700"
                        onClick={() => {
                          reopenOffer.mutate(offer.id!);
                          setShowReopenConfirm(false);
                        }}
                      >
                        Gjenåpne som ordre
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                {/* Revert to Sent Confirmation Dialog */}
                <AlertDialog
                  open={showRevertToSentConfirm}
                  onOpenChange={setShowRevertToSentConfirm}
                >
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Tilbakestill til sendt?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Er du sikker på at du vil sette dette tilbudet tilbake
                        til <OfferStatusBadge phase="sent" /> Start- og
                        sluttdatoer vil bli fjernet.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Avbryt</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-amber-600 hover:bg-amber-700"
                        onClick={() => {
                          revertToSent.mutate(offer.id!);
                          setShowRevertToSentConfirm(false);
                        }}
                      >
                        Tilbakestill til sendt
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                {/* Complete Confirmation Dialog */}
                <AlertDialog
                  open={showCompleteConfirm}
                  onOpenChange={setShowCompleteConfirm}
                >
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Marker som ferdig?</AlertDialogTitle>
                      <AlertDialogDescription asChild>
                        <div className="space-y-4">
                          {/* Check for potential issues */}
                          {(() => {
                            const invoicedPercent =
                              calcPrice > 0
                                ? ((offer.invoiced || 0) / calcPrice) * 100
                                : 0;
                            const spentPercent =
                              calcCost > 0
                                ? ((offer.spent || 0) / calcCost) * 100
                                : 0;
                            const completionPercent =
                              offer.completionPercent || 0;

                            const hasWarnings =
                              invoicedPercent < 100 ||
                              spentPercent < 80 ||
                              completionPercent < 100;

                            if (hasWarnings) {
                              return (
                                <>
                                  <Alert className="border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
                                    <Info className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                                    <AlertTitle className="ml-2 text-amber-900 dark:text-amber-100">
                                      Er du sikker?
                                    </AlertTitle>
                                    <AlertDescription className="ml-2 text-amber-800 dark:text-amber-200">
                                      Tallene indikerer at ordren kanskje ikke
                                      er helt ferdig:
                                    </AlertDescription>
                                  </Alert>
                                  <ul className="ml-4 list-disc space-y-1 text-sm text-muted-foreground">
                                    {invoicedPercent < 100 && (
                                      <li>
                                        Fakturert:{" "}
                                        <span className="font-medium text-foreground">
                                          {Math.round(invoicedPercent)}%
                                        </span>{" "}
                                        av total pris (
                                        {new Intl.NumberFormat("nb-NO", {
                                          style: "currency",
                                          currency: "NOK",
                                          maximumFractionDigits: 0,
                                        }).format(offer.invoiced || 0)}{" "}
                                        av{" "}
                                        {new Intl.NumberFormat("nb-NO", {
                                          style: "currency",
                                          currency: "NOK",
                                          maximumFractionDigits: 0,
                                        }).format(calcPrice)}
                                        )
                                      </li>
                                    )}
                                    {spentPercent < 80 && (
                                      <li>
                                        Påløpte kostnader:{" "}
                                        <span className="font-medium text-foreground">
                                          {Math.round(spentPercent)}%
                                        </span>{" "}
                                        av beregnet kostnad. <br />
                                        Dette vil i så fall gi en dekningsgrad
                                        på{" "}
                                        <span
                                          className={`font-medium ${
                                            (offer.invoiced || 0) <
                                            (offer.spent || 0)
                                              ? "text-red-600"
                                              : "text-green-600"
                                          }`}
                                        >
                                          {Math.round(
                                            (((offer.invoiced || 0) -
                                              (offer.spent || 0)) /
                                              (offer.invoiced || 1)) *
                                              100
                                          )}
                                          %
                                        </span>
                                      </li>
                                    )}
                                    {completionPercent < 100 && (
                                      <li>
                                        Ferdigstillelse:{" "}
                                        <span className="font-medium text-foreground">
                                          {completionPercent}%
                                        </span>
                                      </li>
                                    )}
                                  </ul>
                                </>
                              );
                            }
                            return (
                              <p>
                                Tallene ser bra ut! Ordren ser ut til å være
                                fullført.
                              </p>
                            );
                          })()}
                          <p className="text-sm text-muted-foreground">
                            Når ordren er markert som ferdig vil den låses for
                            videre redigering. Du kan senere gjenåpne den via
                            menyen hvis nødvendig.
                          </p>
                        </div>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Avbryt</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-slate-600 hover:bg-slate-700"
                        onClick={() => {
                          completeOffer.mutate(offer.id!);
                          setShowCompleteConfirm(false);
                        }}
                      >
                        Marker som ferdig
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-2">
          {/* Tabs Section */}
          <Tabs
            value={activeTab}
            className="w-full space-y-4"
            onValueChange={handleTabChange}
          >
            <div className="sticky top-0 z-30 bg-background pb-2 before:absolute before:-top-96 before:left-0 before:right-0 before:h-96 before:bg-background">
              <TabsList>
                <TabsTrigger value="overview">Oversikt</TabsTrigger>
                <TabsTrigger value="information">Informasjon</TabsTrigger>
                <TabsTrigger value="economy">Økonomi</TabsTrigger>
                <TabsTrigger value="suppliers">Leverandører</TabsTrigger>
                <TabsTrigger value="documents">
                  Dokumenter ({offer?.filesCount ?? 0})
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Status callouts shown below tabs */}
            {offer.phase === "lost" && (
              <Alert className="border-amber-200 bg-amber-100 text-amber-900 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
                <Info className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <AlertTitle className="ml-2 text-amber-900 dark:text-amber-100">
                  Tilbudet er tapt
                </AlertTitle>
                <AlertDescription className="ml-2 text-amber-800 dark:text-amber-200">
                  Dette tilbudet er i en tapt tilstand, og mange felter kan
                  derfor ikke oppdateres. Dette er for å bevare historikken.
                </AlertDescription>
              </Alert>
            )}
            {offer.phase === "completed" && (
              <Alert className="border-green-200 bg-green-100 text-emerald-950 dark:border-green-800 dark:bg-green-950/30 dark:text-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertTitle className="text-emerald-950 dark:text-green-100">
                  Ordren er fullført
                </AlertTitle>
                <AlertDescription className="text-emerald-900 dark:text-green-200">
                  Denne ordren er ferdigstilt og alle felter kan ikke lenger
                  redigeres. Alle kostnader og fakturaer er bokført. Du kan
                  gjenåpne ordren hvis det er behov for justeringer.
                </AlertDescription>
              </Alert>
            )}

            <TabsContent value="overview" className="space-y-6">
              {/* Legacy "won" alert removed - new flow uses order/completed phases */}
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
                        onOpenChange={(open) => {
                          setIsCustomerModalOpen(open);
                          if (!open) {
                            // Reset search and page when closing
                            setCustomerSearch("");
                            setCustomerPage(1);
                          }
                        }}
                      >
                        <DialogContent className="flex max-h-[90vh] w-[95vw] max-w-[95vw] flex-col">
                          <DialogHeader>
                            <DialogTitle>Bytt kunde</DialogTitle>
                            <DialogDescription>
                              Søk etter og velg kunden som dette tilbudet skal
                              tilhøre.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="flex flex-1 flex-col space-y-4 overflow-hidden">
                            <Input
                              placeholder="Søk etter kunde (navn eller org.nr)..."
                              value={customerSearch}
                              onChange={(e) =>
                                setCustomerSearch(e.target.value)
                              }
                              className="focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0"
                            />
                            <div className="flex-1 overflow-auto rounded-md border">
                              {isLoadingCustomers ? (
                                <div className="flex items-center justify-center py-12">
                                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                </div>
                              ) : customers.length === 0 ? (
                                <div className="py-12 text-center text-muted-foreground">
                                  {customerSearch
                                    ? "Ingen kunder funnet"
                                    : "Ingen kunder"}
                                </div>
                              ) : (
                                <CustomerListTable
                                  compact={true}
                                  customers={customers}
                                  onCustomerClick={(customer) => {
                                    updateOfferCustomer.mutate({
                                      id: offer.id!,
                                      data: { customerId: customer.id! },
                                    });
                                    setIsCustomerModalOpen(false);
                                  }}
                                />
                              )}
                            </div>
                            {customerTotalPages > 1 && (
                              <PaginationControls
                                currentPage={customerPage}
                                totalPages={customerTotalPages}
                                onPageChange={setCustomerPage}
                                pageSize={customerPageSize}
                                totalCount={customersData?.total ?? 0}
                                entityName="kunder"
                              />
                            )}
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
                          role="button"
                          onClick={() => setIsResponsibleModalOpen(true)}
                          className="-ml-1 cursor-pointer rounded border border-transparent p-1 px-1 font-medium transition-colors hover:border-input hover:bg-transparent"
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
                                className="group"
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
                                    <span className="text-xs text-muted-foreground group-data-[selected=true]:text-accent-foreground/70">
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

                    {!isOrderPhase && !isCompletedPhase && (
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
                              setProbabilityContext(
                                isChecked ? "won" : "reverted"
                              );
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
                    )}

                    {/* Date fields section */}
                    <div className="flex flex-wrap justify-between">
                      {/* Frist (due date): show in draft/in_progress phases */}
                      {(offer.phase === "draft" ||
                        offer.phase === "in_progress") && (
                        <div className="min-w-[200px] flex-1">
                          <p className="mb-1 text-sm text-muted-foreground">
                            Frist <span className="text-xs">(valgfritt)</span>
                          </p>
                          <SmartDatePicker
                            value={
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
                                    : (null as unknown as undefined),
                                },
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
                      {/* Sendt dato: show in sent phase and later, editable on hover */}
                      {offer.sentDate && (
                        <div className="min-w-[200px] flex-1">
                          <p className="mb-1 text-sm text-muted-foreground">
                            Sendt dato
                          </p>
                          <Popover>
                            <PopoverTrigger asChild disabled={isLocked}>
                              <button
                                className={cn(
                                  "group -ml-2 flex items-center gap-2 rounded-md px-2 py-1 text-left font-medium transition-colors",
                                  !isLocked && "cursor-pointer hover:bg-muted"
                                )}
                                disabled={isLocked}
                              >
                                {format(new Date(offer.sentDate), "dd.MM.yyyy")}
                                {!isLocked && (
                                  <Pencil className="h-3 w-3 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                                )}
                              </button>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={new Date(offer.sentDate)}
                                onSelect={(date) => {
                                  if (date) {
                                    updateSentDate.mutate({
                                      id: offer.id!,
                                      sentDate: date.toISOString(),
                                    });
                                  }
                                }}
                                disabled={(date) => {
                                  const today = new Date();
                                  today.setHours(23, 59, 59, 999);
                                  if (date > today) return true;
                                  if (offer.expirationDate) {
                                    const expDate = new Date(
                                      offer.expirationDate
                                    );
                                    if (date > expDate) return true;
                                  }
                                  return false;
                                }}
                                locale={nb}
                                initialFocus
                              />
                              <div className="border-t p-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="w-full text-destructive hover:text-destructive"
                                  onClick={() => {
                                    updateSentDate.mutate({
                                      id: offer.id!,
                                      sentDate: undefined,
                                    });
                                  }}
                                >
                                  <X className="mr-2 h-4 w-4" />
                                  Fjern dato
                                </Button>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                      )}
                      {/* Vedståelsesfrist: show in sent phase */}
                      {offer.phase === "sent" && (
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
                                  : (null as unknown as undefined),
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
                      {/* Startdato: show in order/completed phases, always editable */}
                      {(offer.phase === "order" ||
                        offer.phase === "completed") && (
                        <div className="min-w-[140px] flex-1">
                          <p className="mb-1 text-sm text-muted-foreground">
                            Startdato
                          </p>
                          {offer.startDate ? (
                            <Popover>
                              <PopoverTrigger asChild>
                                <button className="group -ml-2 flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 text-left font-medium transition-colors hover:bg-muted">
                                  {format(
                                    new Date(offer.startDate),
                                    "dd.MM.yyyy"
                                  )}
                                  <Pencil className="h-3 w-3 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                                </button>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto p-0"
                                align="start"
                              >
                                <Calendar
                                  mode="single"
                                  selected={new Date(offer.startDate)}
                                  onSelect={(date) => {
                                    if (date) {
                                      updateStartDate.mutate({
                                        id: offer.id!,
                                        startDate: date.toISOString(),
                                      });
                                    }
                                  }}
                                  disabled={(date) => {
                                    // Cannot be before sent date
                                    if (offer.sentDate) {
                                      const sentDate = new Date(offer.sentDate);
                                      sentDate.setHours(0, 0, 0, 0);
                                      const checkDate = new Date(date);
                                      checkDate.setHours(0, 0, 0, 0);
                                      if (checkDate < sentDate) return true;
                                    }
                                    // Cannot be after end date
                                    if (offer.endDate) {
                                      const endDate = new Date(offer.endDate);
                                      if (date > endDate) return true;
                                    }
                                    return false;
                                  }}
                                  locale={nb}
                                  initialFocus
                                />
                                <div className="border-t p-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-full text-destructive hover:text-destructive"
                                    onClick={() => {
                                      updateStartDate.mutate({
                                        id: offer.id!,
                                        startDate: undefined,
                                      });
                                    }}
                                  >
                                    <X className="mr-2 h-4 w-4" />
                                    Fjern dato
                                  </Button>
                                </div>
                              </PopoverContent>
                            </Popover>
                          ) : (
                            <SmartDatePicker
                              value={undefined}
                              onSelect={(date) => {
                                if (date) {
                                  updateStartDate.mutate({
                                    id: offer.id!,
                                    startDate: date.toISOString(),
                                  });
                                }
                              }}
                              disabledDates={(date) => {
                                // Cannot be before sent date
                                if (offer.sentDate) {
                                  const sentDate = new Date(offer.sentDate);
                                  sentDate.setHours(0, 0, 0, 0);
                                  const checkDate = new Date(date);
                                  checkDate.setHours(0, 0, 0, 0);
                                  if (checkDate < sentDate) return true;
                                }
                                // Cannot be after end date
                                if (offer.endDate) {
                                  const endDate = new Date(offer.endDate);
                                  if (date > endDate) return true;
                                }
                                return false;
                              }}
                              className="w-full"
                            />
                          )}
                        </div>
                      )}
                      {/* Sluttdato: show in order/completed phases, editable on hover */}
                      {(offer.phase === "order" ||
                        offer.phase === "completed") && (
                        <div className="min-w-[140px] flex-1">
                          <p className="mb-1 text-sm text-muted-foreground">
                            Sluttdato
                          </p>
                          {offer.endDate ? (
                            <Popover>
                              <PopoverTrigger asChild>
                                <button className="group -ml-2 flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 text-left font-medium transition-colors hover:bg-muted">
                                  {format(
                                    new Date(offer.endDate),
                                    "dd.MM.yyyy"
                                  )}
                                  <Pencil className="h-3 w-3 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                                </button>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto p-0"
                                align="start"
                              >
                                <Calendar
                                  mode="single"
                                  selected={new Date(offer.endDate)}
                                  onSelect={(date) => {
                                    if (date) {
                                      updateEndDate.mutate({
                                        id: offer.id!,
                                        endDate: date.toISOString(),
                                      });
                                    }
                                  }}
                                  disabled={(date) => {
                                    // Cannot be before start date
                                    if (offer.startDate) {
                                      const startDate = new Date(
                                        offer.startDate
                                      );
                                      startDate.setHours(0, 0, 0, 0);
                                      const checkDate = new Date(date);
                                      checkDate.setHours(0, 0, 0, 0);
                                      if (checkDate < startDate) return true;
                                    } else if (offer.sentDate) {
                                      // If no start date, cannot be before sent date
                                      const sentDate = new Date(offer.sentDate);
                                      sentDate.setHours(0, 0, 0, 0);
                                      const checkDate = new Date(date);
                                      checkDate.setHours(0, 0, 0, 0);
                                      if (checkDate < sentDate) return true;
                                    }
                                    return false;
                                  }}
                                  locale={nb}
                                  initialFocus
                                />
                                <div className="border-t p-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-full text-destructive hover:text-destructive"
                                    onClick={() => {
                                      updateEndDate.mutate({
                                        id: offer.id!,
                                        endDate: undefined,
                                      });
                                    }}
                                  >
                                    <X className="mr-2 h-4 w-4" />
                                    Fjern dato
                                  </Button>
                                </div>
                              </PopoverContent>
                            </Popover>
                          ) : (
                            <SmartDatePicker
                              value={undefined}
                              onSelect={(date) => {
                                if (date) {
                                  updateEndDate.mutate({
                                    id: offer.id!,
                                    endDate: date.toISOString(),
                                  });
                                }
                              }}
                              disabledDates={(date) => {
                                // Cannot be before start date
                                if (offer.startDate) {
                                  const startDate = new Date(offer.startDate);
                                  startDate.setHours(0, 0, 0, 0);
                                  const checkDate = new Date(date);
                                  checkDate.setHours(0, 0, 0, 0);
                                  if (checkDate < startDate) return true;
                                } else if (offer.sentDate) {
                                  // If no start date, cannot be before sent date
                                  const sentDate = new Date(offer.sentDate);
                                  sentDate.setHours(0, 0, 0, 0);
                                  const checkDate = new Date(date);
                                  checkDate.setHours(0, 0, 0, 0);
                                  if (checkDate < sentDate) return true;
                                }
                                return false;
                              }}
                              className="w-full"
                            />
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="flex h-full flex-col">
                  <CardHeader>
                    <CardTitle>Totalt kalkulert</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col space-y-6">
                    <div className="flex flex-wrap gap-4">
                      <div className="min-w-[200px] flex-1 space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">
                          Total kost
                        </p>
                        <div className="flex items-center gap-2">
                          <InlineEdit
                            type="currency"
                            value={offer.cost || 0}
                            onSave={async (val) => {
                              await updateCost.mutateAsync({
                                id: offer.id!,
                                cost: Number(val),
                              });
                            }}
                            disabled={isCostPriceLocked}
                            className={cn(
                              "-ml-2 border-transparent p-2 text-2xl font-bold",
                              !isCostPriceLocked &&
                                "hover:border-input hover:bg-transparent"
                            )}
                          />
                        </div>
                      </div>
                      <div className="min-w-[200px] flex-1 space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">
                          Total pris
                        </p>
                        <div className="flex items-center gap-2">
                          <InlineEdit
                            type="currency"
                            value={offer.value || 0}
                            onSave={async (val) => {
                              await updateValue.mutateAsync({
                                id: offer.id!,
                                data: { value: Number(val) },
                              });
                            }}
                            disabled={isCostPriceLocked}
                            className={cn(
                              "-ml-2 border-transparent p-2 text-2xl font-bold",
                              !isCostPriceLocked &&
                                "hover:border-input hover:bg-transparent"
                            )}
                          />
                          {offer.dwTotalIncome !== undefined &&
                            offer.dwTotalIncome > (offer.value || 0) &&
                            (offer.invoiced || 0) !== 0 && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <AlertTriangle className="h-5 w-5 cursor-pointer text-orange-500" />
                                </TooltipTrigger>
                                <TooltipContent className="max-w-[280px]">
                                  <p className="font-medium">
                                    Kalkulert pris avviker fra CW
                                  </p>
                                  <p className="mt-1 text-xs text-muted-foreground">
                                    Kalkulert pris fra CW er{" "}
                                    {new Intl.NumberFormat("nb-NO", {
                                      style: "currency",
                                      currency: "NOK",
                                      maximumFractionDigits: 0,
                                    }).format(offer.dwTotalIncome)}
                                    . Vil du oppdatere total pris?
                                  </p>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="mt-2 w-full"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      updateValue.mutate({
                                        id: offer.id!,
                                        data: {
                                          value: offer.dwTotalIncome || 0,
                                        },
                                      });
                                    }}
                                    disabled={updateValue.isPending}
                                  >
                                    {updateValue.isPending ? (
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : null}
                                    Oppdater til{" "}
                                    {new Intl.NumberFormat("nb-NO", {
                                      style: "currency",
                                      currency: "NOK",
                                      maximumFractionDigits: 0,
                                    }).format(offer.dwTotalIncome)}
                                  </Button>
                                </TooltipContent>
                              </Tooltip>
                            )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 rounded-lg bg-muted/50 p-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-muted-foreground">
                          Forventet DG (%)
                        </p>
                        <p className="text-2xl font-bold">
                          {calcDG ? calcDG.toFixed(2) : "0.00"} %
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

                    {/* Hide probability in order/completed phase - it's 100% by definition */}
                    {!isOrderPhase && !isCompletedPhase && (
                      <div className="space-y-6 border-t pt-6">
                        <div>
                          <div className="mb-2 text-sm text-muted-foreground">
                            <div>Sannsynlighet: {localProbability}%</div>
                            <div className="text-xs text-orange-500">
                              {isLocked
                                ? "Slik den var når tilbudet ble lukket"
                                : ""}
                            </div>
                          </div>
                          <div className="w-full">
                            <Slider
                              value={[localProbability]}
                              max={90}
                              min={10}
                              step={10}
                              disabled={isLocked}
                              onValueChange={(val) =>
                                setLocalProbability(val[0])
                              }
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
                    )}

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
                            <span>
                              {offer.projectName || "Ukjent prosjekt"}
                            </span>
                          </Link>
                        ) : (
                          <span className="italic text-muted-foreground">
                            Ikke tilknyttet prosjekt
                          </span>
                        )}
                        {!isPartiallyLocked && (
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
                        <DialogContent className="flex max-h-[90vh] w-[95vw] max-w-[95vw] flex-col">
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
                                projects={(filteredProjects as Project[]) || []}
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
                  </CardContent>
                  <CardFooter className="flex flex-col gap-2 border-t bg-muted/30 px-6 py-4 text-xs text-muted-foreground">
                    <div className="flex w-full items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-28 shrink-0">Opprettet av</span>
                        {offer.createdByName ?? (
                          <Badge
                            variant="secondary"
                            className="h-4 px-1 text-[10px]"
                          >
                            System
                          </Badge>
                        )}
                      </div>
                      <span>
                        {offer.createdAt
                          ? format(
                              new Date(offer.createdAt),
                              "dd.MM.yyyy HH:mm"
                            )
                          : "Ukjent"}
                      </span>
                    </div>
                    <div className="flex w-full items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-28 shrink-0">Sist oppdatert av</span>
                        {offer.updatedByName ?? (
                          <Badge
                            variant="secondary"
                            className="h-4 px-1 text-[10px]"
                          >
                            System
                          </Badge>
                        )}
                      </div>
                      <span>
                        {offer.updatedAt
                          ? format(
                              new Date(offer.updatedAt),
                              "dd.MM.yyyy HH:mm"
                            )
                          : "Ukjent"}
                      </span>
                    </div>
                  </CardFooter>
                </Card>
              </div>

              {/* Execution Tracking Section - Only visible for order/completed phases */}
              {(isOrderPhase || isCompletedPhase) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex flex-col gap-1">
                        Oppfølging av ordre
                        <span className="text-xs">
                          Bokførte tall hentet fra NXT
                        </span>
                      </span>
                      {isCompletedPhase ? (
                        <OfferStatusBadge phase="completed" />
                      ) : (
                        offer.health && (
                          <OfferHealthBadge
                            health={
                              (offer.invoiced ?? 0) >= (offer.spent ?? 0)
                                ? "on_track"
                                : "at_risk"
                            }
                          />
                        )
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      {/* Spent tracking */}
                      <div className="space-y-2">
                        <p className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
                          Påløpte kostnader
                        </p>
                        <div className="flex items-center gap-2">
                          <p className="text-xl font-bold">
                            {new Intl.NumberFormat("nb-NO", {
                              style: "currency",
                              currency: "NOK",
                              maximumFractionDigits: 0,
                            }).format(offer.spent || 0)}
                          </p>
                          {(offer.spent || 0) > calcCost && calcCost > 0 && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <AlertTriangle className="h-5 w-5 cursor-pointer text-orange-500" />
                              </TooltipTrigger>
                              <TooltipContent className="max-w-[280px]">
                                <p className="font-medium">
                                  Påløpte kostnader overstiger kalkulert kostnad
                                </p>
                                <p className="mt-1 text-xs text-muted-foreground">
                                  Har det kommet tilleggsarbeid, eller var
                                  budsjettet for stramt? Vurder å oppdatere
                                  kalkulasjonen.
                                </p>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="mt-2 w-full"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    updateCost.mutate({
                                      id: offer.id!,
                                      cost: offer.spent || 0,
                                    });
                                  }}
                                  disabled={updateCost.isPending}
                                >
                                  {updateCost.isPending ? (
                                    <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                                  ) : null}
                                  Oppdater kostnad til påløpt beløp
                                </Button>
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </div>
                        {calcCost > 0 && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div>
                                <Progress
                                  value={((offer.spent || 0) / calcCost) * 100}
                                  className="h-2 cursor-help"
                                  indicatorClassName={
                                    ((offer.spent || 0) / calcCost) * 100 > 100
                                      ? "bg-red-600"
                                      : ((offer.spent || 0) / calcCost) * 100 >
                                          80
                                        ? "bg-orange-500"
                                        : "bg-green-600"
                                  }
                                />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <div className="space-y-1 text-sm">
                                <div className="flex justify-between gap-4">
                                  <span className="text-muted-foreground">
                                    Total kalkulert kost:
                                  </span>
                                  <span className="font-medium">
                                    {new Intl.NumberFormat("nb-NO", {
                                      style: "currency",
                                      currency: "NOK",
                                      maximumFractionDigits: 0,
                                    }).format(calcCost)}
                                  </span>
                                </div>
                                <div className="flex justify-between gap-4">
                                  <span className="text-muted-foreground underline">
                                    Påløpte kostnader:
                                  </span>
                                  <span className="font-medium">
                                    {new Intl.NumberFormat("nb-NO", {
                                      style: "currency",
                                      currency: "NOK",
                                      maximumFractionDigits: 0,
                                    }).format(offer.spent || 0)}
                                  </span>
                                </div>

                                <div className="border-t pt-1">
                                  <span className="font-medium">
                                    {Math.round(
                                      ((offer.spent || 0) / calcCost) * 100
                                    )}
                                    % av beregnet kostnad brukt
                                  </span>
                                </div>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>

                      {/* Invoiced tracking */}
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">
                          Fakturert
                        </p>
                        <div className="flex items-center gap-2">
                          <p className="text-xl font-bold">
                            {new Intl.NumberFormat("nb-NO", {
                              style: "currency",
                              currency: "NOK",
                              maximumFractionDigits: 0,
                            }).format(offer.invoiced || 0)}
                          </p>
                          {(offer.invoiced || 0) > calcPrice &&
                            calcPrice > 0 && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <AlertTriangle className="h-5 w-5 cursor-pointer text-orange-500" />
                                </TooltipTrigger>
                                <TooltipContent className="max-w-[280px]">
                                  <p className="font-medium">
                                    Fakturert beløp overstiger kalkulert pris
                                  </p>
                                  <p className="mt-1 text-xs text-muted-foreground">
                                    Er dette riktig? Vurder å oppdatere
                                    kalkulasjonen slik at den reflekterer
                                    faktisk pris.
                                  </p>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="mt-2 w-full"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      updateValue.mutate({
                                        id: offer.id!,
                                        data: { value: offer.invoiced || 0 },
                                      });
                                    }}
                                    disabled={updateValue.isPending}
                                  >
                                    {updateValue.isPending ? (
                                      <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                                    ) : null}
                                    Oppdater pris til fakturert beløp
                                  </Button>
                                </TooltipContent>
                              </Tooltip>
                            )}
                        </div>
                        {calcPrice > 0 && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div>
                                <Progress
                                  value={
                                    ((offer.invoiced || 0) / calcPrice) * 100
                                  }
                                  className="h-2 cursor-help"
                                  indicatorClassName=""
                                />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <div className="space-y-1 text-sm">
                                <div className="flex justify-between gap-4">
                                  <span className="text-muted-foreground">
                                    Total pris:
                                  </span>
                                  <span className="font-medium">
                                    {new Intl.NumberFormat("nb-NO", {
                                      style: "currency",
                                      currency: "NOK",
                                      maximumFractionDigits: 0,
                                    }).format(calcPrice)}
                                  </span>
                                </div>
                                <div className="flex justify-between gap-4">
                                  <span className="text-muted-foreground underline">
                                    Fakturert:
                                  </span>
                                  <span className="font-medium">
                                    {new Intl.NumberFormat("nb-NO", {
                                      style: "currency",
                                      currency: "NOK",
                                      maximumFractionDigits: 0,
                                    }).format(offer.invoiced || 0)}
                                  </span>
                                </div>

                                <div className="flex justify-between gap-4">
                                  <span className="text-muted-foreground">
                                    Gjenstående:
                                  </span>
                                  <span className="font-medium">
                                    {new Intl.NumberFormat("nb-NO", {
                                      style: "currency",
                                      currency: "NOK",
                                      maximumFractionDigits: 0,
                                    }).format(
                                      calcPrice - (offer.invoiced || 0)
                                    )}
                                  </span>
                                </div>
                                <div className="border-t pt-1">
                                  <span className="font-medium">
                                    {Math.round(
                                      ((offer.invoiced || 0) / calcPrice) * 100
                                    )}
                                    % av total pris fakturert
                                  </span>
                                </div>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-6 border-t pt-4">
                      <div className="min-w-[150px] flex-1">
                        <div className="flex flex-col gap-4">
                          <div className="flex flex-col gap-2">
                            <p className="text-sm text-muted-foreground">
                              {isCompletedPhase
                                ? "Fullført dekning"
                                : "Dekning så langt"}
                            </p>
                            <div className="flex items-center gap-2">
                              <p
                                className={cn(
                                  "font-mono text-lg font-bold",
                                  (offer.invoiced || 0) - (offer.spent || 0) < 0
                                    ? "text-red-600"
                                    : "text-green-600"
                                )}
                              >
                                {new Intl.NumberFormat("nb-NO", {
                                  style: "currency",
                                  currency: "NOK",
                                  maximumFractionDigits: 0,
                                  signDisplay: "exceptZero",
                                }).format(
                                  (offer.invoiced || 0) - (offer.spent || 0)
                                )}
                                <span
                                  className={cn("ml-2 text-xs text-primary")}
                                >
                                  {(
                                    (((offer.invoiced || 0) -
                                      (offer.spent || 0)) /
                                      (offer.invoiced || 1)) *
                                    100
                                  ).toFixed(2)}
                                  %
                                </span>
                              </p>
                            </div>
                          </div>
                          {isOrderPhase && offer.invoiced != offer.value && (
                            <div className="flex flex-col gap-2">
                              <p className="text-sm text-muted-foreground">
                                Beregnet dekning dersom alt faktureres uten
                                flere kostnader
                              </p>
                              <div className="flex items-center gap-2">
                                <p
                                  className={cn(
                                    "font-mono text-lg font-bold",
                                    (offer.value || 0) - (offer.spent || 0) < 0
                                      ? "text-red-600"
                                      : "text-green-600"
                                  )}
                                >
                                  {new Intl.NumberFormat("nb-NO", {
                                    style: "currency",
                                    currency: "NOK",
                                    maximumFractionDigits: 0,
                                    signDisplay: "exceptZero",
                                  }).format(
                                    (offer.value || 0) - (offer.spent || 0)
                                  )}
                                  <span
                                    className={cn("ml-2 text-xs text-primary")}
                                  >
                                    {(
                                      (((offer.value || 0) -
                                        (offer.spent || 0)) /
                                        (offer.value || 1)) *
                                      100
                                    ).toFixed(2)}
                                    %
                                  </span>
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="min-w-[150px] flex-1">
                        <p className="text-sm text-muted-foreground">
                          {isCompletedPhase
                            ? (offer.orderReserve ??
                                calcPrice - (offer.invoiced || 0)) < 0
                              ? "Overfakturert"
                              : "Ikke fakturert"
                            : "Gjenstår å fakturere"}
                        </p>
                        <p
                          className={cn(
                            "font-mono text-lg font-bold",
                            (offer.orderReserve ??
                              calcPrice - (offer.invoiced || 0)) < 0
                              ? "text-red-600"
                              : (offer.orderReserve ??
                                    calcPrice - (offer.invoiced || 0)) === 0
                                ? "text-muted-foreground"
                                : "text-green-600"
                          )}
                        >
                          {new Intl.NumberFormat("nb-NO", {
                            style: "currency",
                            currency: "NOK",
                            maximumFractionDigits: 0,
                            signDisplay: "exceptZero",
                          }).format(
                            offer.orderReserve ??
                              calcPrice - (offer.invoiced || 0)
                          )}
                        </p>
                      </div>
                    </div>

                    {isOrderPhase && showOrderPhase && (
                      <div className="flex flex-wrap gap-4 border-t pt-4">
                        <div className="min-w-[200px] flex-1">
                          <Label className="text-sm text-muted-foreground">
                            Helsestatus
                          </Label>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="outline"
                                className="mt-1 w-full justify-between"
                              >
                                {offer.health ? (
                                  <OfferHealthBadge health={offer.health} />
                                ) : (
                                  <span className="text-muted-foreground">
                                    Velg status...
                                  </span>
                                )}
                                <ChevronDown className="ml-2 h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="start"
                              className="w-[200px]"
                            >
                              <DropdownMenuItem
                                onClick={() =>
                                  updateHealth.mutate({
                                    id: offer.id!,
                                    health: "on_track",
                                  })
                                }
                              >
                                <OfferHealthBadge health="on_track" />
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  updateHealth.mutate({
                                    id: offer.id!,
                                    health: "at_risk",
                                  })
                                }
                              >
                                <OfferHealthBadge health="at_risk" />
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  updateHealth.mutate({
                                    id: offer.id!,
                                    health: "delayed",
                                  })
                                }
                              >
                                <OfferHealthBadge health="delayed" />
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  updateHealth.mutate({
                                    id: offer.id!,
                                    health: "over_budget",
                                  })
                                }
                              >
                                <OfferHealthBadge health="over_budget" />
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <div className="min-w-[200px] flex-1">
                          <Label className="text-sm text-muted-foreground">
                            Ferdigstillelse: {localCompletionPercent}%
                          </Label>
                          <Slider
                            value={[localCompletionPercent]}
                            max={100}
                            min={0}
                            step={5}
                            className="mt-3"
                            onValueChange={(val) =>
                              setLocalCompletionPercent(val[0])
                            }
                            onValueCommit={(val) => {
                              updateHealth.mutate({
                                id: offer.id!,
                                health:
                                  (offer.health as
                                    | "on_track"
                                    | "at_risk"
                                    | "delayed"
                                    | "over_budget") || "on_track",
                                completionPercent: val[0],
                              });
                            }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex w-full justify-end text-xs text-muted-foreground">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger className="cursor-default">
                            Synkronisert:{" "}
                            {offer.dwLastSyncedAt
                              ? formatDistanceToNow(
                                  new Date(offer.dwLastSyncedAt),
                                  {
                                    addSuffix: true,
                                    locale: nb,
                                  }
                                )
                              : "Aldri"}
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              {offer.dwLastSyncedAt
                                ? format(
                                    new Date(offer.dwLastSyncedAt),
                                    "dd.MM.yyyy HH:mm"
                                  )
                                : "Aldri synkronisert"}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </CardContent>
                </Card>
              )}

              <OfferDescription
                offerId={offer.id!}
                initialDescription={offer.description || ""}
              />

              <OfferNotesCard notes={offer.notes} />
            </TabsContent>

            <TabsContent value="information">
              <OfferInformationTab />
            </TabsContent>

            <TabsContent value="economy">
              <OfferEconomyTab />
            </TabsContent>

            <TabsContent value="suppliers" className="relative z-0">
              <OfferSuppliersTab offerId={resolvedParams.id} />
            </TabsContent>

            <TabsContent value="documents">
              <Card>
                <CardHeader>
                  <CardTitle>Dokumenter</CardTitle>
                </CardHeader>
                <CardContent>
                  <OfferFileManager offerId={resolvedParams.id} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <SendOfferDialog
        open={isSendDetailsModalOpen}
        onOpenChange={setIsSendDetailsModalOpen}
        onConfirm={(sentDate, expirationDate) => {
          sendOffer.mutate({
            id: offer.id!,
            sentDate,
            expirationDate,
          });
        }}
      />
    </AppLayout>
  );
}
