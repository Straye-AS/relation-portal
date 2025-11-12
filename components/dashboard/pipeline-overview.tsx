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

const phaseColors: Record<string, string> = {
    Kladd: "bg-slate-100 border-slate-300 text-slate-700 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-300",
    "I gang": "bg-blue-100 border-blue-300 text-blue-700 dark:bg-blue-900 dark:border-blue-600 dark:text-blue-300",
    Sendt: "bg-purple-100 border-purple-300 text-purple-700 dark:bg-purple-900 dark:border-purple-600 dark:text-purple-300",
    Vunnet: "bg-green-100 border-green-300 text-green-700 dark:bg-green-900 dark:border-green-600 dark:text-green-300",
    Tapt: "bg-red-100 border-red-300 text-red-700 dark:bg-red-900 dark:border-red-600 dark:text-red-300",
    Utløpt: "bg-orange-100 border-orange-300 text-orange-700 dark:bg-orange-900 dark:border-orange-600 dark:text-orange-300",
};

export function PipelineOverview({ pipeline, onPhaseClick }: PipelineOverviewProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Pipeline Oversikt</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    {pipeline.map((phase, index) => (
                        <motion.div
                            key={phase.phase}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => onPhaseClick?.(phase.phase)}
                            className={`${phaseColors[phase.phase]} border-2 rounded-lg p-4 cursor-pointer hover:shadow-md transition-all`}
                        >
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold uppercase tracking-wide">
                                        {phase.phase}
                                    </span>
                                    <Badge variant="secondary" className="text-xs">
                                        {phase.count}
                                    </Badge>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-sm font-bold">
                                        {formatCurrency(phase.totalValue)}
                                    </div>
                                    <div className="text-xs opacity-75">
                                        Vektet: {formatCurrency(phase.weightedValue)}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-6 pt-4 border-t">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Totalt antall</p>
                            <p className="text-2xl font-bold">
                                {pipeline.reduce((sum, p) => sum + p.count, 0)}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Total verdi</p>
                            <p className="text-2xl font-bold">
                                {formatCurrency(pipeline.reduce((sum, p) => sum + p.totalValue, 0))}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Vektet verdi</p>
                            <p className="text-2xl font-bold">
                                {formatCurrency(pipeline.reduce((sum, p) => sum + p.weightedValue, 0))}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Aktive faser</p>
                            <p className="text-2xl font-bold">
                                {pipeline.filter(p => p.count > 0 && !["Vunnet", "Tapt", "Utløpt"].includes(p.phase)).length}
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

