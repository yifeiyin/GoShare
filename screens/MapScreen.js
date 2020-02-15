import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView } from 'react-native';

// DOCUMENTATION: https://github.com/react-native-community/react-native-maps#component-api
import MapView, { Marker } from 'react-native-maps';

// DOCUMENTATION: https://radar.io/documentation/sdk#react-native
import Radar from 'react-native-radar';


export default class MapScreen extends React.Component {

  componentDidMount() {
    Radar.setUserId(this.state.userId);
    Radar.requestPermissions(true);

    // track the user's location once in the foreground
    Radar.trackOnce().then((result) => {
      // do something with result.events, result.user.geofences
    }).catch((err) => {
      // optionally, do something with err
    });

    // start tracking the user's location in the background
    Radar.startTracking();
  }

  state = {
    markers: [
      {
        coordinate: {
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

// receive events
Radar.on('events', (result) => {
  // do something with result.events, result.user
  console.log(result);

});

// receive location updates
Radar.on('location', (result) => {
  // do something with result.location, result.user
  console.log(result);
});

// receive errors
Radar.on('error', (err) => {
  // do something with err
  console.log(result);

});
