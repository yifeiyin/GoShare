import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import MapView from 'react-native-maps';

export default class MapScreen extends React.Component {
  render() {
    return (
      <SafeAreaView>
        <Text>MapScreen</Text>
        <MapView style={{ width:'100%', height: '90%', backgroundColor:'#ddd'}}
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      </SafeAreaView>
    );
  }
}