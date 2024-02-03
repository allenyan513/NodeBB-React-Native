import React, {useState, useEffect, useContext} from 'react';
import {StyleSheet, View} from 'react-native';
import COLORS from '../colors.tsx';
import AuthContext from '../context/AuthContext.js';
import {useNavigation, useRoute} from '@react-navigation/native';
import WebView from 'react-native-webview';
import HeaderView from '../component/HeaderView.tsx';

interface MyWebViewProps {
  title: string;
  uri: string;
}

const MyWebView = () => {
  const navigation = useNavigation();
  const router = useRoute();
  const {currentUser, setCurrentUser} = useContext(AuthContext);
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
        leftImage={require('../assets/cross-small.png')}
        separatorLine={true}
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
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.secondary,
    padding: 15,
  },
});
export default MyWebView;
