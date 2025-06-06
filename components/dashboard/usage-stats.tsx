"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from "@/lib/utils";

const data = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 500 },
  { name: 'Jun', value: 900 },
  { name: 'Jul', value: 1100 },
];

interface UsageItem {
  name: string;
  value: number;
  max: number;
  color: string;
}

interface UsageStatsProps {
  plan: string;
}

export function UsageStats({ plan }: UsageStatsProps) {
  // Determine limits based on plan
  const storageLimit = plan === 'free' ? 1 : plan === 'basic' ? 10 : 50;
  const projectsLimit = plan === 'free' ? 2 : plan === 'basic' ? 10 : 100;
  const apiLimit = plan === 'free' ? 10000 : plan === 'basic' ? 50000 : 500000;
  
  const usageItems: UsageItem[] = [
    { name: 'Storage', value: 0.75, max: storageLimit, color: 'bg-chart-1' },
    { name: 'Projects', value: plan === 'free' ? 1 : 4, max: projectsLimit, color: 'bg-chart-2' },
    { name: 'API Calls', value: 7500, max: apiLimit, color: 'bg-chart-3' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Usage Overview</CardTitle>
          <CardDescription>Monitor your resource usage</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {usageItems.map((item) => (
            <div key={item.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="font-medium">{item.name}</div>
                <div className="text-sm text-muted-foreground">
                  {item.name === 'Storage' 
                    ? `${(item.value * item.max).toFixed(1)} / ${item.max} GB`
                    : item.name === 'Projects'
                    ? `${item.value} / ${item.max === 100 ? 'Unlimited' : item.max}`
                    : `${item.value.toLocaleString()} / ${item.max.toLocaleString()}`}
                </div>
              </div>
              <Progress 
                value={(item.value / item.max) * 100} 
                className={cn("h-2", item.color)} 
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Activity</CardTitle>
          <CardDescription>Your activity over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--muted)" opacity={0.3} />
                <XAxis 
                  dataKey="name" 
                  stroke="var(--muted-foreground)" 
                  fontSize={12} 
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="var(--muted-foreground)" 
                  fontSize={12} 
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    borderColor: 'var(--border)',
                    borderRadius: '0.5rem',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}