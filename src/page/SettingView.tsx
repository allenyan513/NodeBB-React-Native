import React, {useState, useEffect, useContext, useReducer} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import COLORS from '../colors.tsx';
import {useAuth} from '../context/AuthContext.tsx';
import {useNavigation} from '@react-navigation/native';
import {Asset, launchImageLibrary} from 'react-native-image-picker';
import AWSHelper from '../service/AWSHepler.tsx';
import {Avatar, Button} from 'native-base';
import UserAPI from '../service/userAPI.tsx';
import HeaderView from '../component/HeaderView.tsx';
import Icon from 'react-native-vector-icons/AntDesign';

const SettingView = () => {
  const navigation = useNavigation();
  const {currentUser, user, refreshVerifyTokenAndUser, signOut, deleteUser} =
    useAuth();

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
      await UserAPI.updateUserPicture(uid, s3Url);
      await refreshVerifyTokenAndUser();
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

  const onClickSignOut = async () => {
    await signOut();
    console.log('User signed out!');
    navigation.goBack();
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
          onPress: async () => {
            try {
              await deleteUser();
            } catch (error) {
              console.log('error', error);
              // @ts-ignore
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
            }
          },
        },
      ],
      {cancelable: false},
    );
  };

  return (
    <View style={{flex: 1}}>
      <HeaderView
        title={'设置'}
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

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Button
                  variant="unstyled"
                  colorScheme={'primary'}
                  onPress={onClickChangeAvatar}>
                  更换头像
                </Button>
                <Avatar
                  size={'sm'}
                  source={{
                    uri: user?.picture,
                  }}
                />
              </View>
            </View>
          </TouchableOpacity>
          <View style={styles.itemContainer}>
            <Text style={styles.itemTitle}>Email</Text>
            <Text style={styles.itemContent}>{currentUser?.email}</Text>
          </View>
        </View>
        <Text style={styles.title}>关于</Text>
        <View style={styles.groupContainer}>
          <TouchableOpacity
            onPress={() => {
              // @ts-ignore
              navigation.navigate('MyWebView', {
                title: 'Privacy Policy',
                uri: 'https://nodebb-app.web.app/privacy_policy.html',
              });
            }}>
            <View style={styles.itemContainer}>
              <Text style={styles.itemTitle}>Privacy policy</Text>
              <Icon name={'right'} size={24} color={COLORS.primaryTextColor} />
            </View>
          </TouchableOpacity>
          <View style={styles.separatorLine} />
          <TouchableOpacity
            onPress={() => {
              // @ts-ignore
              navigation.navigate('MyWebView', {
                title: 'Content Policy',
                uri: 'https://nodebb-app.web.app/content_policy.html',
              });
            }}>
            <View style={styles.itemContainer}>
              <Text style={styles.itemTitle}>Privacy policy</Text>
              <Icon name={'right'} size={24} color={COLORS.primaryTextColor} />
            </View>
          </TouchableOpacity>
          <View style={styles.separatorLine} />
          <TouchableOpacity
            onPress={() => {
              // @ts-ignore
              navigation.navigate('MyWebView', {
                title: 'User Agreement',
                uri: 'https://nodebb-app.web.app/user_argreement.html',
              });
            }}>
            <View style={styles.itemContainer}>
              <Text style={styles.itemTitle}>Terms of service</Text>
              <Icon name={'right'} size={24} color={COLORS.primaryTextColor} />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.groupContainer}>
          <TouchableOpacity onPress={onClickSignOut}>
            <View style={styles.itemContainer}>
              <Text style={styles.itemTitle}>登出</Text>
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
                删除帐户
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
    backgroundColor: COLORS.separatorColor,
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
