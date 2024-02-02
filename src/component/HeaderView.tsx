import {Text, View, StyleSheet, TouchableOpacity, Image} from 'react-native';
import React, {useRef, useState} from 'react';
import COLORS from '../colors.tsx';

interface HeaderViewProps {
  style?: any;
  title: string;
  leftText?: string;
  rightText?: string;
  leftImage?: any;
  rightImage?: any;
  separatorLine?: boolean;
  onClickLeftButton?: () => void;
  onClickRightButton?: () => void;
}

const HeaderView: React.FC<HeaderViewProps> = props => {
  return (
    <View style={props.style}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.leftContainer}
          onPress={props.onClickLeftButton}>
          {props.leftImage ? (
            <Image source={props.leftImage} style={styles.leftImage} />
          ) : (
            <Text style={styles.leftText}>{props.leftText}</Text>
          )}
        </TouchableOpacity>
        <Text numberOfLines={1} ellipsizeMode={'tail'} style={styles.title}>
          {props.title}
        </Text>
        <TouchableOpacity
          style={styles.rightContainer}
          onPress={props.onClickRightButton}>
          {props.rightImage ? (
            <Image source={props.rightImage} style={styles.rightImage} />
          ) : (
            <Text style={styles.rightText}>{props.rightText}</Text>
          )}
        </TouchableOpacity>
      </View>

      {props.separatorLine ? <View style={styles.line} /> : null}
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
    flex: 1,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    color: COLORS.primaryTextColor,
    fontSize: 20,
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
