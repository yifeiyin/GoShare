import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, AsyncStorage } from 'react-native';

// DOCUMENTATION: https://github.com/react-native-community/react-native-maps#component-api
import MapView, { Marker } from 'react-native-maps';

// DOCUMENTATION: https://radar.io/documentation/sdk#react-native
// import Radar from 'react-native-radar';

import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

import Firebase from '../firebase';
import { CurrentUser } from '../helper';
import { FontAwesome5 } from '@expo/vector-icons';

export default class MapScreen extends React.Component {
  static navigationOptions = {
    headerShown: false,
    headerTitle: 'Map',
  };

  componentDidMount() {
    this.firebaseItemsLister = Firebase.onItemsChange((data) => {
      data = data.val();
      // console.log(data);
      let markers = [];
      for (let key in data) {
        let item = data[key];
        markers.push({ coords: item.coords, title: key, description: item.username });
      }
      this.setState({ markers });
      this.currentItemsHolding = Object.entries(data).filter(([itemName, item]) => item.username == CurrentUser.get()).map(([itemName, item]) => itemName);
    });


    this.recordLocationTimeOut = this.startRecordingLocation();
  }

  componentWillUnmount() {
    Firebase.off(this.firebaseItemsLister);
    clearInterval(this.recordLocationTimeOut);
  }

  currentItemsHolding = [
    // 'Calculator_1',
    // 'USB-C_1'
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
    }, 2000);
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
      <View style={{ flex: 1 }}>
        <View style={styles.signOutButton}>
          <TouchableOpacity onPress={() => { AsyncStorage.removeItem('username'); this.props.navigation.goBack() }}>
            <FontAwesome5 name='sign-out-alt' color='#514E5A' size={25} />
          </TouchableOpacity>
        </View>
        <View style={styles.messagesButton}>
          <TouchableOpacity onPress={() => { this.props.navigation.navigate('ChatListScreen'); }}>
            <Text style={{ color: '#D81B60', fontWeight: '800', fontSize: 16 }}>Messages</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.requestButton}>
          <TouchableOpacity onPress={() => { this.props.navigation.navigate('RequestScreen'); }}>
            <Text style={{ color: '#fff', fontWeight: '800', fontSize: 16 }}>Request</Text>
          </TouchableOpacity>
        </View>
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

const COMMON_STYLES = {
  position: 'absolute',
  zIndex: 100,
  alignItems: 'center',
  justifyContent: 'center',
  shadowColor: 'black',
  shadowRadius: 10,
  shadowOffset: { width: 5 },
  shadowOpacity: 0.1,
};

const height = 50;
const width = 110;

const styles = StyleSheet.create({
  signOutButton: {
    ...COMMON_STYLES,
    left: 0,
    top: 0,
    backgroundColor: 'white',
    width: 50,
    height: 50,
    borderRadius: 25,
    marginLeft: 10,
    marginTop: 50,

    color: '#444',

    transform: [{ rotateY: '180deg' }],
  },
  messagesButton: {
    ...COMMON_STYLES,
    right: 15,
    bottom: 30,
    backgroundColor: '#eee',
    color: 'white',
    height: height,
    width: width,
    borderRadius: height / 2,
    borderWidth: 3,
    borderColor: '#D81B60'
  },
  requestButton: {
    ...COMMON_STYLES,
    right: 15,
    bottom: height * 1.2 + 30,
    backgroundColor: '#D81B60',
    color: 'white',
    height: height,
    width: width,
    borderRadius: height / 2,
  }
});