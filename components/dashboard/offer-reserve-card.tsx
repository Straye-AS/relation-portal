"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export interface OfferReserveCardProps {
  offerReserve: number;
  winRate: number;
  totalValue: number;
  weightedValue: number;
  averageProbability: number;
  economicWinRate: number;
  wonCount?: number;
  lostCount?: number;
}

export function OfferReserveCard({
  offerReserve,
  winRate,
  economicWinRate,
  totalValue,
  weightedValue,
  averageProbability,
  wonCount = 0,
  lostCount = 0,
}: OfferReserveCardProps) {
  const isGoodWinRate = winRate >= 50;
  const isGoodEconomicWinRate = economicWinRate >= 50;
  const totalDecided = wonCount + lostCount;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Tilbudsreserve</CardTitle>
        <DollarSign className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-2xl font-bold">
              {formatCurrency(offerReserve)}
            </div>
            <p className="min-h-[2.5em] text-xs text-muted-foreground">
              Utestående tilbudsverdi dersom vinnrate var 100%
            </p>
          </motion.div>

          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(weightedValue / totalValue) * 100}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
            />
          </div>

          <div className="space-y-1 border-t pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                Vektet verdi:
              </span>
              <span className="text-sm font-medium">
                {formatCurrency(weightedValue)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                Sannsynlighet:
              </span>
              <span className="text-sm font-medium">
                {averageProbability.toFixed(1)}%
              </span>
            </div>
          </div>

          <div className="space-y-1 border-t pt-2">
            <HoverCard>
              <HoverCardTrigger asChild>
                <div className="flex w-full cursor-help items-center justify-between">
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    Vinnrate (antall):
                    {isGoodWinRate ? (
                      <TrendingUp className="h-3 w-3 text-green-600" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-600" />
                    )}
                  </span>
                  <span
                    className={`text-sm font-medium ${isGoodWinRate ? "text-green-600" : "text-orange-600"}`}
                  >
                    {winRate.toFixed(1)}%
                  </span>
                </div>
              </HoverCardTrigger>
              <HoverCardContent side="top" className="w-64">
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">Vinnrate (antall)</h4>
                  <p className="text-xs text-muted-foreground">
                    Basert på {totalDecided} avgjorte tilbud siste 12 mnd (
                    {wonCount} vunnet, {lostCount} tapt).
                  </p>
                </div>
              </HoverCardContent>
            </HoverCard>

            <HoverCard>
              <HoverCardTrigger asChild>
                <div className="flex w-full cursor-help items-center justify-between">
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    Vinnrate (verdi):
                    {isGoodEconomicWinRate ? (
                      <TrendingUp className="h-3 w-3 text-green-600" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-600" />
                    )}
                  </span>
                  <span
                    className={`text-sm font-medium ${isGoodEconomicWinRate ? "text-green-600" : "text-orange-600"}`}
                  >
                    {economicWinRate.toFixed(1)}%
                  </span>
                </div>
              </HoverCardTrigger>
              <HoverCardContent side="top" className="w-64">
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">Vinnrate (verdi)</h4>
                  <p className="text-xs text-muted-foreground">
                    Andel av total tilbudsverdi som er vunnet siste 12 mnd.
                  </p>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
