import React, { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import {
  ArrowUpRight,
  CreditCard,
  Users,
  DollarSign,
  Loader2,
  HeartHandshake,
  TrendingUp,
  PiggyBank,
  HandHeart,
  Info,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";
import GiveFundModal from "../../components/modal/GiveFundModal";
import Pagination from "../../components/common/Pagination";
import FundingTable from "./FundingTable";
import useRole from "../../hooks/useRole";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import useAxios from "../../hooks/useAxios";
import { toast } from "react-hot-toast";

// Memoized Stats Card Component
const StatsCard = React.memo(({ title, value, icon, trend, color = "red" }) => {
  const colorClasses = {
    red: "text-red-500",
    green: "text-green-500",
    blue: "text-blue-500",
    amber: "text-amber-500",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition-all duration-300"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
          {trend && (
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1 flex items-center">
              <TrendingUp
                className={`h-3 w-3 mr-1 ${
                  colorClasses[color] || colorClasses.red
                }`}
              />
              {trend}
            </p>
          )}
        </div>
        <div
          className={`p-3 rounded-lg bg-${color}-50 dark:bg-${color}-900/20`}
        >
          {React.cloneElement(icon, {
            className: `h-5 w-5 ${colorClasses[color] || colorClasses.red}`,
          })}
        </div>
      </div>
    </motion.div>
  );
});

const FundingPage = () => {
  const { user } = useAuth();
  const axiosSecure = useAxios();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const { isAdmin, isVolunteer, isLoading: roleLoading } = useRole();
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });

  // Fetch funding data with stats
  const {
    data: fundsData,
    isLoading: fundsLoading,
    refetch: refetchFunds,
  } = useQuery({
    queryKey: ["funds", pagination.page, pagination.limit],
    queryFn: async () => {
      const params = new URLSearchParams(pagination).toString();
      const res = await axiosSecure.get(`/funds?${params}`);
      return res.data;
    },
    keepPreviousData: true,
    refetchInterval: 30000,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const { mutate: createDonation } = useMutation({
    mutationFn: async (donationData) => {
      const res = await axiosSecure.post("/funds", donationData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["funds"]);
      queryClient.invalidateQueries(["fund-stats"]);
      toast.success("Donation successful! Thank you for your contribution.");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to record donation");
    },
  });

  // Handle page change
  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle fund submission
  const handleFundSubmit = async (amount) => {
    try {
      const res = await axiosSecure.post("/payments/create-intent", {
        amount,
        currency: "usd",
      });
      return { clientSecret: res.data.clientSecret, amount };
    } catch (error) {
      toast.error("Failed to initiate payment");
      return null;
    }
  };

  // Handle successful payment
  const handleSuccess = (paymentData) => {
    createDonation({
      userEmail: user?.email,
      userName: user?.displayName || "Anonymous",
      amount: paymentData.amount,
      currency: "usd",
      paymentIntentId: paymentData.paymentIntent.id,
      status: "succeeded",
      metadata: {
        isAnonymous: false,
        campaign: "general",
      },
    });
    setShowModal(false);
  };

  // Memoize derived data
  const funds = useMemo(() => fundsData?.data || [], [fundsData]);
  const stats = useMemo(
    () =>
      fundsData?.stats || {
        totalFunds: 0,
        totalDonors: 0,
        recentAmount: 0,
      },
    [fundsData]
  );

  const paginationData = useMemo(
    () =>
      fundsData?.pagination || {
        page: 1,
        limit: 10,
        totalItems: 0,
        totalPages: 1,
      },
    [fundsData]
  );

  // Loading state
  if (fundsLoading || roleLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-screen-2xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
      >
        <div>
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200 mb-3">
            <PiggyBank className="w-4 h-4 mr-1" />
            Funding Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
            Funding Records
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1 text-sm sm:text-base">
            Track all donations and financial contributions
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            if (!user) {
              toast.error("Please login to donate");
              navigate("/login", { state: { from: "/funding" } });
              return;
            }
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 sm:px-5 py-2.5 rounded-lg transition-colors text-sm sm:text-base shadow-md hover:shadow-lg"
          title={!user ? "Please login to donate" : ""}
        >
          <HeartHandshake className="h-4 w-4 sm:h-5 sm:w-5" />
          <span>Make a Donation</span>
        </motion.button>
      </motion.div>

      {/* Stats Section */}
      {(isAdmin || isVolunteer) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8"
        >
          <StatsCard
            title="Total Funds"
            value={
              fundsLoading ? (
                <Loader2 className="h-5 w-5 animate-spin text-red-500" />
              ) : (
                `$${stats.totalFunds?.toLocaleString()}`
              )
            }
            icon={<DollarSign />}
            trend={`+$${stats.recentAmount || 0} recent`}
            color="red"
          />
          <StatsCard
            title="Total Donors"
            value={
              fundsLoading ? (
                <Loader2 className="h-5 w-5 animate-spin text-red-500" />
              ) : (
                stats.totalDonors?.toLocaleString()
              )
            }
            icon={<Users />}
            trend="All time"
            color="blue"
          />
          <StatsCard
            title="Recent Donation"
            value={
              fundsLoading ? (
                <Loader2 className="h-5 w-5 animate-spin text-red-500" />
              ) : (
                `$${stats.recentAmount?.toLocaleString()}`
              )
            }
            icon={<ArrowUpRight />}
            trend="Latest contribution"
            color="green"
          />
        </motion.div>
      )}

      {/* Info Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-r from-red-50 to-amber-50 dark:from-red-900/20 dark:to-amber-900/20 rounded-xl p-5 mb-8 border border-red-100 dark:border-red-800/30"
      >
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
            <Info className="h-5 w-5 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white mb-1">
              How Your Donation Helps
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Your contributions help us maintain blood banks, organize donation
              drives, and provide critical support to patients in need. Every
              dollar makes a difference.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Funding Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden"
      >
        <FundingTable
          funds={funds}
          loading={fundsLoading}
          isAdmin={user?.role === "admin"}
        />
        {paginationData.totalPages > 1 && (
          <div className="px-4 sm:px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <Pagination
              currentPage={paginationData.page}
              totalPages={paginationData.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-8 bg-gradient-to-r from-red-600 to-red-700 rounded-xl p-6 text-white shadow-lg"
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <HandHeart className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Make a Difference Today</h3>
              <p className="text-red-100 text-sm mt-1">
                Your donation helps save lives through blood donation
                initiatives
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              if (!user) {
                toast.error("Please login to donate");
                navigate("/login", { state: { from: "/funding" } });
                return;
              }
              setShowModal(true);
            }}
            className="px-6 py-3 bg-white text-red-600 font-medium rounded-lg hover:bg-gray-100 transition-colors shadow-md"
          >
            Donate Now
          </motion.button>
        </div>
      </motion.div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-xl shadow-lg"
          >
            <GiveFundModal
              onFundSubmit={handleFundSubmit}
              onClose={() => setShowModal(false)}
              user={user}
              onSuccess={handleSuccess}
            />
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default FundingPage;
