import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, FlatList } from 'react-native';

export default class ChatListScreen extends React.Component {

  state = {
    chats: [],
  };

  // componentDidMount() {
  //   this.loadPosts();
  // }

  // loadPosts = () => {

  // }


  render() {
      return (
        <SafeAreaView style={styles.container}>
          {/* <FlatList
          style={styles.list}
          data={this.state.posts}
          renderItem={({ item }) => 
            <Post data={item} onPressPostMore={this.onPressPostMore} onGotoProfileScreen={(data) => this.props.navigation.navigate('ProfileScreen', { userId: data.user.id })} />
          }
          refreshControl={
            <RefreshControl refreshing={this.state.topLoading} onRefresh={() => { this.state.topLoading = true; this.loadPosts('top'); }} />
          }
        /> */}
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
});