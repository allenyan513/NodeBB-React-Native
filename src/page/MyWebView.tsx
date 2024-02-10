import React, {useState, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import COLORS from '../colors.tsx';
import {useNavigation, useRoute} from '@react-navigation/native';
import WebView from 'react-native-webview';
import HeaderView from '../component/HeaderView.tsx';
import Icon from 'react-native-vector-icons/AntDesign';

const MyWebView = () => {
  const navigation = useNavigation();
  const router = useRoute();
  // @ts-ignore
  const {uri, title} = router.params;

  return (
    <View
      style={{
        flex: 1,
      }}>
      <HeaderView
        style={{
          backgroundColor: COLORS.primary,
        }}
        title={title}
        leftButton={
          <Icon
            name={'close'}
            size={24}
            color={COLORS.primaryTextColor}
            onPress={() => {
              navigation.goBack();
            }}
          />
        }
      />
      <WebView
        style={{
          flex: 1,
        }}
        source={{uri: uri}}
      />
    </View>
  );
};
export default MyWebView;
