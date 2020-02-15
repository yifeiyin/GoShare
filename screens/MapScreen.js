import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView } from 'react-native';

// DOCUMENTATION: https://github.com/react-native-community/react-native-maps#component-api
import MapView, { Marker } from 'react-native-maps';

// DOCUMENTATION: https://radar.io/documentation/sdk#react-native
// import Radar from 'react-native-radar';

import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';


export default class MapScreen extends React.Component {

  componentDidMount() {
    this._getLocationAsync();
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      alert('Permission to access location was denied');
    }

    let location = await Location.getCurrentPositionAsync({});
    this.setState({ markers: [...this.state.markers, locationToMarker(location, 'blue') ] });
  }

  state = {
    markers: [
      {
        coords: {
          latitude: 43.78767,
          longitude: -79.19111,
        }, title: 'Test', description: 'desdsgfdg rgrg'
      }
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
                key={marker.title}
                coordinate={marker.coords}
                title={marker.title}
                description={marker.description}
                pinColor={marker.color}
              />
            ))
          }
        </MapView>
      </SafeAreaView>
    );
  }
}

function locationToMarker(location, color) {
  return {
    coords: location.coords,
    title: 'Your Location',
    color: color || 'red',
  };
}