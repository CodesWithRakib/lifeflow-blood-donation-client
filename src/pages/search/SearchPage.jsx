import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Droplet, Search, Frown } from "lucide-react";
import DonorCard from "../../components/search/DonorCard";
import useAxios from "../../hooks/useAxios";

const SearchPage = () => {
  const axiosSecure = useAxios();
  const { register, handleSubmit, watch, setValue } = useForm();
  const [donors, setDonors] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  const [selectedDistrictId, setSelectedDistrictId] = useState(null);

  // Fetch location data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [districtRes, upazilaRes] = await Promise.all([
          axios("/districts.json"),
          axios("/upazilas.json"),
        ]);
        setDistricts(districtRes?.data);
        setUpazilas(upazilaRes?.data);
      } catch (err) {
        console.error("Failed to load location data", err);
      }
    };

    fetchData();
  }, []);

  // Filter upazilas based on selected district
  const filteredUpazilas = selectedDistrictId
    ? upazilas.filter((u) => u.district_id === selectedDistrictId)
    : [];

  // Handle search submission
  const onSubmit = async (data) => {
    try {
      setIsSearching(true);
      const response = await axiosSecure.get("/api/donors/search", {
        params: {
          bloodGroup: data.bloodGroup,
          district: data.district,
          upazila: data.upazila,
        },
      });
      setDonors(response.data || []);
    } catch (error) {
      console.error("Search failed:", error);
      setDonors([]);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Search Form */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Droplet className="text-red-500" />
            <span>Find Blood Donors</span>
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Blood Group */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Blood Group
                </label>
                <select
                  {...register("bloodGroup", { required: true })}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select Blood Group</option>
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                    (group) => (
                      <option key={group} value={group}>
                        {group}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* District */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  District
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
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Upazila
                </label>
                <select
                  {...register("upazila")}
                  disabled={!selectedDistrictId}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
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

            <button
              type="submit"
              disabled={isSearching}
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 px-6 rounded-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
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
          </form>
        </div>

        {/* Results Section */}
        <div>
          {donors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {donors.map((donor) => (
                <DonorCard key={donor._id} donor={donor} />
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center">
              <div className="flex flex-col items-center justify-center space-y-4">
                <Frown className="h-12 w-12 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {isSearching
                    ? "Searching for donors..."
                    : "No donors found matching your criteria"}
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {isSearching
                    ? "Please wait while we search our database"
                    : "Try adjusting your search filters or check back later"}
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
