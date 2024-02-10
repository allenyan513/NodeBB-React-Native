import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ViewStyle,
  StyleProp,
} from 'react-native';
import React, {useRef, useState} from 'react';
import COLORS from '../colors.tsx';
import {useTranslation} from 'react-i18next';

interface HeaderView2Props {
  style?: StyleProp<ViewStyle>;
  title: string;
  leftButton?: React.ReactNode;
  rightButton?: React.ReactNode;
}

const HeaderView: React.FC<HeaderView2Props> = props => {
  return (
    <View style={props.style}>
      <View style={styles.container}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'flex-start',
            marginLeft: 12,
          }}>
          {props.leftButton}
        </View>
        <View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text numberOfLines={1} ellipsizeMode={'tail'} style={styles.title}>
            {props.title}
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'flex-end',
            marginRight: 12,
          }}>
          {props.rightButton}
        </View>
      </View>
      <View style={styles.line} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 54,
  },
  title: {
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    color: COLORS.primaryTextColor,
    fontSize: 18,
  },
  leftContainer: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  leftImage: {
    width: 22,
    height: 22,
  },
  leftText: {
    color: COLORS.primaryTextColor,
    fontSize: 16,
    fontWeight: 'bold',
  },
  rightContainer: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  rightImage: {
    width: 22,
    height: 22,
  },
  rightText: {
    color: COLORS.primaryTextColor,
    fontSize: 16,
    fontWeight: 'bold',
  },
  line: {
    height: 1,
    backgroundColor: COLORS.separatorColor,
  },
});

export default HeaderView;
