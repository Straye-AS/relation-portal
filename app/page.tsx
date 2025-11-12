"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { PageHeader } from "@/components/layout/page-header";
import { useDashboard } from "@/hooks/useDashboard";
import { CardSkeleton } from "@/components/ui/card-skeleton";
import { useCompanyStore } from "@/store/useCompanyStore";
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

export default function DashboardPage() {
  const { selectedCompanyId, getSelectedCompany } = useCompanyStore();
  const { data: metrics, isLoading } = useDashboard(selectedCompanyId);
  const selectedCompany = getSelectedCompany();

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
        <div className="text-center py-12">
          <p className="text-muted-foreground">Kunne ikke laste dashboard</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PageHeader
        title="Dashboard"
        subtitle={`Oversikt for ${selectedCompany.name}`}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        {/* Pipeline Overview */}
        <PipelineOverview pipeline={metrics.pipeline} />

        {/* Key Metrics Row */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <OfferReserveCard
            offerReserve={metrics.offerReserve}
            winRate={metrics.winRate}
            totalValue={metrics.totalValue}
          />
          <RevenueForecast
            forecast30Days={metrics.revenueForecast30Days}
            forecast90Days={metrics.revenueForecast90Days}
          />
          <QuickActions />
        </div>

        {/* Disciplines and Team Performance */}
        <div className="grid gap-4 md:grid-cols-2">
          <TopDisciplines disciplines={metrics.topDisciplines} />
          <TeamPerformance teamStats={metrics.teamPerformance} />
        </div>

        {/* Projects, Customers and Activity */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 pb-6">
          <ActiveProjectsCard projects={metrics.activeProjects} />
          <TopCustomersCard customers={metrics.topCustomers} />
          <ActivityFeed activities={metrics.recentActivities} />
        </div>
      </motion.div>
    </AppLayout>
  );
}
