import {Alert, Image, Text, TouchableWithoutFeedback, View} from 'react-native';
import {Topic, TopicAction} from '../types.tsx';
import Icon from 'react-native-vector-icons/AntDesign';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import PostAPI from '../service/postAPI.tsx';
import {Avatar} from 'native-base';
import {calculateTime} from '../utils.tsx';
import COLORS from '../colors.tsx';
import VerticalSeparatorLine from './VerticalSeparatorLine.tsx';

interface TopicItemProps {
  index: number;
  topic: Topic | undefined;
  dispatch: React.Dispatch<TopicAction>;
  /**
   * 是否在帖子列表中显示
   */
  isShowInPostList?: boolean;
}

/**
 * 主题列表项
 * @param topic
 * @param dispatch
 * @constructor
 */
const TopicItemView: React.FC<TopicItemProps> = ({
  index,
  topic,
  dispatch,
  isShowInPostList,
}) => {
  const navigation = useNavigation();
  const isOdd = index % 2 === 0;

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
    <TouchableWithoutFeedback onPress={onClickItem}>
      <View
        style={{
          padding: 10,
          backgroundColor: isOdd ? COLORS.ffffff : COLORS.f9f9f9,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 8,
          }}>
          {/*分类|发布时间|发布人|更多*/}
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
              source={{uri: topic?.user?.picture}}>
              {topic?.user?.username?.charAt(0)}
            </Avatar>
            {/*用户名 & 发布时间*/}
            <View>
              {topic?.user && <Text> {topic?.user.username} </Text>}
              {topic?.author && <Text> {topic?.author.username} </Text>}
              <Text
                style={{
                  color: COLORS.secondaryTextColor,
                  fontSize: 12,
                }}>
                {' '}
                {calculateTime(topic?.lastposttime)}{' '}
              </Text>
            </View>
          </View>
          {/*分类名称 */}
          <Text
            style={{
              borderColor: topic?.category.bgColor,
              borderWidth: 1,
              padding: 4,
              borderRadius: 4,
              color: topic?.category.bgColor,
            }}>
            {topic?.category.name}
          </Text>
        </View>
        {/*标题*/}
        <Text
          style={{
            fontSize: 16,
            fontWeight: 'bold',
            color: COLORS.primaryTextColor,
            marginBottom: 8,
          }}>
          {topic?.title}
        </Text>
        {/* 主题首图：存在主题首图 且 不是在帖子中展示*/}
        {topic?.topicThumb && !isShowInPostList && (
          <Image
            style={{
              height: 200,
              width: 200,
              borderRadius: 8,
              marginBottom: 12,
            }}
            src={topic?.topicThumb}
          />
        )}
        {/*toolbar*/}
        {!isShowInPostList && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            {/*upvote & downvote*/}
            <View
              style={{
                flexDirection: 'row',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: COLORS.separatorColor,
                  borderRadius: 20,
                  marginRight: 10,
                  paddingLeft: 12,
                  paddingRight: 12,
                  paddingTop: 8,
                  paddingBottom: 8,
                  backgroundColor: COLORS.third,
                }}>
                <Icon onPress={onClickUpvote} size={20} name={'like2'} />
                <Text
                  style={{
                    marginLeft: 6,
                    marginRight: 8,
                    fontSize: 14,
                  }}>
                  {topic?.upvotes}
                </Text>
                <VerticalSeparatorLine />
                <Icon
                  style={{
                    marginLeft: 8,
                  }}
                  onPress={onClickDownVote}
                  size={20}
                  name={'dislike2'}
                />
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: COLORS.separatorColor,
                  borderRadius: 20,
                  marginRight: 10,
                  paddingLeft: 12,
                  paddingRight: 12,
                  paddingTop: 8,
                  paddingBottom: 8,
                  backgroundColor: COLORS.third,
                }}>
                <Icon name={'retweet'} size={20} />
                <Text
                  style={{
                    marginLeft: 6,
                  }}>
                  {topic?.postcount}
                </Text>
              </View>
            </View>

            {/*分享*/}
            {/*<Icon name={'up'} />*/}
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default TopicItemView;
