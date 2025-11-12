"use client";

import { AppLayout } from "@/components/layout/app-layout";
import {
  useNotifications,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
  useDeleteNotification,
} from "@/hooks/useNotifications";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CardSkeleton } from "@/components/ui/card-skeleton";
import { Badge } from "@/components/ui/badge";
import { CheckCheck, Trash2, FileText, FolderKanban, Users, Info } from "lucide-react";
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
  const { data: notifications, isLoading } = useNotifications();
  const markAsReadMutation = useMarkNotificationAsRead();
  const markAllAsReadMutation = useMarkAllNotificationsAsRead();
  const deleteMutation = useDeleteNotification();

  const handleMarkAsRead = (id: string) => {
    markAsReadMutation.mutate(id);
  };

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const unreadNotifications = notifications?.filter((n) => !n.read) || [];

  return (
    <AppLayout>
      <div className="space-y-6">
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
              const Icon = notificationIcons[notification.type];
              const isUnread = !notification.read;

              const content = (
                <Card
                  className={`p-4 transition-all ${
                    isUnread
                      ? "bg-primary/5 border-primary/50"
                      : "hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-2 rounded-full ${
                        isUnread ? "bg-primary/20" : "bg-muted"
                      }`}
                    >
                      <Icon
                        className={`h-5 w-5 ${
                          isUnread ? "text-primary" : "text-muted-foreground"
                        }`}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
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
                          <p className="text-xs text-muted-foreground mt-2">
                            {formatDistanceToNow(
                              new Date(notification.createdAt),
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
                                handleMarkAsRead(notification.id);
                              }}
                              disabled={markAsReadMutation.isPending}
                            >
                              <CheckCheck className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.preventDefault();
                              handleDelete(notification.id);
                            }}
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
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
                      if (isUnread) {
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
    </AppLayout>
  );
}
