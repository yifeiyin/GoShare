import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, FlatList } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import Firebase from '../firebase';
import { confirm, CurrentUser } from '../helper';

export default class TransferScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: navigation.getParam('toUsername', 'Transfer') + '\'s items',
  });

  state = {
    items: ['Item 1', 'Item 2'],
  };

  componentDidMount() {
    this.toUsername = this.props.navigation.getParam('toUsername', 'Transfer');

    this.firebaseItemsLister = Firebase.onItemsChange((data) => {
      data = data.val();
      console.log(data);
      let items = Object.entries(data || {}).filter(([key, value]) => value.username == this.toUsername).map(([key, value]) => (key));
      console.log(items);
      this.setState({ items });
    });
  }

  componentWillUnmount() {
    Firebase.off(this.firebaseItemsLister);
  }

  handleTransfer = (item) => {
    confirm('Transfer ' + item + ' from ' + this.toUsername + '?', 'You will be responsible for this item.', 'Yes').then(confirmed => {
      if (confirmed) {
        Firebase.updateItemOwnership(item, CurrentUser.get());
        Firebase.send([{ text: 'I have received ' + item + ' from you.' }], this.toUsername);
        this.props.navigation.goBack();
      }
    });
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <FlatList
          data={this.state.items}
          keyExtractor={(item) => item}
          ListEmptyComponent={() => <View style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: 40 }}><Text style={{ color: '#514E5A', fontWeight: '600', fontSize: 18 }}>{this.toUsername + ' has no items.'}</Text></View>}
          renderItem={({ item }) => <TransferItem toUsername={this.toUsername} item={item} handleTransfer={this.handleTransfer} />}
          ItemSeparatorComponent={() => <View style={{ height: 1, width: '100%', backgroundColor: '#ccc' }} />}
        />
      </SafeAreaView>
    );
  }
}

function TransferItem(props) {
  const { item } = props;
  const isSameUser = props.toUsername == CurrentUser.get();
  return (
    <View
      style={{
        backgroundColor: 'white',
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center'
      }}
    >
      <Text style={{ fontSize: 18, flex: 1 }}>{item}</Text>
      <TouchableOpacity disabled={isSameUser} onPress={() => props.handleTransfer(item)}>
        {
          <FontAwesome5 name='exchange-alt' size={20} color={isSameUser ? 'white' : 'blue'} style={{ paddingVertical: 20 }} />
        }
      </TouchableOpacity>
    </View>
  );
}