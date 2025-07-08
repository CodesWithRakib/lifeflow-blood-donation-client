import { useState, useEffect } from "react";
import { Users, Droplet, Activity, AlertCircle } from "lucide-react";
import useAxios from "../../../hooks/useAxios";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxios();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axiosSecure.get("/api/admin/stats");
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [axiosSecure]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white">
        Admin Dashboard
      </h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              {
                icon: <Users className="h-8 w-8 text-white" />,
                title: "Total Users",
                value: stats?.totalUsers || 0,
                bg: "bg-blue-600",
              },
              {
                icon: <Droplet className="h-8 w-8 text-white" />,
                title: "Active Donors",
                value: stats?.activeDonors || 0,
                bg: "bg-green-600",
              },
              {
                icon: <Activity className="h-8 w-8 text-white" />,
                title: "Donations This Month",
                value: stats?.monthlyDonations || 0,
                bg: "bg-purple-600",
              },
              {
                icon: <AlertCircle className="h-8 w-8 text-white" />,
                title: "Pending Requests",
                value: stats?.pendingRequests || 0,
                bg: "bg-amber-600",
              },
            ].map((stat, index) => (
              <div
                key={index}
                className={`${stat.bg} rounded-lg shadow-md p-6 text-white`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <div className="p-2 rounded-full bg-white bg-opacity-20">
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Recent Activity
            </h2>
            <div className="space-y-4">
              {stats?.recentActivity?.length > 0 ? (
                stats.recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0"
                  >
                    <p className="text-gray-600 dark:text-gray-300">
                      {activity.description}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-600 dark:text-gray-300">
                  No recent activity
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
