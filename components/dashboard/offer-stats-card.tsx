"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, CheckCircle, XCircle, Archive } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { formatCurrency } from "@/lib/utils";
import { DashboardMetrics } from "@/lib/api/types";
import { phaseLabels } from "./pipeline-overview";

interface OfferStatsCardProps {
  data: DashboardMetrics;
}

export function OfferStatsCard({ data }: OfferStatsCardProps) {
  // Calculate stats from metrics
  const wonMetrics = data.winRateMetrics;

  // Calculate "Active" stats (everything not won or lost, excluding draft)
  const activePhases = ["in_progress", "sent"];
  const activePipeline = data.pipeline.filter((p) =>
    activePhases.includes(p.phase)
  );

  const activeCount = activePipeline.reduce((acc, p) => acc + p.count, 0);
  const activeValue = activePipeline.reduce((acc, p) => acc + p.totalValue, 0);
  const activeBreakdown = activePipeline.map((p) => ({
    label: phaseLabels[p.phase] || p.phase,
    count: p.count,
    value: p.totalValue,
  }));

  // Won stats
  const wonCount = wonMetrics?.wonCount ?? 0;
  const wonValue = wonMetrics?.wonValue ?? 0;

  // Lost stats
  const lostCount = wonMetrics?.lostCount ?? 0;
  const lostValue = wonMetrics?.lostValue ?? 0;

  // Total stats (Sum of Active, Won, Lost - excluding Drafts)
  // We calculate total from the pieces we allow, rather than using data.totalOfferCount which might include drafts
  const totalCount = activeCount + wonCount + lostCount;
  const totalValue = activeValue + wonValue + lostValue;

  const stats = [
    {
      label: "Aktive",
      count: activeCount,
      value: activeValue,
      breakdown: activeBreakdown,
      icon: FileText,
      color: "text-blue-500",
    },
    {
      label: "Vunnet",
      count: wonCount,
      value: wonValue,
      breakdown: [],
      icon: CheckCircle,
      color: "text-green-500",
    },
    {
      label: "Tapt",
      count: lostCount,
      value: lostValue,
      breakdown: [],
      icon: XCircle,
      color: "text-red-500",
    },
    {
      label: "Totalt",
      count: totalCount,
      value: totalValue,
      breakdown: [],
      icon: Archive,
      color: "text-purple-500",
    },
  ];

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-sm font-medium">Tilbudsstatistikk</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid h-full grid-cols-2 gap-4">
          {stats.map((stat) => (
            <HoverCard key={stat.label}>
              <HoverCardTrigger asChild>
                <div className="flex h-full cursor-pointer flex-col items-center justify-center space-y-2 rounded-lg border bg-card p-4 text-center transition-colors hover:bg-accent/50">
                  <div className="flex items-center space-x-2">
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                    <p className="text-xs font-medium text-muted-foreground">
                      {stat.label}
                    </p>
                  </div>
                  <p className="text-2xl font-bold">{stat.count}</p>
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="w-60">
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">{stat.label}</h4>
                  <div className="text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Antall:</span>
                      <span className="font-medium">{stat.count}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Verdi:</span>
                      <span className="font-medium">
                        {formatCurrency(stat.value)}
                      </span>
                    </div>
                  </div>
                  {stat.breakdown && stat.breakdown.length > 0 && (
                    <>
                      <div className="my-2 h-px bg-border" />
                      <div className="space-y-1">
                        <p className="mb-2 text-xs font-medium text-muted-foreground">
                          Fordeling per status
                        </p>
                        {stat.breakdown.map((item) => (
                          <div
                            key={item.label}
                            className="flex justify-between text-xs"
                          >
                            <span>{item.label}</span>
                            <div className="flex gap-2">
                              <span className="text-muted-foreground">
                                {item.count}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </HoverCardContent>
            </HoverCard>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
