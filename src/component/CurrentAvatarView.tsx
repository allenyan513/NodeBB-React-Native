import {
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {Avatar, Button} from 'native-base';
import React from 'react';
import {useAuth} from '../context/AuthContext.tsx';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

const CurrentAvatarView = () => {
  const {t} = useTranslation();
  const {user} = useAuth();
  const navigation = useNavigation();
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
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
        <Button
          size={'sm'}
          colorScheme={'green'}
          onPress={() => {
            // @ts-ignore
            navigation.navigate('SignIn');
          }}>
          {t('Sign In')}
        </Button>
      )}
    </View>
  );
};

export default CurrentAvatarView;
