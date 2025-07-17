import { useQuery } from "@tanstack/react-query";
import {
  Users,
  DollarSign,
  Activity,
  TrendingUp,
  Clock,
  HeartPulse,
  UserCheck,
} from "lucide-react";
import useAxios from "../../../hooks/useAxios";
import useAuth from "../../../hooks/useAuth";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import ErrorMessage from "../../../components/common/ErrorMessage";
import { format, parseISO } from "date-fns";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import useTitle from "../../../hooks/useTitle";

const AdminHome = () => {
  const axiosSecure = useAxios();
  const { user, loading: authLoading, userRole, roleLoading } = useAuth();

  useTitle("Admin Dashboard | LifeFlow - Blood Donation");

  // ✅ Fetch stats
  const {
    data: stats,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["funding-stats"],
    queryFn: async () => {
      const { data } = await axiosSecure.get("/funds/stats");
      return data;
    },
    enabled: !!user && !!userRole,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  // ✅ Fetch recent donations
  const { data: recentDonations } = useQuery({
    queryKey: ["recent-funds"],
    queryFn: async () => {
      const { data } = await axiosSecure.get("/funds?limit=5");
      return data;
    },
    enabled: !!user && !!userRole,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  // Combined loading check
  if (authLoading || roleLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorMessage
        title="Failed to load dashboard data"
        description={error.message}
        actionText="Try Again"
        onAction={() => refetch()}
      />
    );
  }

  const weeklyData =
    stats?.data?.weeklyTrends?.map((item) => ({
      name: format(parseISO(item.date), "EEE"),
      amount: item.total,
    })) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard Overview
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">
          {format(new Date(), "MMMM d, yyyy")}
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Funds Raised"
          value={`$${stats?.data?.totalFunds?.toLocaleString() || 0}`}
          subtitle="+12% from last month"
          icon={
            <DollarSign className="w-6 h-6 text-amber-600 dark:text-amber-400" />
          }
          iconBg="bg-amber-50 dark:bg-amber-900/30"
          subtitleColor="text-green-600 dark:text-green-400"
          subtitleIcon={<TrendingUp className="inline w-4 h-4 mr-1" />}
        />
        <StatCard
          title="Total Donors"
          value={stats?.data?.totalDonors?.toLocaleString() || 0}
          subtitle="+5 new this week"
          icon={<Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />}
          iconBg="bg-blue-50 dark:bg-blue-900/30"
          subtitleColor="text-blue-600 dark:text-blue-400"
          subtitleIcon={<UserCheck className="inline w-4 h-4 mr-1" />}
        />
        <StatCard
          title="Weekly Donations"
          value={`$${stats?.data?.weeklyTotal?.toLocaleString() || 0}`}
          subtitle={`${stats?.data?.weeklyDonations || 0} donations`}
          icon={
            <Activity className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          }
          iconBg="bg-purple-50 dark:bg-purple-900/30"
          subtitleColor="text-purple-600 dark:text-purple-400"
          subtitleIcon={<Clock className="inline w-4 h-4 mr-1" />}
        />
        <StatCard
          title="Recent Donation"
          value={`$${
            stats?.data?.recentDonation?.amount?.toLocaleString() || 0
          }`}
          subtitle={`by ${
            stats?.data?.recentDonation?.donorName || "Anonymous"
          }`}
          icon={
            <HeartPulse className="w-6 h-6 text-green-600 dark:text-green-400" />
          }
          iconBg="bg-green-50 dark:bg-green-900/30"
        />
      </div>

      {/* Chart + Recent Donations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Weekly Donations Trend
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={weeklyData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#E5E7EB"
                  strokeOpacity={0.2}
                />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#6B7280" }}
                  axisLine={{ stroke: "#E5E7EB", strokeOpacity: 0.2 }}
                />
                <YAxis
                  tick={{ fill: "#6B7280" }}
                  axisLine={{ stroke: "#E5E7EB", strokeOpacity: 0.2 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    borderColor: "rgba(0, 0, 0, 0.1)",
                    borderRadius: "0.5rem",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Bar
                  dataKey="amount"
                  fill="#F59E0B"
                  radius={[4, 4, 0, 0]}
                  animationDuration={1500}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Donations
          </h2>
          <div className="space-y-4">
            {recentDonations?.data?.length > 0 ? (
              recentDonations.data.map((donation) => (
                <div
                  key={donation._id}
                  className="pb-4 border-b border-gray-100 dark:border-gray-700 last:border-0"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        ${donation.amount?.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        by {donation.userName || "Anonymous"}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {format(new Date(donation.createdAt), "MMM d")}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                No recent donations
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({
  title,
  value,
  subtitle,
  icon,
  iconBg,
  subtitleColor = "text-gray-500 dark:text-gray-400",
  subtitleIcon,
}) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow duration-200">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {title}
        </p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
          {value}
        </p>
        {subtitle && (
          <p className={`text-sm mt-1 ${subtitleColor}`}>
            {subtitleIcon}
            {subtitle}
          </p>
        )}
      </div>
      <div className={`p-3 rounded-lg ${iconBg}`}>{icon}</div>
    </div>
  </div>
);

export default AdminHome;
