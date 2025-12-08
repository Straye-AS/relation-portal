"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { PageHeader } from "@/components/layout/page-header";
import { useDashboard } from "@/hooks/useDashboard";
import { CardSkeleton } from "@/components/ui/card-skeleton";
import { useCompanyStore } from "@/store/company-store";
import { PipelineOverview } from "@/components/dashboard/pipeline-overview";
import { OfferReserveCard } from "@/components/dashboard/offer-reserve-card";
import { RevenueForecast } from "@/components/dashboard/revenue-forecast";
import { TopDisciplines } from "@/components/dashboard/top-disciplines";
import { TeamPerformance } from "@/components/dashboard/team-performance";
import { ActiveProjectsCard } from "@/components/dashboard/active-projects-card";
import { TopCustomersCard } from "@/components/dashboard/top-customers-card";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { motion } from "framer-motion";

import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useEffect } from "react";

export default function DashboardPage() {
  const { userCompany } = useCompanyStore();
  const { data: metrics, isLoading } = useDashboard();
  const { refetch: refetchUser } = useCurrentUser();

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
        />

        {/* Key Metrics Row */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <OfferReserveCard
            offerReserve={metrics.offerReserve ?? 0}
            winRate={metrics.winRate ?? 0}
            totalValue={metrics.totalValue ?? 0}
          />
          <RevenueForecast
            forecast30Days={metrics.revenueForecast30Days ?? 0}
            forecast90Days={metrics.revenueForecast90Days ?? 0}
          />
          <QuickActions />
        </div>

        {/* Disciplines and Team Performance */}
        {/* TODO: Update these components to use Domain types */}
        <div className="grid gap-4 md:grid-cols-2">
          <TopDisciplines
            disciplines={
              metrics.topDisciplines as Parameters<
                typeof TopDisciplines
              >[0]["disciplines"]
            }
          />
          <TeamPerformance
            teamStats={
              metrics.teamPerformance as Parameters<
                typeof TeamPerformance
              >[0]["teamStats"]
            }
          />
        </div>

        {/* Projects, Customers and Activity */}
        {/* TODO: Update these components to use Domain types */}
        <div className="grid gap-4 pb-6 md:grid-cols-2 lg:grid-cols-3">
          <ActiveProjectsCard
            projects={
              metrics.activeProjects as Parameters<
                typeof ActiveProjectsCard
              >[0]["projects"]
            }
          />
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
    </AppLayout>
  );
}
