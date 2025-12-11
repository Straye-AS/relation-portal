"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PipelinePhaseData } from "@/types";
import { motion } from "framer-motion";
import { formatCurrency } from "@/lib/utils";

interface PipelineOverviewProps {
  pipeline: PipelinePhaseData[];
  onPhaseClick?: (phase: string) => void;
}

export const phaseLabels: Record<string, string> = {
  draft: "Forespørsel",
  in_progress: "I gang",
  sent: "Sendt",
  won: "Vunnet",
  lost: "Tapt",
  expired: "Utgått",
};

export const phaseColors: Record<string, string> = {
  draft:
    "bg-slate-100 border-slate-300 text-slate-700 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-300",
  in_progress:
    "bg-blue-100 border-blue-300 text-blue-700 dark:bg-blue-900 dark:border-blue-600 dark:text-blue-300",
  sent: "bg-purple-100 border-purple-300 text-purple-700 dark:bg-purple-900 dark:border-purple-600 dark:text-purple-300",
  won: "bg-green-100 border-green-300 text-green-700 dark:bg-green-900 dark:border-green-600 dark:text-green-300",
  lost: "bg-red-100 border-red-300 text-red-700 dark:bg-red-900 dark:border-red-600 dark:text-red-300",
  expired:
    "bg-orange-100 border-orange-300 text-orange-700 dark:bg-orange-900 dark:border-orange-600 dark:text-orange-300",
};

const phaseOrder: string[] = ["draft", "in_progress", "sent", "won", "lost"];

export function PipelineOverview({
  pipeline,
  onPhaseClick,
}: PipelineOverviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tilbudspipeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4">
          {phaseOrder.map((phaseName, index) => {
            const phaseData = pipeline.find((p) => p.phase === phaseName) || {
              phase: phaseName,
              count: 0,
              totalValue: 0,
              weightedValue: 0,
            };

            const isDraft = phaseName === "draft";
            const isLost = phaseName === "lost";
            const isWon = phaseName === "won";
            const probability =
              phaseData.totalValue > 0
                ? Math.round(
                    (phaseData.weightedValue / phaseData.totalValue) * 100
                  )
                : 0;

            const isWonOrLost = isWon || isLost;

            return (
              <motion.div
                key={phaseName}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onPhaseClick?.(phaseName)}
                className={`${phaseColors[phaseName] || "bg-gray-100"} relative min-w-[180px] flex-1 cursor-pointer rounded-lg border-2 p-4 transition-all hover:shadow-md`}
              >
                <div className="space-y-2 pb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wide">
                      {phaseLabels[phaseName] || phaseName}
                    </span>
                    {!isDraft && (
                      <Badge variant="secondary" className="text-xs">
                        {phaseData.count}
                      </Badge>
                    )}
                  </div>

                  {isDraft ? (
                    <div className="flex h-16 items-center justify-center">
                      <span className="text-4xl font-bold">
                        {phaseData.count}
                      </span>
                    </div>
                  ) : isWonOrLost ? (
                    <div className="flex h-16 flex-col items-center justify-center">
                      <div className="text-xl font-bold">
                        {formatCurrency(phaseData.totalValue)}
                      </div>
                      <div className="invisible text-xs">Placeholder</div>
                    </div>
                  ) : (
                    <div className="flex h-16 flex-col items-center justify-center">
                      <div className="text-xl font-bold">
                        {formatCurrency(phaseData.totalValue)}
                      </div>
                      <div className="text-xs opacity-75">
                        Vektet: {formatCurrency(phaseData.weightedValue)}
                      </div>
                    </div>
                  )}
                </div>
                {!isDraft && !isWonOrLost && (
                  <div className="absolute bottom-2 right-3 text-[10px] font-medium opacity-60">
                    {probability}% sannsynlighet
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        <div className="mt-6 border-t pt-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Antall tilbud</p>
              <p className="text-2xl font-bold">
                {pipeline
                  .filter((p) => p.phase !== "draft")
                  .reduce((sum, p) => sum + p.count, 0)}
              </p>
            </div>
            <p className="text-xs text-muted-foreground">Siste 12 mnd</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
