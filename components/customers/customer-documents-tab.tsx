"use client";

import { CustomerFileManager } from "@/components/files/entity-file-manager";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface CustomerDocumentsTabProps {
  customerId: string;
}

export function CustomerDocumentsTab({
  customerId,
}: CustomerDocumentsTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Dokumenter</CardTitle>
        <CardDescription>Dokumenter knyttet til denne kunden</CardDescription>
      </CardHeader>
      <CardContent>
        <CustomerFileManager customerId={customerId} />
      </CardContent>
    </Card>
  );
}
