import {Text, View} from 'react-native';
import {Avatar} from 'native-base';
import COLORS from '../colors.tsx';
import {calculateTime} from '../utils.tsx';
import React from 'react';

interface AvatarUserNameAndTimeViewProps {
  avatar: string | undefined;
  username: string | undefined;
  timestamp: number | undefined;
}

/**
 * 用户头像 & 用户昵称 & 发布时间
 * @param props
 * @constructor
 */
const AvatarUserNameAndTimeView: React.FC<
  AvatarUserNameAndTimeViewProps
> = props => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      {/*头像*/}
      <Avatar
        bg="light.500"
        style={{
          marginRight: 4,
        }}
        size="sm"
        source={{uri: props.avatar}}>
        {props.username && props.username.charAt(0)}
      </Avatar>
      {/*用户名 & 发布时间*/}
      <View>
        <Text> {props.username} </Text>
        <Text
          style={{
            color: COLORS.secondaryTextColor,
            fontSize: 12,
          }}>
          {' '}
          {calculateTime(props.timestamp)}{' '}
        </Text>
      </View>
    </View>
  );
};
export default AvatarUserNameAndTimeView;
