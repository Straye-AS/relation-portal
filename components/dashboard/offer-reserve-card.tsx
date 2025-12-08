"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { motion } from "framer-motion";

interface OfferReserveCardProps {
  offerReserve: number;
  winRate: number;
  totalValue: number;
  weightedValue: number;
  averageProbability: number;
}

export function OfferReserveCard({
  offerReserve,
  winRate,
  totalValue,
  weightedValue,
  averageProbability,
}: OfferReserveCardProps) {
  const reservePercentage =
    totalValue > 0 ? (offerReserve / totalValue) * 100 : 0;
  const isGoodWinRate = winRate >= 50;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Tilbudsreserve & Vinnrate
        </CardTitle>
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
            <p className="text-xs text-muted-foreground">
              {reservePercentage.toFixed(1)}% av total verdi
            </p>
          </motion.div>

          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(reservePercentage, 100)}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 border-t pt-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Vektet verdi
              </p>
              <div className="text-lg font-bold">
                {formatCurrency(weightedValue)}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Sannsynlighet
              </p>
              <div className="text-lg font-bold">
                {averageProbability.toFixed(1)}%
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between border-t pt-2">
            <div>
              <p className="flex items-center gap-1 text-sm font-medium">
                Vinnrate
                {isGoodWinRate ? (
                  <TrendingUp className="h-3 w-3 text-green-600" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-600" />
                )}
              </p>
              <p className="text-xs text-muted-foreground">
                Siste avgjorte tilbud
              </p>
            </div>
            <div
              className={`text-2xl font-bold ${isGoodWinRate ? "text-green-600" : "text-orange-600"}`}
            >
              {winRate.toFixed(1)}%
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
