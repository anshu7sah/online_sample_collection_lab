import api from "@/lib/axios";
import { Package, Test } from "@/types";
import { useQuery } from "@tanstack/react-query";


export const useSingleTest = (id: number) =>
  useQuery({
    queryKey: ["tests", id],
    queryFn: async (): Promise<Test > => {
      const res = await api.get(`/tests/${id}`);
      return res.data;
    },
  });
