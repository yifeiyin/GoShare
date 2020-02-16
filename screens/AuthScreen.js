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
    username: '',
    users: [],
    loading: true,
  }

  async componentDidMount() {
    // this.firebaseItemsLister = Firebase.onUsersChange((data) => {
    //   data = data.val();
    //   let users = [];
    //   for (let key in data) {
    //     users.push(key);
    //   }
    //   this.setState({ users });
    // });

    let username = await AsyncStorage.getItem('username');
    if (username == undefined) {
      this.setState({ loading: false });
    } else {
      CurrentUser.set(username);
      this.setState({ loading: false });
      this.props.navigation.navigate('MapScreen');
    }
  }

  componentWillUnmount() {
    Firebase.off(this.firebaseItemsLister);
  }

  next = async () => {
    let username = this.state.username.trim();
    if (username != '') {
      Firebase.addUser(username);
      CurrentUser.set(username);
      await AsyncStorage.setItem('username', username);
      this.setState({ username: null }, () => {
        this.props.navigation.navigate('MapScreen');
      });
    } else {
      Alert.alert("Error", "Username cannot empty");
    }
  }

  // next = () => {
  //   if (this.state.username == '') {
  //     Alert.alert("Warning", "Username is empty",)
  //   } else if (findUser(this.state.users, this.state.username) == ''){
  //     Firebase.addUser(this.state.username)
  //     Alert.alert("Warning", "Your account has been created",)
  //     CurrentUser.set(this.state.username)
  //     this.props.navigation.navigate("MapScreen",{username: this.state.username})
  //   } else {
  //     Alert.alert("Warning",
  //                 "Sign in as " + this.state.username,)
  //     CurrentUser.set(this.state.username)
  //     this.props.navigation.navigate("MapScreen",{username: this.state.username})
  //   }
  // }

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

function findUser(users, username) {
  for (let item of users) {
    if (item == username) {
      return item
    }
  }
  return ''
};

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