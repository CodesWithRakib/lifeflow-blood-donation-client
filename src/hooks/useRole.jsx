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
      const { data } = await axiosSecure.get("/user");
      return data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });

  const isAdmin = user?.role === "admin";
  const isVolunteer = user?.role === "volunteer";
  const isDonor = user?.role === "donor";
  const isActive = user?.status === "active";
  const isBlocked = user?.status === "blocked";

  return {
    user,
    isAdmin,
    isVolunteer,
    isDonor,
    isActive,
    isBlocked,
    isLoading,
    error,
  };
};

export default useRole;
