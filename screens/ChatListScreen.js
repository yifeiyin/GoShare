import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, FlatList } from 'react-native';
import Firebase from '../firebase';
import { CurrentUser } from '../helper';

export default class ChatListScreen extends React.Component {
  static navigationOptions = {
    headerTitle: 'Messages'
  }

  state = {
    chats: []
  };

  startChat = (item) => {
    this.props.navigation.navigate("ChatScreen", { to: item.to });
  }

  componentDidMount() {
    this.firebaseItemsLister = Firebase.onMessagesChange((data) => {
      data = data.val();
      let chats = []
      Object.values(data).sort((a, b) => a.timestamp - b.timestamp).forEach(item => {
        if ((item.to == CurrentUser.get()) && (check(chats, item.user.name)) && (item.user.name != CurrentUser.get())) {
          chats.push({ to: item.user.name, message: item.text });
        } else if ((item.user.name == CurrentUser.get()) && (check(chats, item.to)) && (item.to != CurrentUser.get())) {
          chats.push({ to: item.to, message: item.text })
        }
      });
      this.setState({ chats: chats });
    });
  }

  componentWillUnmount() {
    Firebase.off(this.firebaseItemsLister);
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.listView}>
          <FlatList
            keyExtractor={(item) => item.to}
            style={styles.list}
            data={this.state.chats}
            renderItem={({ item }) =>
              <TouchableOpacity style={styles.conversation}
                onPress={() => this.startChat(item)}>
                <Text style={styles.conversationText}>
                  {item.to}
                </Text>
                <Text style={styles.messageText} numberOfLines={1} ellipsizeMode='tail'>
                  {item.message}
                </Text>
              </TouchableOpacity>
            }
          />
        </View>
      </SafeAreaView>
    );
  }
}

function check(chats, name) {
  for (let chat of chats) {
    if (chat.to == name) {
      return false
    }
  }
  return true
}

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
  list: {

  },
  conversation: {
    backgroundColor: "#eee",
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  conversationText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#514E5A',
  },
  messageText: {
    marginTop: 10,
    fontSize: 15,
    fontWeight: '400',
    color: '#514E5A',
  }
});