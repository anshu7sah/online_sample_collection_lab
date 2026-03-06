import React, { Component, ErrorInfo } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import RNMapView, { Marker as RNMarker, MapViewProps } from 'react-native-maps';

// Error boundary to prevent app crash if MapView fails (e.g., missing Google Maps API key)
class MapErrorBoundary extends Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn('MapView crashed:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.fallback}>
          <Text style={styles.fallbackTitle}>Map Unavailable</Text>
          <Text style={styles.fallbackText}>
            Could not load map. Please ensure Google Maps is configured
            correctly.
          </Text>
        </View>
      );
    }
    return this.props.children;
  }
}

// Wrapped MapView with error boundary
const MapView = React.forwardRef<RNMapView, MapViewProps>((props, ref) => {
  return (
    <MapErrorBoundary>
      <RNMapView ref={ref} {...props} />
    </MapErrorBoundary>
  );
});

MapView.displayName = 'MapView';

export { RNMarker as Marker };
export default MapView;

const styles = StyleSheet.create({
  fallback: {
    height: 280,
    borderRadius: 16,
    backgroundColor: '#E8EDF2',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  fallbackTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#555',
    marginBottom: 8,
  },
  fallbackText: {
    fontSize: 13,
    color: '#888',
    textAlign: 'center',
  },
});
