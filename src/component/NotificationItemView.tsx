import {
  Image,
  ListRenderItem,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import {Notification, Topic} from '../types.tsx';
import Icon from 'react-native-vector-icons/AntDesign';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import RenderHTML from 'react-native-render-html';
import COLORS from '../colors.tsx';

interface NotificationItemViewProps {
  data: Notification | undefined;
}

const NotificationItemView: React.FC<NotificationItemViewProps> = ({data}) => {
  const navigation = useNavigation();
  const width = useWindowDimensions().width;
  const onClickItem = () => {
    //todo 跳转到对应的帖子
  };
  return (
    <TouchableOpacity onPress={onClickItem}>
      <View
        style={{
          padding: 10,
          backgroundColor: COLORS.ffffff,
        }}>
        <RenderHTML
          contentWidth={width}
          source={{html: data?.bodyShort || ''}}
        />
      </View>
    </TouchableOpacity>
  );
};

export default NotificationItemView;
