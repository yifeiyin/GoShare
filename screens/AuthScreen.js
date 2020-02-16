import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, Alert, KeyboardAvoidingView, AsyncStorage } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { FontAwesome5 } from '@expo/vector-icons';
import Firebase from '../firebase'
import { CurrentUser } from '../helper'

export default class AuthScreen extends React.Component {
  static navigationOptions = {
    headerShown: false
  };

  state = {
    username: "",
    loading: true,
  }

  async componentDidMount() {
    let username = await AsyncStorage.getItem('username');
    if (username == undefined) {
      this.setState({ loading: false });
    } else {
      CurrentUser.set(username);
      this.setState({ loading: false });
      this.props.navigation.navigate('MapScreen');
    }
  }

  next = async () => {
    if (this.state.username != '') {
      Firebase.addUser(this.state.username);
      CurrentUser.set(this.state.username);
      await AsyncStorage.setItem('username', this.state.username);
      this.setState({ username: null }, () => {
        this.props.navigation.navigate('MapScreen');
      });
    } else {
      Alert.alert("Warning", "Username is empty");
    }
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <KeyboardAvoidingView style={styles.container} behavior='padding'>
          <View><Text style={styles.headerText}>What's Your Name?</Text></View>
          <TextInput
            style={styles.input}
            placeholder="Create a name"
            onChangeText={username => {
              this.setState({ username });
            }}
            maxLength={30}
            value={this.state.username}
          />
          <View style={styles.next}>
            <TouchableOpacity
              style={styles.nextButton}
              onPress={this.next}>
              <FontAwesome5 name='arrow-right' color='#fff' size={30} />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerText: {
    fontSize: 30,
    fontWeight: '800',
    color: '#514E5A',
  },
  input: {
    marginTop: 30,
    height: 50,
    width: 300,
    borderWidth: 2,
    borderColor: '#BAB7C3',
    borderRadius: 30,
    paddingHorizontal: 16,
    color: '#514E5A',
    fontWeight: '600',
  },
  next: {
    alignItems: 'center',
    marginTop: 50,
  },
  nextButton: {
    width: 70,
    height: 70,
    borderRadius: 70 / 2,
    backgroundColor: '#9075E3',
    alignItems: 'center',
    justifyContent: 'center'
  }
});