import { useQuery } from "@tanstack/react-query";
import useAxios from "./useAxios";

export const useUser = () => {
  const axiosSecure = useAxios();

  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await axiosSecure.get("/api/user");
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};
