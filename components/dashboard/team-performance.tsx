"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { TeamMemberStats } from "@/types";
import { Trophy, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

interface TeamPerformanceProps {
  teamStats: TeamMemberStats[];
}

export function TeamPerformance({ teamStats }: TeamPerformanceProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("nb-NO", {
      style: "currency",
      currency: "NOK",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Team Ytelse</CardTitle>
        <Trophy className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {teamStats.map((member, index) => (
            <motion.div
              key={member.userId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-muted/50"
            >
              <div className="flex items-center gap-3">
                {index < 3 && (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 text-xs font-bold text-white">
                    {index + 1}
                  </div>
                )}
                {index >= 3 && (
                  <Badge variant="outline" className="text-xs">
                    {index + 1}
                  </Badge>
                )}
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/10 font-semibold text-primary">
                    {getInitials(member.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{member.name}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{member.offerCount} tilbud</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      {member.wonCount} vunnet
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold">
                  {formatCurrency(member.totalValue)}
                </p>
                <div className="flex items-center justify-end gap-1">
                  <span className="text-xs text-muted-foreground">
                    Vinnrate:
                  </span>
                  <Badge
                    variant={member.winRate >= 50 ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {member.winRate.toFixed(0)}%
                  </Badge>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
