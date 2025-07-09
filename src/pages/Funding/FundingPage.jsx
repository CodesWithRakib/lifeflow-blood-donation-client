import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../hooks/useAxios";
import { toast } from "react-hot-toast";
import FundingTable from "../../components/Funding/FundingTable";
import GiveFundModal from "../../components/modal/GiveFundModal";
import { ArrowUpRight, CreditCard, Users, DollarSign } from "lucide-react";
import StatsCard from "../../components/common/StatsCard";
import Pagination from "../../components/common/Pagination";
import useAuth from "../../hooks/useAuth";

const FundingPage = () => {
  const { user } = useAuth();
  const axiosSecure = useAxios();
  const [showModal, setShowModal] = useState(false);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });

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
  });

  const {
    data: statsData,
    isLoading: statsLoading,
    refetch: refetchStats,
  } = useQuery({
    queryKey: ["fund-stats"],
    queryFn: async () => {
      const res = await axiosSecure.get("/api/funds/stats");
      return res.data;
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

  const handleSuccess = () => {
    refetchFunds();
    refetchStats();
  };

  const funds = fundsData?.data || [];
  const paginationData = fundsData?.pagination || {
    page: 1,
    limit: 10,
    totalItems: 0,
    totalPages: 1,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-amber-600 dark:text-amber-500">
            Funding Records
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track all donations and financial contributions
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-700 text-white px-5 py-2.5 rounded-lg transition-colors shadow-md hover:shadow-lg"
          disabled={!user}
          title={!user ? "Please login to donate" : ""}
        >
          <CreditCard className="h-5 w-5" />
          <span>Make a Donation</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard
          title="Total Funds"
          value={
            statsLoading
              ? "Loading..."
              : `$${statsData?.totalFunds?.toLocaleString()}`
          }
          icon={<DollarSign className="h-5 w-5 text-amber-500" />}
          trend={`+${statsData?.recentAmount || 0} recent`}
        />
        <StatsCard
          title="Total Donors"
          value={
            statsLoading
              ? "Loading..."
              : statsData?.totalDonors?.toLocaleString()
          }
          icon={<Users className="h-5 w-5 text-amber-500" />}
          trend="All time"
        />
        <StatsCard
          title="Recent Donation"
          value={
            statsLoading
              ? "Loading..."
              : `$${statsData?.recentAmount?.toLocaleString()}`
          }
          icon={<ArrowUpRight className="h-5 w-5 text-amber-500" />}
          trend="Latest contribution"
        />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
        <FundingTable
          funds={funds}
          loading={fundsLoading}
          isAdmin={user?.role === "admin"}
        />

        {paginationData.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <Pagination
              currentPage={paginationData.page}
              totalPages={paginationData.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>

      {showModal && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          role="dialog"
          aria-modal="true"
        >
          <GiveFundModal
            onFundSubmit={handleFundSubmit}
            onClose={() => setShowModal(false)}
            user={user}
            onSuccess={handleSuccess}
          />
        </div>
      )}
    </div>
  );
};

export default FundingPage;
