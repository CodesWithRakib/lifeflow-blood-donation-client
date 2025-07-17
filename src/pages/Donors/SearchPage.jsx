import { useState } from "react";
import { useForm } from "react-hook-form";
import { Droplet, Search, Frown, Filter, MapPin, Download } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import useAxios from "../../hooks/useAxios";
import DonorCard from "./DonorCard";
import upazilas from "../../constants/upazilas";
import districts from "../../constants/districts";
import useTitle from "../../hooks/useTitle";

// Create styles for PDF
const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
    color: "#e53e3e",
  },
  subheader: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: "center",
    color: "#718096",
  },
  donorGrid: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 15,
  },
  donorCard: {
    border: "1px solid #e2e8f0",
    borderRadius: 5,
    padding: 15,
    width: "48%",
    marginBottom: 15,
  },
  donorName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  donorInfo: {
    fontSize: 12,
    marginBottom: 3,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 10,
    color: "#2d3748",
  },
});

// PDF Document Component
const DonorsPDF = ({ donors, filters }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>Blood Donors List</Text>
      <Text style={styles.subheader}>
        {filters.district || "All Districts"}
        {filters.upazila ? `, ${filters.upazila}` : ""}
      </Text>
      <Text style={styles.sectionTitle}>
        Available Donors ({donors.length})
      </Text>
      <View style={styles.donorGrid}>
        {donors.map((donor) => (
          <View key={donor._id} style={styles.donorCard}>
            <Text style={styles.donorName}>{donor.name}</Text>
            <Text style={styles.donorInfo}>
              Blood Group: {donor.bloodGroup}
            </Text>
            <Text style={styles.donorInfo}>District: {donor.district}</Text>
            <Text style={styles.donorInfo}>Upazila: {donor.upazila}</Text>
            <Text style={styles.donorInfo}>
              Contact: {donor.contactNumber || "N/A"}
            </Text>
            <Text style={styles.donorInfo}>
              Last Donation:{" "}
              {new Date(
                donor.lastDonationDate || Date.now()
              ).toLocaleDateString()}
            </Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

const SearchPage = () => {
  const axiosSecure = useAxios();
  const { register, handleSubmit, watch, setValue, reset } = useForm();
  const [selectedDistrictId, setSelectedDistrictId] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  useTitle("Search Donors | LifeFlow - Blood Donation");
  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  const filteredUpazilas = selectedDistrictId
    ? upazilas.filter((u) => u.district_id === selectedDistrictId)
    : [];

  const {
    data: donors = [],
    isFetching: isSearching,
    refetch,
  } = useQuery({
    queryKey: ["donors", watch()],
    queryFn: async () => {
      const { bloodGroup, district, upazila } = watch();
      if (!bloodGroup || !district) return [];

      const response = await axiosSecure.get("/donors/search", {
        params: { bloodGroup, district, upazila },
      });
      return response.data || [];
    },
    enabled: false, // Disable automatic fetching
    staleTime: 60000, // 1 minute cache
  });

  const onSubmit = async (data) => {
    await refetch();
  };

  const handleReset = () => {
    reset();
    setSelectedDistrictId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
            <Droplet className="text-red-500 h-8 w-8" />
            <span>Find Blood Donors</span>
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Search for available blood donors in your area. Your search could
            save a life.
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Search className="text-red-500 h-5 w-5" />
              <span>Search Filters</span>
            </h2>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center gap-1 text-sm text-red-600 dark:text-red-400"
            >
              <Filter className="h-4 w-4" />
              {showFilters ? "Hide" : "Show"} Filters
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className={`${showFilters ? "block" : "hidden"} md:block`}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Blood Group */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Blood Group *
                  </label>
                  <select
                    {...register("bloodGroup", { required: true })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select Blood Group</option>
                    {bloodGroups.map((group) => (
                      <option key={group} value={group}>
                        {group}
                      </option>
                    ))}
                  </select>
                </div>

                {/* District */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    District *
                  </label>
                  <select
                    {...register("district", { required: true })}
                    onChange={(e) => {
                      const selectedName = e.target.value;
                      setValue("district", selectedName);
                      const selected = districts.find(
                        (d) => d.name === selectedName
                      );
                      setSelectedDistrictId(selected?.id);
                      setValue("upazila", "");
                    }}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select District</option>
                    {districts.map((d) => (
                      <option key={d.id} value={d.name}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Upazila */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Upazila
                  </label>
                  <select
                    {...register("upazila")}
                    disabled={!selectedDistrictId}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">Any Upazila</option>
                    {filteredUpazilas.map((u) => (
                      <option key={u.id} value={u.name}>
                        {u.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isSearching}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
                >
                  {isSearching ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-white"
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
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="h-5 w-5" />
                      Search Donors
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Results Section */}
        <div className="mb-12">
          {donors.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Available Donors ({donors.length})
                  </h2>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    {watch("district") || "All Districts"}
                    {watch("upazila") ? `, ${watch("upazila")}` : ""}
                  </div>
                </div>
                <PDFDownloadLink
                  document={<DonorsPDF donors={donors} filters={watch()} />}
                  fileName="blood-donors-list.pdf"
                  className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"
                >
                  {({ loading }) => (
                    <>
                      <Download className="h-4 w-4" />
                      {loading ? "Preparing PDF..." : "Download as PDF"}
                    </>
                  )}
                </PDFDownloadLink>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {donors.map((donor) => (
                  <DonorCard key={donor._id} donor={donor} />
                ))}
              </div>
            </>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center">
              <div className="flex flex-col items-center justify-center space-y-4">
                <Frown className="h-16 w-16 text-gray-400 dark:text-gray-500" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {isSearching
                    ? "Searching for donors..."
                    : "No donors found matching your criteria"}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                  {isSearching
                    ? "Please wait while we search our database"
                    : "Try adjusting your search filters or check back later. You can also consider expanding your search area."}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
