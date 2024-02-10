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
import {useTranslation} from 'react-i18next';

const SettingView = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const {currentUser, user, refreshVerifyTokenAndUser, signOut, deleteUser} =
    useAuth();

  const uploadAvatar = async (asset: Asset) => {
    try {
      const uid = user?.uid;
      if (uid === undefined) {
        Alert.alert(t('Error'), t('Failed to upload avatar'));
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
      Alert.alert(t('Success'), t('Upload avatar success'));
    } catch (e) {
      Alert.alert(t('Error'), t('Failed to upload avatar'));
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
    navigation.goBack();
  };

  const onClickDeleteAccount = () => {
    Alert.alert(
      t('Delete Account'),
      t('Are you sure you want to delete your account?'),
      [
        {
          text: t('Cancel'),
          style: 'cancel',
        },
        {
          text: t('Delete'),
          onPress: async () => {
            try {
              await deleteUser();
            } catch (error) {
              // @ts-ignore
              if (error.code === 'auth/requires-recent-login') {
                Alert.alert(
                  t('Dangerous action'),
                  t(
                    'This operation is sensitive and requires recent authentication. Please sign in again to delete your account.',
                  ),
                  [
                    {
                      text: t('OK'),
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
        title={t('Setting')}
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
        <Text style={styles.title}>{t('Account')}</Text>
        <View style={styles.groupContainer}>
          <View style={styles.itemContainer}>
            <Text style={styles.itemTitle}>{t('UserName')}</Text>
            <Text style={styles.itemContent}>{user?.username}</Text>
          </View>
          <TouchableOpacity onPress={onClickChangeAvatar}>
            <View style={styles.itemContainer}>
              <Text style={styles.itemTitle}>{t('Avatar')}</Text>

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
                  {t('Change Avatar')}
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
            <Text style={styles.itemTitle}>{t('Email')}</Text>
            <Text style={styles.itemContent}>{currentUser?.email}</Text>
          </View>
        </View>
        <Text style={styles.title}>{t('About')}</Text>
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
              <Text style={styles.itemTitle}>{t('Privacy Policy')}</Text>
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
              <Text style={styles.itemTitle}>{t('Content Policy')}</Text>
              <Icon name={'right'} size={24} color={COLORS.primaryTextColor} />
            </View>
          </TouchableOpacity>
          <View style={styles.separatorLine} />
          <TouchableOpacity
            onPress={() => {
              // @ts-ignore
              navigation.navigate('MyWebView', {
                title: 'User Agreement',
                uri: 'https://nodebb-app.web.app/user_agreement.html',
              });
            }}>
            <View style={styles.itemContainer}>
              <Text style={styles.itemTitle}>{'User Agreement'}</Text>
              <Icon name={'right'} size={24} color={COLORS.primaryTextColor} />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.groupContainer}>
          <TouchableOpacity onPress={onClickSignOut}>
            <View style={styles.itemContainer}>
              <Text style={styles.itemTitle}>{t('Sign Out')}</Text>
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
                {t('Delete Account')}
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
