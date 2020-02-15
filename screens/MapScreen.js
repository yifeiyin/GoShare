import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView } from 'react-native';

// DOCUMENTATION: https://github.com/react-native-community/react-native-maps#component-api
import MapView, { Marker } from 'react-native-maps';

// DOCUMENTATION: https://radar.io/documentation/sdk#react-native
// import Radar from 'react-native-radar';

import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

import Firebase from '../firebase';
import { CurrentUser } from '../helper';

export default class MapScreen extends React.Component {

  componentDidMount() {
    this.firebaseItemsLister = Firebase.onItemsChange((data) => {
      data = data.val();
      console.log(data);
      let markers = [];
      for (let key in data) {
        let item = data[key];
        markers.push({ coords: item.coords, title: item.username, description: key });
      }
      this.setState({ markers });
    });
  }

  componentWillUnmount() {
    Firebase.off(this.firebaseItemsLister);
  }

  currentItemsHolding = [
    'Lightning_10'
  ];

  startRecordingLocation = async () => {
    const location = await this.getUserLocation();

    this.currentItemsHolding.forEach(item => {
      Firebase.updateItem(item, location.coords, CurrentUser.get() || 'Test User');
    });
  };

  getUserLocation = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      alert('Permission to access location was denied');
    }

    return await Location.getCurrentPositionAsync({});
  };


  // this.setState({ markers: [...this.state.markers, locationToMarker(location, 'blue') ] });

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
      <View>
        <MapView
        showsUserLocation={true}
        style={{ width: '100%', height: '100%', backgroundColor: '#ddd' }}
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
      </View>
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