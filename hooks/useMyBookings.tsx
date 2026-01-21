import api from "@/lib/axios";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

export interface BookingItem {
  id: number;
  type: "test" | "package";
  name: string;
  price: number;
  testId?: number | null;
  packageId?: number | null;
}

export interface Booking {
  id: number;
  name: string;
  date: string;
  timeSlot: string;
  status: string;
  paymentMode: string | null;
  paymentStatus: string;
  createdAt: string;
  items: BookingItem[];
}

export interface BookingListResponse {
  data: Booking[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

interface Params {
  page: number;
  limit: number;
  status?: string;
}

export const useMyBookings = ({ page, limit, status }: Params) => {
  return useQuery<BookingListResponse>({
    queryKey: ["my-bookings", page, limit, status],
    queryFn: async () => {
      const params = new URLSearchParams();

      params.append("page", String(page));
      params.append("limit", String(limit));

      if (status) {
        params.append("status", status);
      }

      const res = await api.get(`/bookings/my?${params.toString()}`);
      return res.data;
    },

    // ✅ v5 replacement for keepPreviousData
    placeholderData: keepPreviousData,

    staleTime: 0,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
