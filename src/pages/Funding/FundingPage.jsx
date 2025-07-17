import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxios from "../../hooks/useAxios";
import { toast } from "react-hot-toast";
import {
  ArrowUpRight,
  CreditCard,
  Users,
  DollarSign,
  Loader2,
  HeartHandshake,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";
import GiveFundModal from "../../components/modal/GiveFundModal";
import StatsCard from "../../components/common/StatsCard";
import Pagination from "../../components/common/Pagination";
import FundingTable from "./FundingTable";
import useRole from "../../hooks/useRole";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const FundingPage = () => {
  const { user } = useAuth();
  const axiosSecure = useAxios();
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const { isAdmin, isVolunteer, isLoading } = useRole();

  console.log(isAdmin, isVolunteer);
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
  });

  const { mutate: createDonation } = useMutation({
    mutationFn: async (donationData) => {
      const res = await axiosSecure.post("/funds", donationData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["funds"]);
      queryClient.invalidateQueries(["fund-stats"]);
    },
  });

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

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

  if (fundsLoading || isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-screen-2xl mx-auto p-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
            Funding Records
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1 text-sm sm:text-base">
            Track all donations and financial contributions
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-[#DC2626] hover:bg-red-700 text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg transition-colors text-sm sm:text-base"
          disabled={!user}
          title={!user ? "Please login to donate" : ""}
        >
          <HeartHandshake className="h-4 w-4 sm:h-5 sm:w-5" />
          <span>Make a Donation</span>
        </button>
      </div>

      {/* Stats */}
      {(isAdmin || isVolunteer) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
          <StatsCard
            title="Total Funds"
            value={
              fundsLoading ? (
                <Loader2 className="h-5 w-5 animate-spin text-[#DC2626]" />
              ) : (
                `$${stats.totalFunds?.toLocaleString()}`
              )
            }
            icon={<DollarSign className="h-5 w-5 text-[#DC2626]" />}
            trend={`+${stats.recentAmount || 0} recent`}
          />
          <StatsCard
            title="Total Donors"
            value={
              fundsLoading ? (
                <Loader2 className="h-5 w-5 animate-spin text-[#DC2626]" />
              ) : (
                stats.totalDonors?.toLocaleString()
              )
            }
            icon={<Users className="h-5 w-5 text-[#DC2626]" />}
            trend="All time"
          />
          <StatsCard
            title="Recent Donation"
            value={
              fundsLoading ? (
                <Loader2 className="h-5 w-5 animate-spin text-[#DC2626]" />
              ) : (
                `$${stats.recentAmount?.toLocaleString()}`
              )
            }
            icon={<ArrowUpRight className="h-5 w-5 text-[#DC2626]" />}
            trend="Latest contribution"
          />
        </div>
      )}
      {/* Funding Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow  overflow-hidden">
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
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />
          <div className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-xl shadow-lg">
            <GiveFundModal
              onFundSubmit={handleFundSubmit}
              onClose={() => setShowModal(false)}
              user={user}
              onSuccess={handleSuccess}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FundingPage;
