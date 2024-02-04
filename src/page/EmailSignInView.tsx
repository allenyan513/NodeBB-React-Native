import React, {useState, useEffect} from 'react';
import {Text, View, Button, StyleSheet, TextInput} from 'react-native';
import auth from '@react-native-firebase/auth';
import COLORS from '../colors.tsx';
import {useNavigation} from '@react-navigation/native';
import HeaderView from '../component/HeaderView.tsx';

const EmailSignInView = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onClickSignIn = async () => {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(
        email,
        password,
      );
      console.log('create user and sign in success', userCredential);
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
        title={'Email Sign In'}
        leftImage={require('../assets/cross-small.png')}
        onClickLeftButton={() => {
          navigation.goBack();
        }}
        separatorLine={true}
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
          Email
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
          Password
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
        <Button title="Sign In" onPress={onClickSignIn} />
      </View>
    </View>
  );
};
export default EmailSignInView;
