import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  LineChart,
  BarChart,
  PieChart,
  Line,
  Bar,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  DollarSign,
  Users,
  Activity,
  HeartPulse,
  Download,
  RefreshCw,
  ChevronRight,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import useAxios from "../../../hooks/useAxios";
import useAuth from "../../../hooks/useAuth";
import { format, parseISO } from "date-fns";
import { useNavigate } from "react-router";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import ErrorMessage from "../../../components/common/ErrorMessage";
import useTitle from "../../../hooks/useTitle";

const Analytics = () => {
  const navigate = useNavigate();
  const { user, userRole } = useAuth();
  const [timeRange, setTimeRange] = useState("weekly");
  const [reportLoading, setReportLoading] = useState(false);
  const axiosSecure = useAxios();

  useTitle("Analytics | LifeFlow - Blood Donation");

  // Fetch stats with auto-refresh every 5 minutes
  const {
    data: stats,
    isLoading: statsLoading,
    isError: statsError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["funding-stats"],
    queryFn: async () => {
      const { data } = await axiosSecure.get("/funds/stats");
      return data;
    },
    enabled: !!user && !!userRole,
    refetchInterval: 300000,
    staleTime: 300000,
  });

  // Fetch recent donations
  const {
    data: recentDonations,
    isLoading: donationsLoading,
    isError: donationsError,
    refetch: refetchDonations,
  } = useQuery({
    queryKey: ["recent-funds"],
    queryFn: async () => {
      const { data } = await axiosSecure.get("/funds?limit=5");
      return data;
    },
    enabled: !!user && !!userRole,
  });

  // Generate chart data based on selected time range
  const getChartData = () => {
    if (!stats?.data) return [];

    const trends = stats.data[timeRange]?.trends || [];

    return trends.map((item) => ({
      name:
        timeRange === "yearly"
          ? format(parseISO(item.date + "-01"), "MMM yyyy")
          : format(parseISO(item.date), "MMM d"),
      donations: item.total,
      donors: item.count,
    }));
  };

  // Handle report generation
  const handleGenerateReport = async () => {
    setReportLoading(true);
    try {
      const response = await axiosSecure.get("/funds/report", {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `donation-report-${format(new Date(), "yyyy-MM-dd")}.pdf`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Report generation failed:", error);
    } finally {
      setReportLoading(false);
    }
  };

  // Handle view all donations
  const handleViewAllDonations = () => {
    navigate("/admin/donations");
  };

  // Handle refresh data
  const handleRefreshData = () => {
    refetch();
    refetchDonations();
  };

  // Combined loading check
  if (statsLoading || donationsLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (statsError || donationsError) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
        <ErrorMessage
          title="Failed to load analytics data"
          description={error.message}
          actionText="Try Again"
          onAction={() => {
            refetch();
            refetchDonations();
          }}
        />
      </div>
    );
  }

  const chartData = getChartData();

  return (
    <div className="max-w-screen-2xl mx-auto px-4 py-6">
      {/* Dashboard Header */}
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Donation Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            {format(new Date(), "EEEE, MMMM d, yyyy")}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleRefreshData}
            className="px-3 py-2 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow-md flex items-center gap-2 border border-gray-200 dark:border-gray-600"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button
            onClick={handleGenerateReport}
            disabled={reportLoading}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow-md flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {reportLoading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Generating...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Generate Report
              </>
            )}
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Funds Raised"
          value={`$${stats?.data?.totalFunds?.toLocaleString() || 0}`}
          subtitle="All time"
          icon={
            <DollarSign className="w-6 h-6 text-amber-600 dark:text-amber-400" />
          }
          iconBg="bg-amber-50 dark:bg-amber-900/30"
        />
        <StatCard
          title="Total Donations"
          value={stats?.data?.totalDonations?.toLocaleString() || 0}
          subtitle="All donations"
          icon={
            <Activity className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          }
          iconBg="bg-blue-50 dark:bg-blue-900/30"
        />
        <StatCard
          title="Unique Donors"
          value={stats?.data?.totalDonors?.toLocaleString() || 0}
          subtitle="Individual donors"
          icon={
            <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          }
          iconBg="bg-purple-50 dark:bg-purple-900/30"
        />
        <StatCard
          title="Avg. Donation"
          value={`$${stats?.data?.avgDonation || 0}`}
          subtitle="Per donation"
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
              {timeRange === "weekly"
                ? "Weekly"
                : timeRange === "monthly"
                ? "Monthly"
                : "Yearly"}{" "}
              Donations Trend
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setTimeRange("weekly")}
                className={`px-3 py-1 text-xs rounded-full border ${
                  timeRange === "weekly"
                    ? "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-800/30"
                    : "bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-100 dark:border-gray-600"
                }`}
              >
                Weekly
              </button>
              <button
                onClick={() => setTimeRange("monthly")}
                className={`px-3 py-1 text-xs rounded-full border ${
                  timeRange === "monthly"
                    ? "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-800/30"
                    : "bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-100 dark:border-gray-600"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setTimeRange("yearly")}
                className={`px-3 py-1 text-xs rounded-full border ${
                  timeRange === "yearly"
                    ? "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-800/30"
                    : "bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-100 dark:border-gray-600"
                }`}
              >
                Yearly
              </button>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
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
                  dataKey="donations"
                  stroke="#F59E0B"
                  fillOpacity={1}
                  fill="url(#colorAmount)"
                  activeDot={{ r: 6 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-between mt-4 text-sm text-gray-500 dark:text-gray-400">
            <span>
              Total: ${stats?.data?.[timeRange]?.total?.toLocaleString() || 0}
            </span>
            <span>{stats?.data?.[timeRange]?.donations || 0} donations</span>
            <span>{stats?.data?.[timeRange]?.donors || 0} donors</span>
          </div>
        </div>

        {/* Recent Donations */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Donations
            </h2>
            <button
              onClick={handleViewAllDonations}
              className="text-sm text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 flex items-center gap-1"
            >
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-4">
            {recentDonations?.data?.length > 0 ? (
              recentDonations.data.map((donation) => (
                <div
                  key={donation._id}
                  className="group p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/admin/donations/${donation._id}`)}
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
                      <span
                        className={`text-xs px-2 py-1 rounded-full mt-1 ${
                          donation.status === "completed"
                            ? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                            : "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400"
                        }`}
                      >
                        {donation.status?.toUpperCase() || "PENDING"}
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

      {/* Additional Metrics */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Donation Sources
        </h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={[
                  {
                    name: "Website",
                    value: stats?.data?.sources?.website || 0,
                  },
                  {
                    name: "Mobile App",
                    value: stats?.data?.sources?.mobile || 0,
                  },
                  {
                    name: "Social Media",
                    value: stats?.data?.sources?.social || 0,
                  },
                  { name: "Email", value: stats?.data?.sources?.email || 0 },
                ]}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  borderColor: "rgba(0, 0, 0, 0.1)",
                  borderRadius: "0.5rem",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  padding: "12px",
                }}
                formatter={(value, name) => [`${value}`, name]}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, subtitle, icon, iconBg, onClick }) => (
  <div
    onClick={onClick}
    className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow ${
      onClick
        ? "cursor-pointer hover:border-amber-300 dark:hover:border-amber-600"
        : ""
    }`}
  >
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
      <div className={`p-3 rounded-lg ${iconBg}`}>{icon}</div>
    </div>
  </div>
);

export default Analytics;
