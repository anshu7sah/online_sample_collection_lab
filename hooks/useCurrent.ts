import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export const useCurrent = () => {
  return useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const { data } = await api.get("/auth/current");
      return data.user; // null if not logged in
    },
    staleTime: 0,            // never treat as fresh
           // clear cache immediately when unused
    refetchOnMount: "always", // always refetch on mount
    refetchOnWindowFocus: false,
  });
};