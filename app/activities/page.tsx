"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { useActivities } from "@/hooks/useActivities";
import { Card } from "@/components/ui/card";
import { CardSkeleton } from "@/components/ui/card-skeleton";
import { PaginationControls } from "@/components/pagination-controls";
import { useState } from "react";
import {
  Calendar,
  Phone,
  Mail,
  CheckSquare,
  FileText,
  AlertCircle,
  X,
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { nb } from "date-fns/locale";
import type { Activity, PaginatedResponse } from "@/lib/api/types";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { ActivityBody } from "@/components/activities/activity-body";

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

export default function ActivitiesPage() {
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const { data: rawData, isLoading } = useActivities({
    page,
    pageSize,
    from: dateRange?.from ? format(dateRange.from, "yyyy-MM-dd") : undefined,
    to: dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : undefined,
  });

  const paginatedData = rawData as PaginatedResponse<Activity> | undefined;
  const activities = paginatedData?.data;
  const totalCount = paginatedData?.total ?? 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
    setPage(1);
  };

  return (
    <AppLayout disableScroll>
      <div className="flex h-full flex-col">
        <div className="flex-none border-b bg-background px-4 py-4 md:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Aktivitetslogg
              </h1>
              <p className="text-muted-foreground">
                En logg over endringer og interaksjoner
              </p>
            </div>
            <div className="flex items-center gap-2">
              <DatePickerWithRange
                date={dateRange}
                setDate={handleDateRangeChange}
              />
              {dateRange && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDateRangeChange(undefined)}
                  title="Fjern filter"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8">
          <div className="space-y-4">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <CardSkeleton key={i} />
                ))}
              </div>
            ) : !activities || activities.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground">Ingen aktivitet funnet</p>
              </Card>
            ) : (
              <>
                <div className="space-y-4">
                  {activities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center gap-4 rounded-lg border bg-card p-4 transition-colors hover:bg-muted/50"
                    >
                      <div
                        className={`rounded-full p-2 ${
                          typeColors[activity.activityType || "system"] ||
                          typeColors.system
                        }`}
                      >
                        {typeIcons[activity.activityType || "system"] ||
                          typeIcons.system}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="truncate text-base font-semibold">
                            {activity.title}
                          </h3>
                        </div>
                        <div className="line-clamp-2 text-sm text-muted-foreground">
                          <ActivityBody
                            title={activity.title || ""}
                            body={activity.body || ""}
                          />
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                          {activity.creatorName && (
                            <span>{activity.creatorName}</span>
                          )}
                          <span>•</span>
                          <span>
                            {formatDistanceToNow(
                              new Date(
                                activity.createdAt ||
                                  activity.occurredAt ||
                                  new Date()
                              ),
                              {
                                addSuffix: true,
                                locale: nb,
                              }
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {totalCount > pageSize && (
                  <div className="mt-6 flex justify-center">
                    <PaginationControls
                      currentPage={page}
                      totalPages={totalPages}
                      onPageChange={setPage}
                      pageSize={pageSize}
                      totalCount={totalCount}
                      entityName="aktiviteter"
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
