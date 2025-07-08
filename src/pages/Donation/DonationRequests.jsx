import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import useTitle from "../../hooks/useTitle";
import useAxios from "../../hooks/useAxios";
import {
  Droplet,
  MapPin,
  Calendar,
  Clock,
  Filter,
  Search,
  Hospital,
} from "lucide-react";
import axios from "axios";

const DonationRequests = () => {
  useTitle("Donation Requests");
  const { user } = useAuth();
  const navigate = useNavigate();
  const axiosSecure = useAxios();

  // State management
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 9,
    totalItems: 0,
    totalPages: 1,
  });
  const [filters, setFilters] = useState({
    status: "pending",
    bloodGroup: "",
    district: "",
    upazila: "",
    search: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const [districts, setDistricts] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch districts for filter dropdown
  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const res = await axios.get("/districts.json");
        setDistricts(res.data);
      } catch (err) {
        console.error("Failed to load districts", err);
      }
    };
    fetchDistricts();
  }, [axiosSecure]);

  // Fetch donation requests
  useEffect(() => {
    if (!user) {
      navigate("/login", { state: { from: "/donation-requests" } });
      return;
    }

    const fetchRequests = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          ...filters,
          page: pagination.page,
          limit: pagination.limit,
        }).toString();

        const res = await axiosSecure.get(`/api/donation-requests?${params}`);

        setRequests(res.data.data);
        setPagination({
          ...pagination,
          totalItems: res.data.pagination.totalItems,
          totalPages: res.data.pagination.totalPages,
        });
      } catch (err) {
        console.error(err);
        toast.error("Unable to load requests");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [user, navigate, axiosSecure, filters, pagination.page]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Reset to first page when filters change
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Trigger refetch with new search term
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, page: newPage }));
    }
  };

  if (!user) return null;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-amber-600 dark:text-amber-500">
            Donation Requests
          </h1>

          <div className="flex gap-3 w-full md:w-auto">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg"
            >
              <Filter size={18} />
              <span>Filters</span>
            </button>

            <form onSubmit={handleSearch} className="flex-1 md:flex-none">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search requests..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, search: e.target.value }))
                  }
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </form>
          </div>
        </div>

        {showFilters && (
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-6 border border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="fulfilled">Fulfilled</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Blood Group
                </label>
                <select
                  name="bloodGroup"
                  value={filters.bloodGroup}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                >
                  <option value="">All Groups</option>
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                    (group) => (
                      <option key={group} value={group}>
                        {group}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  District
                </label>
                <select
                  name="district"
                  value={filters.district}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                >
                  <option value="">All Districts</option>
                  {districts.map((district) => (
                    <option key={district.id} value={district.name}>
                      {district.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Sort By
                </label>
                <select
                  name="sortBy"
                  value={filters.sortBy}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                >
                  <option value="createdAt">Date Created</option>
                  <option value="date">Donation Date</option>
                  <option value="recipientName">Recipient Name</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {requests.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No donation requests found matching your criteria.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {requests.map((req) => (
                <div
                  key={req._id}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow hover:shadow-md transition-shadow overflow-hidden"
                >
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 line-clamp-1">
                        {req.recipientName}
                      </h2>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          req.status === "pending"
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100"
                            : req.status === "approved"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                            : req.status === "fulfilled"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                        }`}
                      >
                        {req.status.charAt(0).toUpperCase() +
                          req.status.slice(1)}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Droplet className="h-4 w-4 text-amber-600 dark:text-amber-500" />
                        <span>
                          Blood Group: <strong>{req.bloodGroup}</strong>
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <MapPin className="h-4 w-4 text-amber-600 dark:text-amber-500" />
                        <span>
                          {req.district}, {req.upazila}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Hospital className="h-4 w-4 text-amber-600 dark:text-amber-500" />
                        <span className="line-clamp-1">{req.hospital}</span>
                      </div>

                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Calendar className="h-4 w-4 text-amber-600 dark:text-amber-500" />
                        <span>{new Date(req.date).toLocaleDateString()}</span>
                      </div>

                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Clock className="h-4 w-4 text-amber-600 dark:text-amber-500" />
                        <span>{req.time}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => navigate(`/donation-requests/${req._id}`)}
                      className="mt-4 w-full py-2 bg-amber-600 hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-800 text-white rounded-lg transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <nav className="flex items-center gap-1">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50"
                  >
                    Previous
                  </button>

                  {Array.from(
                    { length: Math.min(5, pagination.totalPages) },
                    (_, i) => {
                      let pageNum;
                      if (pagination.totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (pagination.page <= 3) {
                        pageNum = i + 1;
                      } else if (pagination.page >= pagination.totalPages - 2) {
                        pageNum = pagination.totalPages - 4 + i;
                      } else {
                        pageNum = pagination.page - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-3 py-1 rounded-lg ${
                            pagination.page === pageNum
                              ? "bg-amber-600 text-white"
                              : "border border-gray-300 dark:border-gray-600"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                  )}

                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                    className="px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DonationRequests;
