"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Upload, FolderOpen, Bell } from "lucide-react";
import Link from "next/link";

export function QuickActions() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-sm font-medium">Hurtighandlinger</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-3">
                    <Link href="/offers/new">
                        <Button className="w-full" variant="default">
                            <Plus className="h-4 w-4 mr-2" />
                            Nytt tilbud
                        </Button>
                    </Link>
                    <Button className="w-full" variant="outline">
                        <Upload className="h-4 w-4 mr-2" />
                        Importer kalkyle
                    </Button>
                    <Link href="/projects">
                        <Button className="w-full" variant="outline">
                            <FolderOpen className="h-4 w-4 mr-2" />
                            Se prosjekter
                        </Button>
                    </Link>
                    <Link href="/notifications">
                        <Button className="w-full" variant="outline">
                            <Bell className="h-4 w-4 mr-2" />
                            Varsler
                        </Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}

