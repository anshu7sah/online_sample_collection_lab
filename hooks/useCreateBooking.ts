import { useMutation, UseMutationResult } from "@tanstack/react-query";
import api from "@/lib/axios";


export const useCreateBooking = () => {
  return useMutation({
    mutationFn: async (formData: FormData) => {
      try {
        const res = await api.post("/bookings", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        return res.data;
      } catch (error: any) {
        console.error("[useCreateBooking] API Error:", error.response?.data || error.message);
        throw error;
      }
    },
  });
};
