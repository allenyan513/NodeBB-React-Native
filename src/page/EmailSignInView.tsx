import React, {useState, useEffect} from 'react';
import {Text, View, Button, StyleSheet, TextInput, Alert} from 'react-native';
import auth from '@react-native-firebase/auth';
import COLORS from '../colors.tsx';
import {useNavigation} from '@react-navigation/native';
import {useAuth} from '../context/AuthContext.tsx';
import HeaderView from '../component/HeaderView.tsx';
import Icon from 'react-native-vector-icons/AntDesign';
import {useTranslation} from 'react-i18next';

const EmailSignInView = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {emailSignIn} = useAuth();
  const {t} = useTranslation();

  const onClickSignIn = async () => {
    try {
      await emailSignIn(email, password);
      Alert.alert(t('Success'), t('Sign in success'));
      navigation.goBack();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.primary,
      }}>
      <HeaderView
        title={t('Sign In with Email')}
        leftButton={
          <Icon
            name={'left'}
            size={24}
            color={COLORS.primaryTextColor}
            onPress={() => {
              navigation.goBack();
            }}
          />
        }
      />
      <View
        style={{
          padding: 15,
        }}>
        <Text
          style={{
            color: COLORS.primaryTextColor,
            marginBottom: 10,
          }}>
          {t('Email')}
        </Text>
        <TextInput
          multiline={false}
          keyboardType={'email-address'}
          style={{
            color: COLORS.primaryTextColor,
            padding: 10,
            height: 40,
            borderColor: 'gray',
            borderWidth: 1,
          }}
          onChangeText={text => {
            setEmail(text);
          }}
        />
      </View>
      <View
        style={{
          padding: 15,
        }}>
        <Text
          style={{
            color: COLORS.primaryTextColor,
            marginBottom: 10,
          }}>
          {t('Password')}
        </Text>
        <TextInput
          multiline={false}
          style={{
            color: COLORS.primaryTextColor,
            padding: 10,
            height: 40,
            borderColor: 'gray',
            borderWidth: 1,
          }}
          secureTextEntry={true}
          onChangeText={text => {
            setPassword(text);
          }}
        />
      </View>
      <View>
        <Button title={t('Sign In')} onPress={onClickSignIn} />
      </View>
    </View>
  );
};
export default EmailSignInView;
