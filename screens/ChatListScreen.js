import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, FlatList } from 'react-native';
import Firebase from '../firebase';
import { CurrentUser } from '../helper';
import { NavigationEvents } from 'react-navigation';

// class MessageStorage {
//   chats = [];
//   indicator = [];
// }

// const MS = new MessageStorage();

export default class ChatListScreen extends React.Component {
  static navigationOptions = {
    headerTitle: 'Messages'
  }

  state = {
    chats: [],
  };

  startChat = (item) => {
    // MS.chats = this.state.chats;
    // MS.indicator[item.to] = false;
    // console.log(MS.indicator)
    // Firebase.updateMessageFlag(item.key, 'read')
    this.props.navigation.navigate("ChatScreen", { to: item.to });
  }

  componentDidMount() {
    this.firebaseItemsLister = Firebase.onMessagesChange((data) => {
      data = data.val();
      let chats = []
      Object.values(data || {}).sort((a, b) => b.timestamp - a.timestamp).forEach(item => {
        if ((item.to == CurrentUser.get()) && (check(chats, item.user.name)) && (item.user.name != CurrentUser.get())) {
          chats.push({ to: item.user.name, message: item.text, flag: item.flag, key: item.key });
        } else if ((item.user.name == CurrentUser.get()) && (check(chats, item.to)) && (item.to != CurrentUser.get())) {
          chats.push({ to: item.to, message: item.text, flag: item.flag, key: item.key })
        }
      });
      this.setState({ chats });
      // console.log(chats)
      // MS.indicator = compare(MS.chats, this.state.chats);
      // console.log(MS.indicator);
    });
  }

  componentWillUnmount() {
    Firebase.off(this.firebaseItemsLister);
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        {/* <NavigationEvents
          onWillFocus={() => {
            this.forceUpdate();
            MS.indicator = compare(MS.chats, this.state.chats);
            // this.forceUpdate();
          }}
        /> */}
        <View style={styles.listView}>
          <FlatList
            keyExtractor={(item) => item.to}
            style={styles.list}
            data={this.state.chats}
            renderItem={({ item }) =>
              <TouchableOpacity style={styles.conversation}
                onPress={() => this.startChat(item)}>
                <Text style={styles.conversationText}>
                  {/* style={item.flag == 'unread'
                    ? styles.conversationTextUnread
                    : styles.conversationText} */}
                  {item.to}
                </Text>
                <Text style={styles.messageText}
                  // style={item.flag.startWith('unread')
                  //   ? styles.messageTextUnread
                  //   : styles.messageText}
                  umberOfLines={1}
                  ellipsizeMode='tail'>
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

// function compare(previous, current) {
//   console.log(previous)
//   console.log(current)
//   let indicator = {}
//   for (let each of current) {
//     for (let element of previous) {
//       if (each.to == element.to && each.message == element.message) {
//         indicator[each.to] = false;
//       }
//     }
//     indicator[each.to] = true;
//   }
//   return indicator
// }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'column',
    alignItems: 'center',
  },
  chatView: {
    flex: 1,
  },
  chatText: {
    fontSize: 30,
    fontWeight: '800',
    color: '#514E5A',
  },
  listView: {
    width: '100%'
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
  conversationTextUnread: {
    fontSize: 20,
    fontWeight: '800',
    color: '#D81B60',
  },
  messageText: {
    marginTop: 10,
    fontSize: 15,
    fontWeight: '400',
    color: '#514E5A',
  },
  messageTextUnread: {
    marginTop: 10,
    fontSize: 15,
    fontWeight: '400',
    color: '#D81B60',
  }
});