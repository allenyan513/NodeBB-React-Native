import React, {useState, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import COLORS from '../colors.tsx';
import {useRoute} from '@react-navigation/native';
import WebView from 'react-native-webview';
import HeaderView from '../component/HeaderView.tsx';

interface MyWebViewProps {
  title: string;
  uri: string;
}

const MyWebView = () => {
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
