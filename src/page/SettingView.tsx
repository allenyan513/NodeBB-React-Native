import React, {useState, useEffect, useContext, useReducer} from 'react';
import {
  Text,
  View,
  Button,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import HeaderView from '../component/HeaderView.tsx';
import COLORS from '../colors.tsx';
import {useAuth} from '../context/AuthContext.js';
import {useNavigation} from '@react-navigation/native';
import {useQueryClient} from '@tanstack/react-query';
import {useMMKVObject, useMMKVString} from 'react-native-mmkv';
import {User} from '../types.tsx';
import {Avatar} from '@rneui/themed';
import {Asset, launchImageLibrary} from 'react-native-image-picker';
import AWSHelper from '../service/AWSHepler.tsx';
import {updateUserPicture} from '../service/apis.tsx';

const SettingView = () => {
  const queryClient = useQueryClient();
  const navigation = useNavigation();
  const {currentUser, setCurrentUser} = useAuth();
  const [verifyToken, setVerifyToken] = useMMKVString('user.verifyToken');
  const [user, setUser] = useMMKVObject<User | null>('user');
  console.log('user', user);

  const invalidAllCache = () => {
    queryClient.clear();
    queryClient.invalidateQueries({
      queryKey: ['/api/thread'],
    });
    queryClient.invalidateQueries({
      queryKey: ['/api/knowledge'],
    });
  };

  const uploadAvatar = async (asset: Asset) => {
    try {
      const uid = user?.uid;
      if (uid === undefined) {
        Alert.alert('Error', 'User is not found');
        return;
      }
      const s3Url = await AWSHelper.uploadFile(
        // @ts-ignore
        asset.uri,
        asset.fileName,
        asset.type,
      );
      await updateUserPicture(uid, s3Url);
      Alert.alert('Success', 'Avatar updated');
    } catch (e) {
      Alert.alert('Error', 'Failed to upload avatar');
    }
  };

  const onClickChangeAvatar = () => {
    launchImageLibrary({mediaType: 'photo'}, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        console.log('response', response);
        // @ts-ignore
        uploadAvatar(response.assets[0]);
      }
    });
  };

  const onClickSignOut = () => {
    auth()
      .signOut()
      .then(() => {
        invalidAllCache();
        console.log('User signed out!');
        setVerifyToken('');
        setUser(null);
        navigation.goBack();
      })
      .catch(error => {
        console.log('error', error);
      });
  };
  const onClickDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            auth()
              .currentUser?.delete()
              .then(() => {
                invalidAllCache();
                console.log('User deleted!');
                navigation.goBack();
              })
              .catch(error => {
                console.log('error', error);
                if (error.code === 'auth/requires-recent-login') {
                  Alert.alert(
                    'Dangerous action',
                    'This operation is sensitive and requires recent authentication. Please sign in again to delete your account.',
                    [
                      {
                        text: 'OK',
                        onPress: () => {
                          onClickSignOut();
                        },
                      },
                    ],
                    {cancelable: false},
                  );
                }
              });
          },
        },
      ],
      {cancelable: false},
    );
  };

  return (
    <View style={{flex: 1}}>
      <HeaderView
        style={{
          backgroundColor: COLORS.primary,
        }}
        title={'设置'}
        leftImage={require('../assets/cross-small.png')}
        separatorLine={true}
      />
      <View style={styles.container}>
        <Text style={styles.title}>个人信息</Text>
        <View style={styles.groupContainer}>
          <View style={styles.itemContainer}>
            <Text style={styles.itemTitle}>昵称</Text>
            <Text style={styles.itemContent}>{user?.username}</Text>
          </View>
          <TouchableOpacity onPress={onClickChangeAvatar}>
            <View style={styles.itemContainer}>
              <Text style={styles.itemTitle}>头像</Text>
              <Avatar
                size={32}
                rounded
                containerStyle={{
                  backgroundColor: COLORS.green,
                }}
                source={{
                  uri: user?.picture,
                }}
                onPress={() => {}}
              />
            </View>
          </TouchableOpacity>
          <View style={styles.itemContainer}>
            <Text style={styles.itemTitle}>Email</Text>
            <Text style={styles.itemContent}>{currentUser?.email}</Text>
          </View>
        </View>
        <Text style={styles.title}>About</Text>
        <View style={styles.groupContainer}>
          <TouchableOpacity
            onPress={() => {
              // @ts-ignore
              navigation.navigate('MyWebView', {
                title: 'Privacy policy',
                uri: 'https://mist-2c0b9.web.app/privacy-policy.html',
              });
            }}>
            <View style={styles.itemContainer}>
              <Text style={styles.itemTitle}>Privacy policy</Text>
              <Image
                style={styles.arrowRight}
                source={require('../assets/right-white.png')}
              />
            </View>
          </TouchableOpacity>
          <View style={styles.separatorLine} />
          <TouchableOpacity
            onPress={() => {
              // @ts-ignore
              navigation.navigate('MyWebView', {
                title: 'Terms of service',
                uri: 'https://mist-2c0b9.web.app/terms-of-service.html',
              });
            }}>
            <View style={styles.itemContainer}>
              <Text style={styles.itemTitle}>Terms of service</Text>
              <Image
                style={styles.arrowRight}
                source={require('../assets/right-white.png')}
              />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.groupContainer}>
          <TouchableOpacity onPress={onClickSignOut}>
            <View style={styles.itemContainer}>
              <Text style={styles.itemTitle}>Sign out</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.groupContainer}>
          <TouchableOpacity onPress={onClickDeleteAccount}>
            <View style={styles.itemContainer}>
              <Text
                style={[
                  styles.itemTitle,
                  {
                    color: 'red',
                  },
                ]}>
                Delete account
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
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
export default SettingView;
