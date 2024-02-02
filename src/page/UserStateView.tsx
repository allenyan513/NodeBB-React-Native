import React, {useState, useEffect} from 'react';
import {Text, View, Button} from 'react-native';

import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';

const UserStateView = () => {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>();

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(userState => {
      console.log('user', userState);
      console.log('user', userState?.uid);
      userState?.getIdToken().then(token => {
        console.log('token', token);
      });
      setUser(userState);
      if (initializing) {
        setInitializing(false);
      }
    });
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) {
    return null;
  }

  if (!user) {
    return (
      <View>
        <Text>Login</Text>
      </View>
    );
  }

  return (
    <View>
      <Text>Welcome {user.email}</Text>
    </View>
  );
};
export default UserStateView;
