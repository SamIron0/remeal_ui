import DashboardMetrics from "@/components/admin/DashBoardMetrics";
import UserActivity from "@/components/admin/UserActivity";
import RecipeManagement from "@/components/admin/RecipeManagement";
import { getDashboardData } from "./actions";

export default async function AdminDashboard() {
  const { metricsData, recentRecipes, popularIngredients, userActivity } =
    await getDashboardData();

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <DashboardMetrics data={metricsData} />
      <UserActivity data={userActivity} />
      <RecipeManagement />
    </div>
  );
}
