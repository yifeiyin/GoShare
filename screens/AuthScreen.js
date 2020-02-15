import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { FontAwesome5 } from '@expo/vector-icons';
import Firebase from '../firebase'

export default class AuthScreen extends React.Component {
  
  state = {
    username: "",
  }

  next = () => {
    if (this.state.username != '') {
      Firebase.writeUserData(this.state.username)
      this.props.navigation.navigate("MapScreen",{username: this.state.username})
    } else {
      Alert.alert("Warning",
                  "Username is empty",)
    }
  }

  render() {
    return (
        <SafeAreaView style={styles.container}>
          
          <View>
            <Text style={styles.headerText}>UserName</Text>
            <TextInput
                  style={styles.input}
                  placeholder="Create a name"
                  onChangeText={username => {
                    this.setState({username});
                  }}
                  maxLength={30}
                  value={this.state.username}
            />
            <View style={styles.next}>
                  <TouchableOpacity 
                        style={styles.nextButton}
                        onPress={this.next}>
                    <FontAwesome5 name='search' color='#fff' size={30} />
                  </TouchableOpacity>
            </View>
          </View>

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
    marginTop: 60,
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