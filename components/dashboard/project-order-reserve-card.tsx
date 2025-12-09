"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { motion } from "framer-motion";
import { Briefcase } from "lucide-react";

export interface ProjectOrderReserveCardProps {
  amount: number;
  totalValue: number;
  invoicedAmount: number;
}

export function ProjectOrderReserveCard({
  amount,
  totalValue,
  invoicedAmount,
}: ProjectOrderReserveCardProps) {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Ordrereserve</CardTitle>
        <Briefcase className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-between">
        <div className="space-y-4">
          <div>
            <div className="text-2xl font-bold">{formatCurrency(amount)}</div>
            <p className="min-h-[2.5em] text-xs text-muted-foreground">
              Gjenstående verdi på vunnede prosjekter
            </p>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${totalValue > 0 ? (invoicedAmount / totalValue) * 100 : 0}%`,
              }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
            />
          </div>

          <div className="space-y-1 border-t pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                Totalt fakturert:
              </span>
              <span className="text-sm font-medium">
                {formatCurrency(invoicedAmount)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                Total verdi:
              </span>
              <span className="text-sm font-medium">
                {formatCurrency(totalValue)}
              </span>
            </div>
          </div>
        </div>
        <div className="mt-4 border-t border-dashed pt-1 text-right">
          <p className="text-xs text-muted-foreground">Siste 12 mnd</p>
        </div>
      </CardContent>
    </Card>
  );
}
