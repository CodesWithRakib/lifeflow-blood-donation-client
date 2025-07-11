import { useQuery } from "@tanstack/react-query";
import useAxios from "./useAxios";

const useRole = () => {
  const axiosSecure = useAxios();

  const {
    data: user = {},
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user-role"],
    queryFn: async () => {
      const { data } = await axiosSecure.get("/api/user");
      return data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });

  const isAdmin = user?.role === "admin";
  const isVolunteer = user?.role === "volunteer";
  const isDonor = user?.role === "donor";
  const isActive = user?.status === "active";

  return { user, isAdmin, isVolunteer, isDonor, isActive, isLoading, error };
};

export default useRole;
