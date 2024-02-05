import {
  Alert,
  Image,
  ListRenderItem,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Topic, TopicAction} from '../types.tsx';
import Icon from 'react-native-vector-icons/AntDesign';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import PostAPI from '../service/postAPI.tsx';

interface TopicItemProps {
  topic: Topic | undefined;
  dispatch: React.Dispatch<TopicAction>;
}

const TopicItemView: React.FC<TopicItemProps> = ({topic, dispatch}) => {
  const navigation = useNavigation();
  const onClickItem = () => {
    console.log('onClickItem', topic?.tid);
    // @ts-ignore
    navigation.navigate('TopicDetail', {
      tid: topic?.tid,
    });
  };

  const onClickUpvote = async () => {
    if (topic?.mainPid === undefined) {
      Alert.alert('Error', 'mainPid is undefined');
      return;
    }
    try {
      //先更新本地数据
      dispatch({
        type: 'UPVOTE',
        payload: {
          tid: topic?.tid,
          delta: 1,
        },
      });
      await PostAPI.vote(topic?.mainPid, 1);
    } catch (e) {
      console.error(e);
      //如果失败，恢复本地数据
      dispatch({
        type: 'DOWNVOTE',
        payload: {
          tid: topic?.tid,
          delta: -1,
        },
      });
    }
  };
  const onClickDownVote = async () => {
    if (topic?.mainPid === undefined) {
      Alert.alert('Error', 'mainPid is undefined');
      return;
    }
    try {
      //先更新本地数据
      dispatch({
        type: 'DOWNVOTE',
        payload: {
          tid: topic?.tid,
          delta: -1,
        },
      });
      await PostAPI.vote(topic?.mainPid, -1);
    } catch (e) {
      console.error(e);
      //如果失败，恢复本地数据
      dispatch({
        type: 'UPVOTE',
        payload: {
          tid: topic?.tid,
          delta: 1,
        },
      });
    }
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
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: 'gray',
                borderRadius: 5,
                marginRight: 10,
                padding: 5,
              }}>
              <Icon onPress={onClickUpvote} size={20} name={'up'} />
              <Text>{topic?.upvotes}</Text>
              <Icon
                style={{
                  marginLeft: 10,
                }}
                onPress={onClickDownVote}
                size={20}
                name={'down'}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: 'gray',
                borderRadius: 5,
                marginRight: 10,
                padding: 5,
              }}>
              <Icon name={'message1'} />
              <Text>{topic?.postcount}</Text>
            </View>
          </View>
          <Icon name={'up'} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default TopicItemView;
