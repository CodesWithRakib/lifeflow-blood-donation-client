import { useQuery } from "@tanstack/react-query";
import useAxios from "./useAxios";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";

export const useUser = () => {
  const axiosSecure = useAxios();
  const navigate = useNavigate();

  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      try {
        const res = await axiosSecure.get("/api/user");

        if (!res.data) {
          throw new Error("User data not found");
        }

        return res.data;
      } catch (error) {
        if (error.response?.status === 401) {
          // Redirect to login if unauthorized
          navigate("/login");
          toast.error("Session expired. Please log in again.");
        }
        throw error; // Re-throw to be handled by React Query
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1, // Only retry once on failure
    retryDelay: 1000, // Wait 1 second between retries
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    onError: (error) => {
      if (error.response?.status !== 401) {
        toast.error("Failed to load user data");
      }
    },
  });
};
