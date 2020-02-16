import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';

import { createAppContainer } from 'react-navigation';

import AuthScreen from './screens/AuthScreen';
import MapScreen from './screens/MapScreen';
import RequestScreen from './screens/RequestScreen';
import ChatListScreen from './screens/ChatListScreen';
import ChatScreen from './screens/ChatScreen';
import TransferScreen from './screens/TransferScreen';

const tabNavigator = createStackNavigator({
  AuthScreen,
  MapScreen,
  RequestScreen,
  ChatListScreen,
  ChatScreen,
  TransferScreen,
}, {
  initialRouteName: 'AuthScreen',
  defaultNavigationOptions: {
    headerTintColor: '#514E5A',
    headerTitleStyle: {
      fontWeight: '700',
    }
  },
});

const App = createAppContainer(tabNavigator);

export default App;
