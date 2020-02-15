import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView } from 'react-native';

// DOCUMENTATION: https://github.com/react-native-community/react-native-maps#component-api
import MapView, { Marker } from 'react-native-maps';


export default class MapScreen extends React.Component {
  state = {
    markers: [
      { coordinate: {
        latitude: 43.78767,
        longitude: -79.19111,
      }, title: 'Test',description:'desdsgfdg rgrg' }
    ]
  }

  render() {
    return (
      <SafeAreaView>
        <Text>MapScreen</Text>
        <MapView style={{ width: '100%', height: '90%', backgroundColor: '#ddd' }}
          initialRegion={{
            latitude: 43.785,
            longitude: -79.188,
            latitudeDelta: 0.005,
            longitudeDelta: 0.015,
          }}>
          {
            this.state.markers.map(marker => (
              <Marker
                coordinate={marker.coordinate}
                title={marker.title}
                description={marker.description}
              />
            ))
          }
        </MapView>
      </SafeAreaView>
    );
  }
}