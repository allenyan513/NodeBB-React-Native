import {
  Image,
  ListRenderItem,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Topic} from '../types.tsx';
import Icon from 'react-native-vector-icons/AntDesign';
import React from 'react';
import {Avatar} from '@rneui/themed';
import {useNavigation} from '@react-navigation/native';

interface TopicItemProps {
  topic: Topic | undefined;
}

const TopicItemView: React.FC<TopicItemProps> = ({topic}) => {
  const navigation = useNavigation();
  const onClickItem = () => {
    console.log('onClickItem', topic?.tid);
    // @ts-ignore
    navigation.navigate('TopicDetail', {
      tid: topic?.tid,
    });
  };
  return (
    <TouchableOpacity onPress={onClickItem}>
      <View
        style={{
          padding: 10,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          {/*分类|发布时间|发布人|更多*/}
          <View
            style={{
              flexDirection: 'row',
            }}>
            {/*<Avatar rounded size="small" source={{uri: topic?.user.picture}} />*/}
            {topic?.user && <Text> {topic?.user.username} </Text>}
            {topic?.author && <Text> {topic?.author.username} </Text>}
            {/*<Text> {topic?.user.username} </Text>*/}
            <Text> {topic?.lastposttimeISO} </Text>
          </View>
          <Text> {topic?.category.name} </Text>
        </View>
        <Text
          style={{
            fontSize: 14,
            fontWeight: 'bold',
          }}>
          {topic?.title}
        </Text>
        {/*topicThumb*/}
        {topic?.topicThumb && (
          <Image
            style={{
              height: 100,
              width: 100,
            }}
            src={topic?.topicThumb}
          />
        )}
        {/*toolbar*/}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              flexDirection: 'row',
            }}>
            <Icon name={'up'} />
            <Icon name={'down'} />
            <Icon name={'up'} />
          </View>
          <Icon name={'up'} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default TopicItemView;
