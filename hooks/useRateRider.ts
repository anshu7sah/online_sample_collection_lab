import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';

interface RateRiderPayload {
  bookingId: number;
  rating: number;
  comment?: string;
}

export const useRateRider = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ bookingId, rating, comment }: RateRiderPayload) => {
      const res = await api.post(`/my/${bookingId}/rating`, {
        rating,
        comment,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-bookings'] });
    },
  });
};
