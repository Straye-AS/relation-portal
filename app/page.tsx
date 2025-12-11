"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { PageHeader } from "@/components/layout/page-header";
import { useDashboard } from "@/hooks/useDashboard";
import { CardSkeleton } from "@/components/ui/card-skeleton";
import { useCompanyStore } from "@/store/company-store";
import { PipelineOverview } from "@/components/dashboard/pipeline-overview";
import { OfferReserveCard } from "@/components/dashboard/offer-reserve-card";
import { OfferStatsCard } from "@/components/dashboard/offer-stats-card";
import { ProjectOrderReserveCard } from "@/components/dashboard/project-order-reserve-card";
import { RecentOffersCard } from "@/components/dashboard/recent-offers-card";
import { RecentProjectsCard } from "@/components/dashboard/recent-projects-card";
import { TopCustomersCard } from "@/components/dashboard/top-customers-card";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useEffect, useState, useMemo } from "react";
import { phaseLabels } from "@/components/dashboard/pipeline-overview";
import { OfferListModal } from "@/components/dashboard/offer-list-modal";
import { useOffers } from "@/hooks/useOffers";

import {
  DomainOfferPhase,
  Offer as DomainOfferDTO,
  DashboardMetrics,
} from "@/lib/api/types";

export default function DashboardPage() {
  const { userCompany } = useCompanyStore();
  const [timeRange, setTimeRange] = useState<"rolling12months" | "allTime">(
    "rolling12months"
  );
  const { data: rawMetrics, isLoading } = useDashboard({ timeRange });
  const metrics = rawMetrics as unknown as DashboardMetrics;
  const { refetch: refetchUser } = useCurrentUser();
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);

  // Fetch offers for the selected phase
  const { data: offersData } = useOffers(
    { phase: selectedPhase as DomainOfferPhase },
    { enabled: !!selectedPhase }
  );

  const phaseOffers = useMemo<DomainOfferDTO[]>(
    () => offersData?.data ?? [],
    [offersData?.data]
  );

  // Fetch projects for order reserve calculation
  // "Ordrereserve" = Sum(budget - spent) for all "won" (active/planning) projects
  // Validate auth on home page load
  useEffect(() => {
    refetchUser();
  }, [refetchUser]);

  if (isLoading) {
    return (
      <AppLayout>
        <PageHeader title="Dashboard" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </AppLayout>
    );
  }

  if (!metrics) {
    return (
      <AppLayout>
        <PageHeader title="Dashboard" />
        <div className="py-12 text-center">
          <p className="text-muted-foreground">Kunne ikke laste dashboard</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PageHeader
        title="Dashboard"
        subtitle={userCompany ? `Oversikt for ${userCompany.name}` : "Oversikt"}
        actions={
          <Tabs
            value={timeRange}
            onValueChange={(v) =>
              setTimeRange(v as "rolling12months" | "allTime")
            }
          >
            <TabsList>
              <TabsTrigger value="rolling12months">Siste 12 mnd</TabsTrigger>
              <TabsTrigger value="allTime">Alt</TabsTrigger>
            </TabsList>
          </Tabs>
        }
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        {/* Pipeline Overview */}
        {/* TODO: Update PipelineOverview component to use DomainPipelinePhaseData[] */}
        <PipelineOverview
          pipeline={
            metrics.pipeline as Parameters<
              typeof PipelineOverview
            >[0]["pipeline"]
          }
          onPhaseClick={setSelectedPhase}
        />

        {/* Key Metrics Row */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <OfferReserveCard
            offerReserve={metrics.offerReserve ?? 0}
            winRate={(metrics.winRateMetrics?.winRate ?? 0) * 100}
            economicWinRate={
              (metrics.winRateMetrics?.economicWinRate ?? 0) * 100
            }
            totalValue={metrics.offerReserve ?? 0} // Total value of ACTIVE offers
            weightedValue={metrics.weightedOfferReserve ?? 0}
            averageProbability={metrics.averageProbability ?? 0}
            wonCount={metrics.winRateMetrics?.wonCount}
            lostCount={metrics.winRateMetrics?.lostCount}
            periodLabel={
              timeRange === "rolling12months" ? "siste 12 mnd" : "totalt"
            }
          />
          <ProjectOrderReserveCard
            amount={metrics.orderReserve ?? 0}
            totalValue={metrics.totalValue ?? 0}
            invoicedAmount={metrics.totalInvoiced ?? 0}
            periodLabel={
              timeRange === "rolling12months" ? "Siste 12 mnd" : "Totalt"
            }
          />
          <OfferStatsCard data={metrics} />
          <QuickActions />
        </div>

        {/* Projects, Customers and Activity */}
        {/* TODO: Update these components to use Domain types */}
        {/* Projects, Customers and Activity */}
        {/* TODO: Update these components to use Domain types */}
        <div className="grid gap-4 pb-6 md:grid-cols-2">
          <RecentOffersCard
            offers={(metrics.recentOffers ?? []).filter(
              (o: DomainOfferDTO) =>
                o.phase !== DomainOfferPhase.OfferPhaseDraft
            )}
          />
          <RecentProjectsCard projects={metrics.recentProjects ?? []} />
          <TopCustomersCard
            customers={
              metrics.topCustomers as Parameters<
                typeof TopCustomersCard
              >[0]["customers"]
            }
          />
          <ActivityFeed
            activities={
              metrics.recentActivities as Parameters<
                typeof ActivityFeed
              >[0]["activities"]
            }
          />
        </div>
      </motion.div>

      <OfferListModal
        isOpen={!!selectedPhase}
        onClose={() => setSelectedPhase(null)}
        title={selectedPhase ? phaseLabels[selectedPhase] || selectedPhase : ""}
        offers={phaseOffers}
      />
    </AppLayout>
  );
}
