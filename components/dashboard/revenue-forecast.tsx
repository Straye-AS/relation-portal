"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatCurrency } from "@/lib/utils";
import { Calendar } from "lucide-react";

interface RevenueForecastProps {
  forecast30Days: number;
  forecast90Days: number;
}

export function RevenueForecast({
  forecast30Days,
  forecast90Days,
}: RevenueForecastProps) {
  const chartData = [
    { name: "Nå", value: 0 },
    { name: "30 dager", value: forecast30Days },
    { name: "90 dager", value: forecast90Days },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Inntektsprognose</CardTitle>
        <Calendar className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">30 dager</p>
              <p className="text-xl font-bold text-blue-600">
                {formatCurrency(forecast30Days)}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">90 dager</p>
              <p className="text-xl font-bold text-purple-600">
                {formatCurrency(forecast90Days)}
              </p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={120}>
            <LineChart data={chartData}>
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
              <Line
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--primary))", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>

          <p className="text-xs text-muted-foreground">
            Basert på vektet verdi av aktive tilbud
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
