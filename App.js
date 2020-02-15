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

const tabNavigator = createBottomTabNavigator({
  AuthScreen,
  MapScreen,
  RequestScreen,
  ChatListScreen,
  ChatScreen,
}, {
  initialRouteName: 'AuthScreen'
});

const App = createAppContainer(tabNavigator);

export default App;
