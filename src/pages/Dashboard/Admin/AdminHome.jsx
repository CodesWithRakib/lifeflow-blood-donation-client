import { useQuery } from "@tanstack/react-query";
import {
  Users,
  DollarSign,
  Activity,
  TrendingUp,
  Clock,
  HeartPulse,
  UserCheck,
  User,
  Droplet,
  MapPin,
  CheckCircle,
  AlertCircle,
  ChevronRight,
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
  AreaChart,
  Area,
} from "recharts";
import useTitle from "../../../hooks/useTitle";
import { useUser } from "../../../hooks/useUser";

const AdminHome = () => {
  const axiosSecure = useAxios();
  const { user, loading: authLoading, userRole, roleLoading } = useAuth();
  const { data: userData } = useUser();
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
  if (authLoading || roleLoading || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
        <ErrorMessage
          title="Failed to load dashboard data"
          description={error.message}
          actionText="Try Again"
          onAction={() => refetch()}
        />
      </div>
    );
  }

  const weeklyData =
    stats?.data?.weeklyTrends?.map((item) => ({
      name: format(parseISO(item.date), "EEE"),
      amount: item.total,
    })) || [];

  return (
    <div className="max-w-screen-2xl mx-auto px-4 py-6">
      {/* Welcome + Info Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Welcome Section */}
        <div className="col-span-2 p-6 rounded-xl bg-gradient-to-r from-amber-100 to-amber-50 dark:from-amber-900/50 dark:to-amber-800/30 shadow-sm border border-amber-200/50 dark:border-amber-800/50 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={user?.photoURL || "/default-avatar.png"}
                alt="User Avatar"
                className="w-16 h-16 rounded-full border-4 border-amber-500/20 dark:border-amber-400/20 shadow-sm"
              />
              <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1 border-2 border-white dark:border-gray-800">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-amber-50">
                Welcome back, {user?.displayName}!
              </h1>
              <p className="text-gray-600 dark:text-amber-100/80 capitalize flex items-center gap-1 mt-1">
                <HeartPulse className="w-4 h-4" />
                {userData?.role === "admin" && <span>Administrator</span>}
                {userData?.role === "volunteer" && <span>Volunteer</span>}
              </p>
              <p className="text-sm text-gray-500 dark:text-amber-100/60 mt-2">
                Last login: {format(new Date(), "MMM d, h:mm a")}
              </p>
            </div>
          </div>
        </div>

        {/* User Info Card */}
        <div className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
          <h3 className="font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2 mb-4 pb-2 border-b border-gray-100 dark:border-gray-700">
            <User className="w-5 h-5 text-amber-500" />
            <span>Your Profile</span>
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
              <div className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20">
                <Droplet className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Blood Group
                </p>
                <p className="font-medium">
                  {userData?.bloodGroup || "Not specified"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
              <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                <MapPin className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Location
                </p>
                <p className="font-medium">
                  {userData?.district || "Unknown"},{" "}
                  {userData?.upazila || "Unknown"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
              <div className="p-2 rounded-lg bg-green-50 dark:bg-green-900/20">
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center ${
                    userData?.status === "active"
                      ? "bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400"
                      : "bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400"
                  }`}
                >
                  {userData?.status === "active" ? (
                    <CheckCircle className="w-3 h-3" />
                  ) : (
                    <AlertCircle className="w-3 h-3" />
                  )}
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Status
                </p>
                <p className="font-medium capitalize">
                  {userData?.status || "Unknown"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Header */}
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard Overview
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            {format(new Date(), "EEEE, MMMM d, yyyy")}
          </p>
        </div>
        <button className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow-md flex items-center gap-2">
          Generate Report
          <ChevronRight className="w-4 h-4" />
        </button>
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
          trend="up"
          trendValue="12%"
        />
        <StatCard
          title="Total Donors"
          value={stats?.data?.totalDonors?.toLocaleString() || 0}
          subtitle="+5 new this week"
          icon={<Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />}
          iconBg="bg-blue-50 dark:bg-blue-900/30"
          trend="up"
          trendValue="5"
        />
        <StatCard
          title="Weekly Donations"
          value={`$${stats?.data?.weeklyTotal?.toLocaleString() || 0}`}
          subtitle={`${stats?.data?.weeklyDonations || 0} donations`}
          icon={
            <Activity className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          }
          iconBg="bg-purple-50 dark:bg-purple-900/30"
          trend="up"
          trendValue="8%"
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
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Weekly Donations Trend
            </h2>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-xs bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-full border border-amber-100 dark:border-amber-800/30">
                Weekly
              </button>
              <button className="px-3 py-1 text-xs bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full border border-gray-100 dark:border-gray-600">
                Monthly
              </button>
              <button className="px-3 py-1 text-xs bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full border border-gray-100 dark:border-gray-600">
                Yearly
              </button>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={weeklyData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
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
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    borderColor: "rgba(0, 0, 0, 0.1)",
                    borderRadius: "0.5rem",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    padding: "12px",
                  }}
                  formatter={(value) => [`$${value}`, "Amount"]}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#F59E0B"
                  fillOpacity={1}
                  fill="url(#colorAmount)"
                  activeDot={{ r: 6 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Donations */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Donations
            </h2>
            <button className="text-sm text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 flex items-center gap-1">
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-4">
            {recentDonations?.data?.length > 0 ? (
              recentDonations.data.map((donation) => (
                <div
                  key={donation._id}
                  className="group p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                        ${donation.amount?.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        by {donation.userName || "Anonymous"}
                      </p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {format(new Date(donation.createdAt), "MMM d")}
                      </span>
                      <span className="text-xs px-2 py-1 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-full mt-1">
                        Completed
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                  <DollarSign className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                </div>
                <p className="text-gray-500 dark:text-gray-400">
                  No recent donations
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                  Donations will appear here
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Additional Metrics Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Campaign Performance
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard
            title="Conversion Rate"
            value="3.2%"
            change="+0.5%"
            trend="up"
            icon={<TrendingUp className="w-5 h-5" />}
          />
          <MetricCard
            title="Avg. Donation"
            value="$128"
            change="+$12"
            trend="up"
            icon={<TrendingUp className="w-5 h-5" />}
          />
          <MetricCard
            title="New Donors"
            value="24"
            change="-3"
            trend="down"
            icon={<TrendingUp className="w-5 h-5" />}
          />
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
  trend,
  trendValue,
}) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow group">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {title}
        </p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
          {value}
        </p>
        {subtitle && (
          <p className="text-sm mt-2 text-gray-500 dark:text-gray-400">
            {subtitle}
          </p>
        )}
      </div>
      <div className="relative">
        <div className={`p-3 rounded-lg ${iconBg}`}>{icon}</div>
        {trend && (
          <span
            className={`absolute -top-2 -right-2 text-xs px-1.5 py-0.5 rounded-full ${
              trend === "up"
                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
            }`}
          >
            {trend === "up" ? "↑" : "↓"} {trendValue}
          </span>
        )}
      </div>
    </div>
  </div>
);

const MetricCard = ({ title, value, change, trend, icon }) => (
  <div className="p-4 rounded-lg border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
      {title}
    </p>
    <div className="flex items-end justify-between">
      <p className="text-2xl font-bold text-gray-900 dark:text-white">
        {value}
      </p>
      <div
        className={`flex items-center text-sm ${
          trend === "up"
            ? "text-green-600 dark:text-green-400"
            : "text-red-600 dark:text-red-400"
        }`}
      >
        {icon}
        <span className="ml-1">{change}</span>
      </div>
    </div>
  </div>
);

export default AdminHome;
