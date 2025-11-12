"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Notification } from "@/types";
import { Bell, FileText, Briefcase, Building2, AlertCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { nb } from "date-fns/locale";
import Link from "next/link";

interface ActivityFeedProps {
    activities: Notification[];
}

const typeIcons: Record<string, React.ReactNode> = {
    offer: <FileText className="h-4 w-4" />,
    project: <Briefcase className="h-4 w-4" />,
    customer: <Building2 className="h-4 w-4" />,
    system: <AlertCircle className="h-4 w-4" />,
};

const typeColors: Record<string, string> = {
    offer: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    project: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    customer: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
    system: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
};

export function ActivityFeed({ activities }: ActivityFeedProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Siste aktivitet</CardTitle>
                <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                    {activities.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-4">
                            Ingen aktivitet
                        </p>
                    )}
                    {activities.map((activity) => (
                        <div
                            key={activity.id}
                            className={`flex items-start gap-3 p-3 rounded-lg border ${activity.read ? "opacity-60" : ""
                                } hover:bg-muted/50 transition-colors`}
                        >
                            <div className={`p-2 rounded-full ${typeColors[activity.type]}`}>
                                {typeIcons[activity.type]}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-semibold text-sm truncate">{activity.title}</h3>
                                    {!activity.read && (
                                        <Badge variant="default" className="text-xs">
                                            Ny
                                        </Badge>
                                    )}
                                </div>
                                <p className="text-xs text-muted-foreground line-clamp-2">
                                    {activity.message}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {formatDistanceToNow(new Date(activity.createdAt), {
                                        addSuffix: true,
                                        locale: nb,
                                    })}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-4 pt-3 border-t">
                    <Link
                        href="/notifications"
                        className="text-sm text-primary hover:underline font-medium"
                    >
                        Se alle varsler →
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}

