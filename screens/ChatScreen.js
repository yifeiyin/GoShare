import React from 'react';
import { KeyboardAvoidingView, SafeAreaView, View, Text, Button } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import Firebase from '../firebase';
import { CurrentUser } from '../helper';

export default class ChatScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: navigation.getParam('to', 'Chat'),
    headerRight: () => (
      <Button
        title='Transfer'
        onPress={() => {
          navigation.navigate('TransferScreen', { toUsername: navigation.getParam('to') })
        }}
      />
    )
  });

  state = {
    messages: []
  }

  get user() {
    return {
      _id: CurrentUser.get(),
      name: CurrentUser.get(),
    }
  }

  componentDidMount() {
    // Firebase.get(message =>
    //   this.setState(previous => ({
    //     message: GiftedChat.append(previous.message, message)
    //   })
    // ));

    // this.firebaseItemsLister = Firebase.onMessagesChange((data) => {
    //   data = data.val();
    //   this.setState(prevState => {
    //     let messages = prevState.messages;
    //     for (let key in data) {
    //       let item = data[key];
    //       if (messages.filter(v => v.timestamp == item.timestamp).length != 0) continue;
    //       messages.unshift({ key, to: item.to, text: item.text, timestamp: item.timestamp, user: item.user });
    //     }
    //     return { messages };
    //   });
    // });

    this.firebaseItemsLister = Firebase.onMessagesChange((data) => {
      data = data.val();
      console.log('Rec msg updates');
      console.log(data);
      let messages = [];
      for (let key in data) {
        let item = data[key];
        if (item.to == this.props.navigation.getParam('to') && item.user.name == CurrentUser.get()
          || item.to == CurrentUser.get() && item.user.name == this.props.navigation.getParam('to')) {
          messages.unshift({ key, to: item.to, text: item.text, timestamp: item.timestamp, user: item.user });
        }
      }
      this.setState({ messages });
    });
  }

  componentWillUnmount() {
    Firebase.off(this.firebaseItemsLister);
  }

  render() {
    const toUserId = this.props.navigation.getParam('to');
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <GiftedChat
          messages={this.state.messages}
          onSend={(messages) => Firebase.send(messages, toUserId)}
          user={this.user}
          isKeyboardInternallyHandled={false}
        />
        <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={85} enable />
      </SafeAreaView>
    );
  }
}