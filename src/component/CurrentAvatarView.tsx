import {
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {Avatar} from 'native-base';
import React from 'react';
import {useAuth} from '../context/AuthContext.tsx';
import {useNavigation} from '@react-navigation/native';

const CurrentAvatarView = () => {
  const {currentUser, user} = useAuth();
  const navigation = useNavigation();
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      {user && (
        <TouchableWithoutFeedback
          onPress={() => {
            // @ts-ignore
            navigation.navigate('Setting');
          }}>
          <Avatar
            size={'sm'}
            source={{
              uri: user?.picture,
            }}>
            <Avatar.Badge bg="green.500" />
          </Avatar>
        </TouchableWithoutFeedback>
      )}
      {!user && (
        <TouchableOpacity
          onPress={() => {
            // @ts-ignore
            navigation.navigate('SignIn');
          }}>
          <Text>Sign In</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default CurrentAvatarView;
