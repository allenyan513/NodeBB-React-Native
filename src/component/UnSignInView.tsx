import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
} from 'react-native';
import React from 'react';
import COLORS from '../colors.tsx';
import {useAuth} from '../context/AuthContext.js';
import {useNavigation} from '@react-navigation/native';

interface UnSignInProps {
  // style?: any;
  // title?: string;
  // isAuthReady?: boolean;
  // onClick: () => void;
}

const UnSignInView: React.FC<UnSignInProps> = props => {
  const navigation = useNavigation();
  const {currentUser} = useAuth();

  const onClick = () => {
    //@ts-ignore
    navigation.navigate('SignIn');
  };
  if (currentUser) {
    return <View />;
  }
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        margin: 10,
      }}>
      <ImageBackground
        source={require('../assets/signin1.png')}
        resizeMode={'cover'}
        borderRadius={10}
        style={{
          height: 600,
          justifyContent: 'space-between',
        }}>
        <View>
          <Text
            style={{
              color: COLORS.primaryTextColor,
              fontSize: 32,
              fontWeight: 'bold',
              paddingTop: 15,
              paddingLeft: 15,
              paddingBottom: 10,
            }}>
            Get started
          </Text>
          <Text
            style={{
              color: COLORS.primaryTextColor,
              fontSize: 16,
              paddingLeft: 15,
              paddingRight: 10,
            }}>
            Keep track of your threads of curiosity and knowledge
          </Text>
        </View>
        <TouchableOpacity onPress={onClick}>
          <View
            style={{
              backgroundColor: 'white',
              borderRadius: 20,
              margin: 20,
            }}>
            <Text
              style={{
                color: COLORS.primary,
                padding: 10,
                textAlign: 'center',
              }}>
              Sign in
            </Text>
          </View>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
};

export default UnSignInView;
