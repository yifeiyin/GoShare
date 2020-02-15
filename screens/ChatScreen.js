import React from 'react';
import { Platform, KeyboardAvoidngView, SafeAreaView } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import Firebase from '../firebase';

export default class ChatScreen extends React.Component {
  
  state = {
    message: []
  }

  get user() {
    return {
      _id: Firebase.uid,
      name: 'a'
    }
  }

  componentDidMount() {
    Firebase.get(message => 
        this.setState(previous => ({
          message: GiftedChat.append(previous.message, message)
        })));
  }

  componentWillMount() {
    Firebase.off();
  }
  
  render() {
    const chat = <GiftedChat messages={this.state.message} onSend={Firebase.send} user={this.user}/>;

    if (Platform.OS === 'android') {
      return (
        <KeyboardAvoidngView style={{flex: 1}} behavior='padding' keyboardVerticalOffset={30} enable>
          {chat}
        </KeyboardAvoidngView>
      );
    }
    
    return (
        <SafeAreaView style={{flex: 1}}>
          {chat}
        </SafeAreaView>
    );
  }
}