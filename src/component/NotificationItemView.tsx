import {
  Image,
  ListRenderItem,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Notification, Topic} from '../types.tsx';
import Icon from 'react-native-vector-icons/AntDesign';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import notificationsView from '../page/NotificationsView.tsx';

interface NotificationItemViewProps {
  data: Notification | undefined;
}

const NotificationItemView: React.FC<NotificationItemViewProps> = ({data}) => {
  const navigation = useNavigation();
  const onClickItem = () => {
    console.log('onClickItem', data?.nid);
    // @ts-ignore
    // navigation.navigate('TopicDetail', {
    //   tid: topic?.tid,
    // });
  };
  return (
    <TouchableOpacity onPress={onClickItem}>
      <View
        style={{
          padding: 10,
        }}>
        <Text>{data?.nid}</Text>
        <Text>{data?.bodyShort}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default NotificationItemView;
