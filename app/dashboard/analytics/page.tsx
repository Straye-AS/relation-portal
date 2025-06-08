import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl mb-2">Analytics</h1>
        <p className="text-muted-foreground">
          Track your usage and performance metrics.
        </p>
      </div>

      {/* Analytics Content */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Visits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,345</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Page Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45,678</div>
            <p className="text-xs text-muted-foreground">+15.3% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.2%</div>
            <p className="text-xs text-muted-foreground">+0.5% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Usage Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
              <p className="text-muted-foreground">Chart placeholder</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Pages</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">/dashboard</span>
              <span className="text-sm font-medium">45%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">/pricing</span>
              <span className="text-sm font-medium">23%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">/docs</span>
              <span className="text-sm font-medium">18%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">/settings</span>
              <span className="text-sm font-medium">14%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Export Section */}
      <Card>
        <CardHeader>
          <CardTitle>Export Data</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Export your analytics data for further analysis.
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Export CSV
            </Button>
            <Button variant="outline" size="sm">
              Export PDF
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 