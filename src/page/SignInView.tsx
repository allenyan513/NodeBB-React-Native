import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import COLORS from '../colors.tsx';
import {useNavigation} from '@react-navigation/native';
import {AppleButton} from '@invertase/react-native-apple-authentication';
import LinearGradient from 'react-native-linear-gradient';
import {useAuth} from '../context/AuthContext.tsx';

const SignInView = () => {
  const navigation = useNavigation();
  const {googleSignIn, appleSignIn} = useAuth();

  return (
    <ImageBackground
      source={require('../assets/signin1.png')}
      resizeMode={'cover'}
      style={{
        flex: 1,
      }}>
      <TouchableOpacity
        onPress={() => {
          navigation.goBack();
        }}
        style={{
          flexDirection: 'row-reverse',
        }}>
        <Text
          style={{
            color: COLORS.primaryTextColor,
            fontSize: 16,
            padding: 15,
          }}>
          Skip
        </Text>
      </TouchableOpacity>
      <LinearGradient
        colors={['transparent', 'black']}
        style={{
          flex: 1,
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}>
        <AppleButton
          buttonStyle={AppleButton.Style.WHITE}
          buttonType={AppleButton.Type.CONTINUE}
          style={{
            width: 360, // You must specify a width
            height: 44, // You must specify a height
            marginBottom: 20,
            borderRadius: 22,
          }}
          onPress={async () => {
            await appleSignIn();
            // navigation.goBack();
          }}
        />

        <TouchableOpacity
          onPress={async () => {
            await googleSignIn();
            navigation.goBack();
          }}>
          <View
            style={{
              width: 360, // You must specify a width
              height: 44, // You must specify a height
              borderRadius: 4,
              backgroundColor: 'white',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 20,
            }}>
            <Image
              source={require('../assets/google.png')}
              style={{
                width: 12,
                height: 12,
              }}
            />
            <Text
              style={{
                color: 'black',
                fontWeight: '500',
                fontSize: 17,
                marginLeft: 8,
              }}>
              Continue with Google
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            // @ts-ignore
            navigation.navigate('EmailSignIn');
          }}>
          <View
            style={{
              width: 360, // You must specify a width
              height: 44, // You must specify a height
              borderRadius: 4,
              backgroundColor: 'white',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 20,
            }}>
            <Text
              style={{
                color: 'black',
                fontWeight: '500',
                fontSize: 17,
                marginLeft: 8,
              }}>
              Continue with Email
            </Text>
          </View>
        </TouchableOpacity>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 80,
          }}>
          <Text
            onPress={() => {
              // @ts-ignore
              navigation.navigate('MyWebView', {
                title: 'Privacy policy',
                uri: 'https://mist-2c0b9.web.app/privacy-policy.html',
              });
            }}
            style={{
              flex: 1,
              color: COLORS.secondaryTextColor,
              textAlign: 'right',
              marginRight: 10,
            }}>
            Privacy policy
          </Text>
          <Text
            onPress={() => {
              // @ts-ignore
              navigation.navigate('MyWebView', {
                title: 'Terms of service',
                uri: 'https://mist-2c0b9.web.app/terms-of-service.html',
              });
            }}
            style={{
              flex: 1,
              color: COLORS.secondaryTextColor,
              textAlign: 'left',
              marginLeft: 10,
            }}>
            Terms of service
          </Text>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
};
export default SignInView;
