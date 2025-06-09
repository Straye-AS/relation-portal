import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function SuccessPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="rounded-xl border bg-card p-8 shadow-lg text-center">
        <CheckCircle className="h-12 w-12 text-primary mx-auto mb-4" />
        <h2 className="text-2xl   mb-2">Payment Successful!</h2>
        <p className="text-muted-foreground mb-6">
          Thank you for your subscription. Your payment has been processed successfully.
        </p>
        <div className="space-y-4">
          <Button asChild className="w-full">
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/support">Need Help?</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}