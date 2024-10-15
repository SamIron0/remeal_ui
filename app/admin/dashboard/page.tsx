import DashboardMetrics from "@/components/admin/DashBoardMetrics";
import { getDashboardData } from "./actions";
import ResetMetadataButton from "@/components/admin/ResetMetadataButton";
import ResetRedisButton from "@/components/admin/ResetRedisButton";

export default async function AdminDashboard() {
  const { metricsData, userActivity } = await getDashboardData();

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <DashboardMetrics data={metricsData} />
      <ResetRedisButton />
      <ResetMetadataButton />
    </div>
  );
}
