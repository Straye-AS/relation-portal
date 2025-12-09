"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DisciplineStats } from "@/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Wrench } from "lucide-react";

interface TopDisciplinesProps {
  disciplines: DisciplineStats[];
}

export function TopDisciplines({ disciplines }: TopDisciplinesProps) {
  const chartData = disciplines.map((d) => ({
    name: d.name.length > 15 ? d.name.substring(0, 12) + "..." : d.name,
    fullName: d.name,
    value: d.totalValue,
    margin: d.avgMargin,
  }));

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("nb-NO", {
      style: "currency",
      currency: "NOK",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Topp Fagområder</CardTitle>
        <Wrench className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
              />
              <XAxis
                dataKey="name"
                fontSize={10}
                stroke="hsl(var(--muted-foreground))"
              />
              <YAxis
                fontSize={10}
                stroke="hsl(var(--muted-foreground))"
                tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
              />
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.5rem",
                }}
              />
              <Bar dataKey="value" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>

          <div className="space-y-2">
            {disciplines.map((discipline, index) => (
              <div
                key={discipline.name}
                className="flex items-center justify-between rounded-lg p-2 transition-colors hover:bg-muted/50"
              >
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {index + 1}
                  </Badge>
                  <div>
                    <p className="text-sm font-medium">{discipline.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {discipline.offerCount} tilbud
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">
                    {formatCurrency(discipline.totalValue)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {discipline.avgMargin.toFixed(1)}% margin
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
