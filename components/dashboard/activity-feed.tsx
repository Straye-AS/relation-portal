"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "@/lib/api/types";
import {
  Bell,
  Phone,
  Mail,
  CheckSquare,
  FileText,
  AlertCircle,
  Calendar,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { nb } from "date-fns/locale";
import Link from "next/link";

interface ActivityFeedProps {
  activities: Activity[];
}

const typeIcons: Record<string, React.ReactNode> = {
  meeting: <Calendar className="h-4 w-4" />,
  call: <Phone className="h-4 w-4" />,
  email: <Mail className="h-4 w-4" />,
  task: <CheckSquare className="h-4 w-4" />,
  note: <FileText className="h-4 w-4" />,
  system: <AlertCircle className="h-4 w-4" />,
};

const typeColors: Record<string, string> = {
  meeting:
    "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
  call: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  email: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  task: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
  note: "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300",
  system: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
};

export function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Siste aktivitet</CardTitle>
        <Bell className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="flex min-h-0 flex-1 flex-col">
        <div className="flex-1 space-y-3 overflow-y-auto pr-2">
          {activities.length === 0 && (
            <p className="py-4 text-center text-sm text-muted-foreground">
              Ingen aktivitet
            </p>
          )}
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex h-[88px] items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
            >
              <div
                className={`rounded-full p-2 ${typeColors[activity.activityType || "system"] || typeColors.system}`}
              >
                {typeIcons[activity.activityType || "system"] ||
                  typeIcons.system}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="truncate text-sm font-semibold">
                    {activity.title}
                  </h3>
                </div>
                <p className="line-clamp-2 text-xs text-muted-foreground">
                  {activity.body || "Ingen beskrivelse"}
                </p>
                <div className="mt-1 flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    {activity.creatorName && `${activity.creatorName} • `}
                    {formatDistanceToNow(
                      new Date(
                        activity.createdAt || activity.occurredAt || new Date()
                      ),
                      {
                        addSuffix: true,
                        locale: nb,
                      }
                    )}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 shrink-0 border-t pt-3">
          <Link
            href="/activities"
            className="text-sm font-medium text-primary hover:underline"
          >
            Se aktivitetslogg →
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
