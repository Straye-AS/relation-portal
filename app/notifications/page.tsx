"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { useNotifications } from "@/hooks/useNotifications";
import {
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
} from "@/hooks/useNotificationMutations";
import type { DomainNotificationDTO } from "@/lib/.generated/data-contracts";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CardSkeleton } from "@/components/ui/card-skeleton";
import { Badge } from "@/components/ui/badge";
import { CheckCheck, FileText, FolderKanban, Users, Info } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { nb } from "date-fns/locale";
import Link from "next/link";

const notificationIcons = {
  offer: FileText,
  project: FolderKanban,
  customer: Users,
  system: Info,
};

export default function NotificationsPage() {
  const { data: rawNotifications, isLoading } = useNotifications();
  const notifications = rawNotifications as DomainNotificationDTO[] | undefined;
  const markAsReadMutation = useMarkNotificationAsRead();
  const markAllAsReadMutation = useMarkAllNotificationsAsRead();

  const handleMarkAsRead = (id: string) => {
    markAsReadMutation.mutate(id);
  };

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  const unreadNotifications = notifications?.filter((n) => !n.read) || [];

  return (
    <AppLayout disableScroll>
      <div className="flex h-full flex-col">
        <div className="flex-none border-b bg-background px-4 py-4 md:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Varsler</h1>
              <p className="text-muted-foreground">
                {unreadNotifications.length > 0
                  ? `${unreadNotifications.length} uleste varsler`
                  : "Ingen uleste varsler"}
              </p>
            </div>
            {unreadNotifications.length > 0 && (
              <Button
                variant="outline"
                onClick={handleMarkAllAsRead}
                disabled={markAllAsReadMutation.isPending}
              >
                <CheckCheck className="mr-2 h-4 w-4" />
                Merk alle som lest
              </Button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8">
          <div className="space-y-6">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <CardSkeleton key={i} />
                ))}
              </div>
            ) : !notifications || notifications.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground">Ingen varsler ennå</p>
              </Card>
            ) : (
              <div className="space-y-3">
                {notifications.map((notification) => {
                  const Icon =
                    notificationIcons[
                      (notification.type as keyof typeof notificationIcons) ??
                        "system"
                    ];
                  const isUnread = !notification.read;

                  const content = (
                    <Card
                      className={`p-4 transition-all ${
                        isUnread
                          ? "border-primary/50 bg-primary/5"
                          : "hover:bg-muted/50"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`rounded-full p-2 ${
                            isUnread ? "bg-primary/20" : "bg-muted"
                          }`}
                        >
                          <Icon
                            className={`h-5 w-5 ${
                              isUnread
                                ? "text-primary"
                                : "text-muted-foreground"
                            }`}
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <div className="mb-1 flex items-center gap-2">
                                <h3
                                  className={`font-semibold ${
                                    isUnread ? "text-primary" : ""
                                  }`}
                                >
                                  {notification.title}
                                </h3>
                                {isUnread && (
                                  <Badge variant="default" className="h-5 px-2">
                                    Ny
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {notification.message}
                              </p>
                              <p className="mt-2 text-xs text-muted-foreground">
                                {formatDistanceToNow(
                                  new Date(
                                    notification.createdAt ??
                                      new Date().toISOString()
                                  ),
                                  {
                                    addSuffix: true,
                                    locale: nb,
                                  }
                                )}
                              </p>
                            </div>

                            <div className="flex gap-1">
                              {isUnread && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    if (notification.id) {
                                      handleMarkAsRead(notification.id);
                                    }
                                  }}
                                  disabled={markAsReadMutation.isPending}
                                >
                                  <CheckCheck className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );

                  if (notification.entityType && notification.entityId) {
                    const href =
                      notification.entityType === "offer"
                        ? `/offers/${notification.entityId}`
                        : notification.entityType === "project"
                          ? `/projects/${notification.entityId}`
                          : `/customers/${notification.entityId}`;

                    return (
                      <Link
                        key={notification.id}
                        href={href}
                        onClick={() => {
                          if (isUnread && notification.id) {
                            handleMarkAsRead(notification.id);
                          }
                        }}
                      >
                        {content}
                      </Link>
                    );
                  }

                  return <div key={notification.id}>{content}</div>;
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
