import { useState, useCallback } from 'react';
import * as Location from 'expo-location';

type GPSResult = {
  location: { latitude: number; longitude: number } | null;
  address: string;
  loading: boolean;
  error: string | null;
  fetchLocation: () => Promise<void>;
};

/**
 * Hook that fetches the user's GPS location with high accuracy
 * and reverse-geocodes it into a readable address string.
 */
export function useGPSLocation(): GPSResult {
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLocation = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Request permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Location permission denied');
        setLoading(false);
        return;
      }

      // 2. Get position with high accuracy
      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const coords = {
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      };
      setLocation(coords);

      // 3. Reverse geocode → readable address
      const results = await Location.reverseGeocodeAsync(coords);

      if (results && results.length > 0) {
        const r = results[0];
        // Build a readable address from available parts
        const parts = [
          r.name,
          r.street,
          r.district,
          r.city,
          r.subregion,
          r.region,
          r.postalCode,
          r.country,
        ].filter(Boolean);

        // Remove duplicate consecutive parts (e.g. name === street)
        const unique = parts.filter(
          (part, i, arr) => i === 0 || part !== arr[i - 1],
        );

        setAddress(unique.join(', '));
      } else {
        setAddress(
          `${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)}`,
        );
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch location');
    } finally {
      setLoading(false);
    }
  }, []);

  return { location, address, loading, error, fetchLocation };
}
