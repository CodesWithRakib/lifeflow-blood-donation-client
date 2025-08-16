import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Droplet,
  Search,
  Frown,
  Filter,
  MapPin,
  Download,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";
import useAxios from "../../hooks/useAxios";
import DonorCard from "./DonorCard";
import upazilas from "../../constants/upazilas";
import districts from "../../constants/districts";
import useTitle from "../../hooks/useTitle";
import { format } from "date-fns";

// Register fonts for PDF (you'll need to load these fonts properly)
Font.register({
  family: "Helvetica-Bold",
  src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf",
});

Font.register({
  family: "Helvetica",
  src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf",
});

// Create styles for PDF
const pdfStyles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: "#E53935",
    paddingBottom: 15,
  },
  logo: {
    width: 120,
    height: 40,
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#E53935",
    fontFamily: "Helvetica-Bold",
  },
  subtitle: {
    fontSize: 12,
    color: "#616161",
    marginTop: 4,
  },
  metaInfo: {
    alignItems: "flex-end",
  },
  date: {
    fontSize: 10,
    color: "#757575",
  },
  filterInfo: {
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 5,
    color: "#424242",
  },
  summarySection: {
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#E53935",
  },
  summaryGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  summaryCard: {
    width: "30%",
    backgroundColor: "#F5F5F5",
    padding: 10,
    borderRadius: 4,
    alignItems: "center",
  },
  summaryNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#E53935",
  },
  summaryLabel: {
    fontSize: 10,
    color: "#616161",
  },
  donorSection: {
    marginTop: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#E53935",
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#BDBDBD",
    paddingBottom: 5,
    marginBottom: 5,
  },
  headerCell: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#424242",
    textTransform: "uppercase",
  },
  donorRow: {
    flexDirection: "row",
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: "#EEEEEE",
  },
  evenRow: {
    backgroundColor: "#FAFAFA",
  },
  cell: {
    fontSize: 10,
    color: "#424242",
  },
  nameColumn: {
    width: "25%",
  },
  bloodColumn: {
    width: "15%",
  },
  locationColumn: {
    width: "25%",
  },
  contactColumn: {
    width: "20%",
  },
  dateColumn: {
    width: "15%",
  },
  bloodGroup: {
    fontWeight: "bold",
    fontSize: 11,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#BDBDBD",
    paddingTop: 10,
  },
  footerText: {
    fontSize: 8,
    color: "#757575",
  },
  pageNumber: {
    fontSize: 8,
    color: "#757575",
  },
});

// PDF Document Component
const DonorsPDF = ({ donors, filters }) => {
  // Helper function for blood group colors
  const getBloodGroupColor = (bloodGroup) => {
    const colors = {
      "A+": "#E53935",
      "A-": "#EF5350",
      "B+": "#3949AB",
      "B-": "#5C6BC0",
      "AB+": "#43A047",
      "AB-": "#66BB6A",
      "O+": "#FB8C00",
      "O-": "#FFA726",
    };
    return colors[bloodGroup] || "#757575";
  };

  return (
    <Document>
      <Page size="A4" style={pdfStyles.page}>
        {/* Header Section */}
        <View style={pdfStyles.header}>
          <View>
            <Text style={pdfStyles.title}>LifeFlow Blood Donation Network</Text>
            <Text style={pdfStyles.subtitle}>Registered Donors Directory</Text>
          </View>
          <View style={pdfStyles.metaInfo}>
            <Text style={pdfStyles.date}>
              Generated: {format(new Date(), "MMMM d, yyyy")}
            </Text>
            <Text style={pdfStyles.filterInfo}>
              {filters.district || "All Districts"}
              {filters.upazila ? ` > ${filters.upazila}` : ""}
              {filters.bloodGroup ? ` > ${filters.bloodGroup}` : ""}
            </Text>
          </View>
        </View>

        {/* Summary Section */}
        <View style={pdfStyles.summarySection}>
          <Text style={pdfStyles.summaryTitle}>Donor Summary</Text>
          <View style={pdfStyles.summaryGrid}>
            <View style={pdfStyles.summaryCard}>
              <Text style={pdfStyles.summaryNumber}>{donors.length}</Text>
              <Text style={pdfStyles.summaryLabel}>Total Donors</Text>
            </View>
            <View style={pdfStyles.summaryCard}>
              <Text style={pdfStyles.summaryNumber}>
                {new Set(donors.map((d) => d.bloodGroup)).size}
              </Text>
              <Text style={pdfStyles.summaryLabel}>Blood Types</Text>
            </View>
            <View style={pdfStyles.summaryCard}>
              <Text style={pdfStyles.summaryNumber}>
                {new Set(donors.map((d) => d.district)).size}
              </Text>
              <Text style={pdfStyles.summaryLabel}>Districts</Text>
            </View>
          </View>
        </View>

        {/* Donor List Section */}
        <View style={pdfStyles.donorSection}>
          <Text style={pdfStyles.sectionTitle}>Donor Details</Text>
          <View style={pdfStyles.tableHeader}>
            <Text style={[pdfStyles.headerCell, pdfStyles.nameColumn]}>
              Name
            </Text>
            <Text style={[pdfStyles.headerCell, pdfStyles.bloodColumn]}>
              Blood Group
            </Text>
            <Text style={[pdfStyles.headerCell, pdfStyles.locationColumn]}>
              Location
            </Text>
            <Text style={[pdfStyles.headerCell, pdfStyles.contactColumn]}>
              Contact
            </Text>
            <Text style={[pdfStyles.headerCell, pdfStyles.dateColumn]}>
              Last Active
            </Text>
          </View>

          {donors.map((donor, index) => (
            <View
              key={donor._id}
              style={[pdfStyles.donorRow, index % 2 === 0 && pdfStyles.evenRow]}
            >
              <Text style={[pdfStyles.cell, pdfStyles.nameColumn]}>
                {donor.name}
              </Text>
              <View style={[pdfStyles.cell, pdfStyles.bloodColumn]}>
                <Text
                  style={[
                    pdfStyles.bloodGroup,
                    { color: getBloodGroupColor(donor.bloodGroup) },
                  ]}
                >
                  {donor.bloodGroup || "N/A"}
                </Text>
              </View>
              <Text style={[pdfStyles.cell, pdfStyles.locationColumn]}>
                {[donor.district, donor.upazila].filter(Boolean).join(", ")}
              </Text>
              <Text style={[pdfStyles.cell, pdfStyles.contactColumn]}>
                {donor.phone || "N/A"}
              </Text>
              <Text style={[pdfStyles.cell, pdfStyles.dateColumn]}>
                {donor.updatedAt
                  ? format(new Date(donor.updatedAt), "MMM d, yyyy")
                  : "Never"}
              </Text>
            </View>
          ))}
        </View>

        {/* Footer */}
        <View style={pdfStyles.footer}>
          <Text style={pdfStyles.footerText}>
            Confidential - For authorized use only
          </Text>
          <Text
            style={pdfStyles.pageNumber}
            render={({ pageNumber, totalPages }) =>
              `Page ${pageNumber} of ${totalPages}`
            }
            fixed
          />
        </View>
      </Page>
    </Document>
  );
};

