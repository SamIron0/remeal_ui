'use client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardMetrics({ data }: { data: any }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Recipes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.total_recipes}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.total_users}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Recipes This Month</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.recipes_this_month}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.active_users}</div>
        </CardContent>
      </Card>
    </div>
  );
}
