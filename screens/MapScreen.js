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
        markers.push({ coords: item.coords, title: key, description: item.username });
      }
      this.setState({ markers });
    });

    this.recordLocationTimeOut = this.startRecordingLocation();
  }

  componentWillUnmount() {
    Firebase.off(this.firebaseItemsLister);
    clearInterval(this.recordLocationTimeOut);
  }

  currentItemsHolding = [
    'Lightning_11',
    'Power-bank_2'
  ];

  startRecordingLocation = () => {
    let a = () => {
      this.getUserLocation().then(location => {
        this.currentItemsHolding.forEach(item => {
          Firebase.updateItem(item, location.coords, CurrentUser.get() || 'Test User');
        });
      }).catch(error => {
        console.warn(error);
      })
    }
    a();
    return setInterval(() => {
      a();
    }, 5000);
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
          }}
        >
          {
            this.state.markers.map(marker =>
              <Marker
                key={marker.title}
                coordinate={marker.coords}
                title={marker.title}
                description={marker.description}
                pinColor={marker.color}
                image={imageByName(marker.title)}
                zIndex={-1}
                opacity={0.8}
              />
            )
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

function imageByName(name) {
  if (name.toLowerCase().startsWith('lightning')) { return require('../assets/lightning.png'); }
  if (name.toLowerCase().startsWith('usb')) { return require('../assets/usb.png'); }
  if (name.toLowerCase().startsWith('calculator')) { return require('../assets/calculator.png'); }
  if (name.toLowerCase().startsWith('power')) { return require('../assets/power.png'); }
}