const SearchPage = () => {
  const axiosSecure = useAxios();
  const { register, handleSubmit, watch, setValue, reset } = useForm();
  const [selectedDistrictId, setSelectedDistrictId] = useState(null);
  const [showFilters, setShowFilters] = useState(true);

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
    enabled: false,
    staleTime: 60000,
  });

  const onSubmit = async (data) => {
    await refetch();
  };

  const handleReset = () => {
    reset();
    setSelectedDistrictId(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-screen-2xl mx-auto">
        {/* Page Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center bg-red-50 dark:bg-gray-700 p-4 rounded-full mb-4">
            <Droplet className="text-red-600 dark:text-red-400 h-10 w-10" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Find Blood Donors
          </h1>
          <p className="mt-3 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Search for available blood donors in your area. Your search could
            save a life.
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 border border-gray-200 dark:border-gray-700">
          <div
            className="flex justify-between items-center mb-4 cursor-pointer md:cursor-auto"
            onClick={() => setShowFilters(!showFilters)}
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Search className="text-red-600 dark:text-red-400 h-5 w-5" />
              <span>Search Filters</span>
            </h2>
            <button className="md:hidden flex items-center gap-1 text-sm text-red-600 dark:text-red-400">
              {showFilters ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div
              className={`${
                showFilters ? "block" : "hidden"
              } md:block space-y-4`}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Blood Group */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Blood Group <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      {...register("bloodGroup", { required: true })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white appearance-none"
                    >
                      <option value="">Select Blood Group</option>
                      {bloodGroups.map((group) => (
                        <option key={group} value={group}>
                          {group}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <Droplet className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>

                {/* District */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    District <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
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
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white appearance-none"
                    >
                      <option value="">Select District</option>
                      {districts.map((d) => (
                        <option key={d.id} value={d.name}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>

                {/* Upazila */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Upazila
                  </label>
                  <div className="relative">
                    <select
                      {...register("upazila")}
                      disabled={!selectedDistrictId}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed appearance-none"
                    >
                      <option value="">Any Upazila</option>
                      {filteredUpazilas.map((u) => (
                        <option key={u.id} value={u.name}>
                          {u.name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isSearching}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transition-colors shadow-md hover:shadow-lg"
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
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-md hover:shadow-lg"
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
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Available Donors ({donors.length})
                  </h2>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    {watch("district") || "All Districts"}
                    {watch("upazila") ? `, ${watch("upazila")}` : ""}
                    {watch("bloodGroup")
                      ? ` • Blood Group: ${watch("bloodGroup")}`
                      : ""}
                  </div>
                </div>
                <PDFDownloadLink
                  document={<DonorsPDF donors={donors} filters={watch()} />}
                  fileName={`blood-donors-${watch("bloodGroup") || "all"}-${
                    watch("district") || "all"
                  }.pdf`}
                  className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 transition-colors shadow-md hover:shadow-lg"
                >
                  {({ loading }) => (
                    <>
                      <Download className="h-4 w-4" />
                      {loading ? "Preparing PDF..." : "Download List"}
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
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center border border-gray-200 dark:border-gray-700">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="p-4 bg-red-50 dark:bg-gray-700 rounded-full">
                  <Frown className="h-12 w-12 text-red-500 dark:text-red-400" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                  {isSearching
                    ? "Searching for donors..."
                    : "No donors found matching your criteria"}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                  {isSearching
                    ? "Please wait while we search our database"
                    : "Try adjusting your search filters or check back later. You can also consider expanding your search area."}
                </p>
                {!isSearching && (
                  <button
                    onClick={() => setShowFilters(true)}
                    className="mt-4 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-500 font-medium flex items-center gap-1"
                  >
                    <Filter className="h-4 w-4" />
                    Adjust search filters
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
