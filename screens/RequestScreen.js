import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import ActionSheet from 'react-native-custom-actionsheet';
import DatePicker from '../datePicker';
import { FontAwesome5 } from '@expo/vector-icons';
import { CurrentUser, format24HourMin } from '../helper';
import Firebase from '../firebase';

const OPTION_1 = {
  cancelButtonIndex: 0,
  options: ['Cancel', 'Lightning', 'USB-C', 'Calculator', 'Power-Bank'],
  title: 'Which one would you like to request?',
}

const OPTION_2 = {
  cancelButtonIndex: 0,
  options: ['Cancel', 'MW', 'AC', 'HW', 'BV', 'AA', 'IC', 'EV'],
  title: 'Where would you like to pick up?'
}

export default class RequestScreen extends React.Component {
  static navigationOptions = () => ({
    headerTitle: 'Request as ' + CurrentUser.get(),
  });

  holders = []
  // chats = ''

  state = {
    selectedItem: 'Please Select',
    selectedPlace: 'Please Select',
    dateTime: new Date(),
    actionSheetOptions: OPTION_1,
  }

  componentDidMount() {
    this.firebaseItemsLister = Firebase.onItemsChange((data) => {
      data = data.val();
      let holders = [];
      for (let key in data) {
        let item = data[key];
        holders.push({ username: item.username, item: key });
      }
      this.holders = holders;
    });

    // this.firebaseItemsLister = Firebase.onUsersChange((data) => {
    //   data = data.val();
    //   console.log(data)
    //   let chats = '';
    //   for (let key in data) {
    //     if (key == CurrentUser.get()) {
    //       let item = data[key];
    //       chats = item.chat;
    //     }
    //   }
    //   console.log(chats)
    //   this.chats = chats;
    // });
  }

  componentWillUnmount() {
    Firebase.off(this.firebaseItemsLister);
  }

  send = () => {
    if (!check(this.state.selectedItem, this.state.selectedPlace)) {
      Alert.alert('Warning', 'Something is empty')
    } else {
      let message = [
        {
          _id: 1,
          text: 'I would like to request for a ' + this.state.selectedItem
            + ' at ' + format24HourMin(this.state.dateTime)
            + '. Should we meet at ' + this.state.selectedPlace + ' ?',
          createdAt: new Date(),
          flag: 'unread',
          user: {
            _id: CurrentUser.get(),
            name: CurrentUser.get(),
          }
        }
      ]

      for (let item of this.holders) {
        if (item.item.startsWith(this.state.selectedItem)) {
          if (item.username != CurrentUser.get()) {
            Firebase.send(message, item.username)
          }
        }
      }

      Alert.alert("Success",
        "Your request has been sent")
      this.props.navigation.navigate("MapScreen")
    }
  }

  showActionSheet = (option) => {
    this.setState({ actionSheetOptions: option == 'OPTION_1' ? OPTION_1 : OPTION_2 }, () => {
      this.actionSheet.show();
    });
  }

  getActionSheetRef = ref => (this.actionSheet = ref)

  handlePress = (index) => {
    let options = this.state.actionSheetOptions.options;
    if (this.state.actionSheetOptions.title == OPTION_1.title) {
      this.setState({ selectedItem: index == 0 ? 'Please Select' : options[index] });
    } else {
      this.setState({ selectedPlace: index == 0 ? 'Please Select' : options[index] });
    }
  }

  render() {
    return (
      <SafeAreaView style={styles.container} >

        <ActionSheet
          ref={this.getActionSheetRef}
          {...this.state.actionSheetOptions}
          message="choose one"
          onPress={this.handlePress}
        />

        <View style={styles.itemView}>
          <Text style={styles.itemText}>
            I would like to request a
            </Text>

          <TouchableOpacity
            onPress={() => this.showActionSheet('OPTION_1')}>
            <Text style={styles.itemSelectedText}>
              {this.state.selectedItem}
            </Text>
          </TouchableOpacity>

        </View>

        <View style={styles.whenView}>
          <Text style={styles.itemText}>
            I need it today at
            </Text>

          <DatePicker
            date={this.state.dateTime}
            onChange={(newValue) => this.setState({ dateTime: newValue })}
          />


        </View>

        <View style={styles.whereView}>
          <Text style={styles.itemText}>
            I would like to pick it up at
            </Text>

          <TouchableOpacity
            onPress={() => this.showActionSheet('OPTION_2')}>
            <Text style={styles.itemSelectedText}>
              {this.state.selectedPlace}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sendView}>
          <TouchableOpacity
            style={
              check(this.state.selectedItem, this.state.selectedPlace)
                ? styles.sendReady
                : styles.send}
            onPress={this.send}>
            <FontAwesome5
              style={check(this.state.selectedItem, this.state.selectedPlace)
                ? styles.iconReady
                : styles.icon}
              name='paper-plane'
              size={35} />
          </TouchableOpacity>
        </View>

      </SafeAreaView>
    );
  }
}

function check(item, place) {
  if (item == 'Please Select'
    || place == 'Please Select') {
    return false
  } else {
    return true
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  itemView: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  itemText: {
    fontSize: 25,
    fontWeight: '800',
    color: '#514E5A',
  },
  itemSelectedText: {
    fontSize: 25,
    fontWeight: '800',
    color: '#D81B60',
    marginTop: 10,
  },
  whenView: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  whereView: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  sendView: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  send: {
    width: 70,
    height: 70,
    borderRadius: 70 / 2,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center'
  },
  sendReady: {
    width: 70,
    height: 70,
    borderRadius: 70 / 2,
    backgroundColor: '#D81B60',
    alignItems: 'center',
    justifyContent: 'center'
  },
  icon: {
    color: '#514E5A',
  },
  iconReady: {
    color: '#fff',
  }
});