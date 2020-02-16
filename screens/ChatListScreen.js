import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, FlatList } from 'react-native';
import Firebase from '../firebase';
import { CurrentUser } from '../helper';

export default class ChatListScreen extends React.Component {

  chat = '';

  state = {
    users: [],
    chats: []
  };

  startChat = (item) => {
    this.props.navigation.navigate("ChatScreen", { to: item });
  }

  componentDidMount() {
    this.firebaseItemsLister = Firebase.onMessagesChange((data) => {
      data = data.val();
      let chat = '';
      for (let key in data) {
        let item = data[key];
        if (item.to == CurrentUser.get() && (!chat.includes(item.user.name)) && item.user.name != CurrentUser.get()) {
          chat = (chat || '') + item.user.name
        }
      }
      this.chat = chat;
    });

    this.firebaseItemsLister = Firebase.onUsersChange((data) => {
      data = data.val();
      let users = [];
      for (let key in data) {
        let item = data[key];
        users.push({ username: key, chats: item.chat });
      }
      this.setState({ users });
    });
  }

  componentWillUnmount() {
    Firebase.off(this.firebaseItemsLister);
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>

        <View style={styles.chatView}>
          <Text style={styles.chatText}>
            Chats
          </Text>
        </View>

        <View style={styles.listView}>
          <FlatList
            keyExtractor={(item) => item}
            style={styles.list}
            data={findChats(this.chat, this.state.users)}
            renderItem={({ item }) =>
              <TouchableOpacity style={styles.conversation}
                onPress={() => this.startChat(item)}>
                <Text style={styles.conversationText}>
                  {item}
                </Text>
              </TouchableOpacity>
            }
          />
        </View>
      </SafeAreaView>
    );
  }
}

function findChats(chat, users) {
  for (let item of users) {
    if (item.username == CurrentUser.get()) {
      item.chat = chat
    }
  }
  console.log(chat)
  let out = chat.split(',')
  console.log(out)
  return out.filter(v => v !== '');
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  chatView: {
    flex: 1
  },
  chatText: {
    fontSize: 30,
    fontWeight: '800',
    color: '#514E5A',
  },
  listView: {
    flex: 11
  },
  conversation: {
    height: 50,
    width: 370,
    backgroundColor: "#eee",
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  conversationText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#514E5A',
  },
});