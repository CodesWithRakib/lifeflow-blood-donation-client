import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxios from "../../hooks/useAxios";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowUpRight,
  CreditCard,
  Users,
  DollarSign,
  Loader2,
  HeartHandshake,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";
import FundingTable from "../../components/Funding/FundingTable";
import GiveFundModal from "../../components/modal/GiveFundModal";
import StatsCard from "../../components/common/StatsCard";
import Pagination from "../../components/common/Pagination";

const FundingPage = () => {
  const { user } = useAuth();
  const axiosSecure = useAxios();
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  };

  const slideUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      y: 20,
      transition: { duration: 0.2 },
    },
  };

  const backdrop = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3 },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2 },
    },
  };

  // Fetch funding data with stats included
  const {
    data: fundsData,
    isLoading: fundsLoading,
    refetch: refetchFunds,
  } = useQuery({
    queryKey: ["funds", pagination.page, pagination.limit],
    queryFn: async () => {
      const params = new URLSearchParams(pagination).toString();
      const res = await axiosSecure.get(`/api/funds?${params}`);
      return res.data;
    },
    keepPreviousData: true,
    refetchInterval: 30000, // Auto-refresh every 30 seconds
  });

  // Mutation for creating new donations
  const { mutate: createDonation } = useMutation({
    mutationFn: async (donationData) => {
      const res = await axiosSecure.post("/api/funds", donationData);
      return res.data;
    },
    onSuccess: () => {
      // Invalidate queries to trigger refresh
      queryClient.invalidateQueries(["funds"]);
      queryClient.invalidateQueries(["fund-stats"]);
    },
  });

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handleFundSubmit = async (amount) => {
    try {
      const res = await axiosSecure.post("/api/payments/create-intent", {
        amount,
        currency: "usd",
      });
      return { clientSecret: res.data.clientSecret, amount };
    } catch (error) {
      toast.error("Failed to initiate payment");
      return null;
    }
  };

  const handleSuccess = (paymentData) => {
    // Create donation record
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

    toast.success("Thank you for your donation!");
    setShowModal(false);
  };

  // Extract data from the response
  const funds = fundsData?.data || [];
  const stats = fundsData?.stats || {
    totalFunds: 0,
    totalDonors: 0,
    recentAmount: 0,
  };
  const paginationData = fundsData?.pagination || {
    page: 1,
    limit: 10,
    totalItems: 0,
    totalPages: 1,
  };

  // Real-time updates with WebSocket (optional)
  // useEffect(() => {
  //   if (process.env.NODE_ENV === "development") return;

  //   const ws = new WebSocket(process.env.REACT_APP_WS_URL || "wss://your-api.com/ws");

  //   ws.onmessage = (event) => {
  //     const data = JSON.parse(event.data);
  //     if (data.type === "new_donation") {
  //       queryClient.invalidateQueries(["funds"]);
  //       toast.success(`New donation received: $${data.amount}`);
  //     }
  //   };

  //   return () => ws.close();
  // }, [queryClient]);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-amber-600 dark:text-amber-500">
            Funding Records
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm sm:text-base">
            Track all donations and financial contributions
          </p>
        </div>

        <motion.button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg transition-all shadow-md hover:shadow-lg text-sm sm:text-base"
          disabled={!user}
          title={!user ? "Please login to donate" : ""}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          <HeartHandshake className="h-4 w-4 sm:h-5 sm:w-5" />
          <span>Make a Donation</span>
        </motion.button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
        <StatsCard
          title="Total Funds"
          value={
            fundsLoading ? (
              <Loader2 className="h-5 w-5 animate-spin text-amber-500" />
            ) : (
              `$${stats.totalFunds?.toLocaleString()}`
            )
          }
          icon={<DollarSign className="h-5 w-5 text-amber-500" />}
          trend={`+${stats.recentAmount || 0} recent`}
        />
        <StatsCard
          title="Total Donors"
          value={
            fundsLoading ? (
              <Loader2 className="h-5 w-5 animate-spin text-amber-500" />
            ) : (
              stats.totalDonors?.toLocaleString()
            )
          }
          icon={<Users className="h-5 w-5 text-amber-500" />}
          trend="All time"
        />
        <StatsCard
          title="Recent Donation"
          value={
            fundsLoading ? (
              <Loader2 className="h-5 w-5 animate-spin text-amber-500" />
            ) : (
              `$${stats.recentAmount?.toLocaleString()}`
            )
          }
          icon={<ArrowUpRight className="h-5 w-5 text-amber-500" />}
          trend="Latest contribution"
        />
      </div>

      {/* Funding Table */}
      <motion.div
        variants={slideUp}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
      >
        <FundingTable
          funds={funds}
          loading={fundsLoading}
          isAdmin={user?.role === "admin"}
        />

        {paginationData.totalPages > 1 && (
          <div className="px-4 sm:px-6 py-4 border-t border-gray-100 dark:border-gray-700">
            <Pagination
              currentPage={paginationData.page}
              totalPages={paginationData.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              variants={backdrop}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setShowModal(false)}
            />

            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
              <motion.div
                variants={slideUp}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
              >
                <GiveFundModal
                  onFundSubmit={handleFundSubmit}
                  onClose={() => setShowModal(false)}
                  user={user}
                  onSuccess={handleSuccess}
                />
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default FundingPage;
