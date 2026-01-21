import { useMutation, UseMutationResult } from "@tanstack/react-query";
import api from "@/lib/axios";


export const useCreateBooking = () => {
  return useMutation({
    mutationFn: async (formData: FormData) => {
        console.log("Creating booking with payload:", formData);
      const res = await api.post("/bookings", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    },
  });
};
