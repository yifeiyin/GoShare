import firebase from 'firebase'

class Firebase {
    constructor(){
        this.init()
        this.checkAuth()
    }

    init = () => {
        if (!firebase.apps.length) {
            firebase.initializeApp({
                apiKey: "AIzaSyDmgui-z-9rQqpBtyQH2WLWN6fclKo7wEc",
                authDomain: "hackthevalley4-501e2.firebaseapp.com",
                databaseURL: "https://hackthevalley4-501e2.firebaseio.com",
                projectId: "hackthevalley4-501e2",
                storageBucket: "hackthevalley4-501e2.appspot.com",
                messagingSenderId: "90573831945",
                appId: "1:90573831945:web:4e22175ad0e95535831dd8",
                measurementId: "G-FG3M7RQLCY"
              })
        }
    };

    onItemsChange(callback) {
        firebase.database().ref('items/').on('value', callback);
    }

    updateItem(itemId, coords, username) {
        firebase.database().ref('items/' + itemId).set({
          coords: coords,
          username: username,
        });
    }

    addUser(name) {
        firebase.database().ref('users/').push({
          username: name,
        });
    }

    checkAuth =()=>{
        firebase.auth().onAuthStateChanged( user => {
            if (!user){
                firebase.auth().signInAnonymously();
            }
        });
    };

    send = messages => {
        messages.forEach(item => {
            const message = {
                text: item.text,
                timestamp: firebase.database.ServerValue.TIMESTAMP,
                user: item.user
            };

            this.db.push(message);
        });
    };

    parse = message => {
        const{user, text, timestamp} = message.val();
        const {key: _id} = message;
        const createdAt = new Date(timestamp);

        return {
            id,
            createdAt,
            text,
            user
        };
    };

    get = callback => {
        this.db.on('child_added', snapshot => callback(this.parse(snapshot)));
    };

    off(){
        this.db.off()
    }

    get db(){
        return firebase.database().ref("messages");
    }

    get uid() {
        return (firebase.auth().currentUser || {}).uid;
    }
}

export default new Firebase();