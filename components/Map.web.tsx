import React from 'react';
import { View, Text } from 'react-native';

const MapView = (props: any) => (
  <View
    style={[
      props.style,
      {
        backgroundColor: '#e2e8f0',
        justifyContent: 'center',
        alignItems: 'center',
      },
    ]}
  >
    <Text style={{ color: '#64748b' }}>Map not available on Web</Text>
  </View>
);

export const Marker = () => null;
export default MapView;
