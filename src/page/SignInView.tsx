import React, {useState, useEffect, useContext} from 'react';
import {
  Text,
  View,
  Button,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';
import COLORS from '../colors.tsx';
import AuthContext from '../context/AuthContext';
import {useNavigation} from '@react-navigation/native';
import {
  AppleButton,
  appleAuth,
} from '@invertase/react-native-apple-authentication';
import LinearGradient from 'react-native-linear-gradient';
import {RNGoogleSigninButton} from '@react-native-google-signin/google-signin/lib/typescript/src/RNGoogleSiginButton';

GoogleSignin.configure({
  webClientId:
    '1092651739434-dieqqi9qs6j8acltdvkgc11p54t4hv36.apps.googleusercontent.com',
});

const SignInView = () => {
  const navigation = useNavigation();
  const {currentUser, setCurrentUser} = useContext(AuthContext);

  async function onAppleButtonPress() {
    // Start the sign-in request
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      // As per the FAQ of react-native-apple-authentication, the name should come first in the following array.
      // See: https://github.com/invertase/react-native-apple-authentication#faqs
      requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
    });
    // Ensure Apple returned a user identityToken
    if (!appleAuthRequestResponse.identityToken) {
      throw new Error('Apple Sign-In failed - no identify token returned');
    }
    // Create a Firebase credential from the response
    const {identityToken, nonce} = appleAuthRequestResponse;
    console.log('identityToken', identityToken);
    const appleCredential = auth.AppleAuthProvider.credential(
      identityToken,
      nonce,
    );
    // Sign the user in with the credential
    return auth().signInWithCredential(appleCredential);
  }

  async function onClickGoogleSignIn() {
    await GoogleSignin.hasPlayServices({
      showPlayServicesUpdateDialog: true,
    });
    const {idToken} = await GoogleSignin.signIn();
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    await auth().signInWithCredential(googleCredential);
    navigation.goBack();
  }

  useEffect(() => {
    if (currentUser) {
      console.log('SignInView. user login success. Go back');
      navigation.goBack();
    }
  }, [currentUser]);

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
        {/*<Text*/}
        {/*  style={{*/}
        {/*    flex: 1,*/}
        {/*    color: "white",*/}
        {/*    fontSize: 38,*/}
        {/*    fontWeight: "bold"*/}
        {/*  }}>*/}
        {/*  Mistree*/}
        {/*</Text>*/}
        <AppleButton
          buttonStyle={AppleButton.Style.WHITE}
          buttonType={AppleButton.Type.CONTINUE}
          style={{
            width: 360, // You must specify a width
            height: 44, // You must specify a height
            marginBottom: 20,
            borderRadius: 22,
          }}
          onPress={() =>
            onAppleButtonPress()
              .then(() => console.log('OK'))
              .catch(error => console.log(error))
          }
        />

        <TouchableOpacity onPress={onClickGoogleSignIn}>
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
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.secondary,
    padding: 15,
  },
  title: {
    color: COLORS.primaryTextColor,
    fontSize: 16,
    marginLeft: 16,
    marginBottom: 10,
  },
  groupContainer: {
    backgroundColor: COLORS.third,
    borderRadius: 10,
    marginBottom: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 44,
    paddingLeft: 16,
    paddingRight: 16,
  },
  itemTitle: {
    color: COLORS.primaryTextColor,
    fontSize: 16,
  },
  itemContent: {
    color: COLORS.primaryTextColor,
    fontSize: 16,
  },
  separatorLine: {
    height: 1,
    backgroundColor: COLORS.separatorColor,
    marginLeft: 16,
    marginRight: 16,
  },
  arrowRight: {
    width: 24,
    height: 24,
  },
});
export default SignInView;
