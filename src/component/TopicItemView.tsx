import {Alert, Image, Text, TouchableWithoutFeedback, View} from 'react-native';
import {Topic, TopicAction} from '../types.tsx';
import Icon from 'react-native-vector-icons/AntDesign';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import PostAPI from '../service/postAPI.tsx';
import COLORS from '../colors.tsx';
import VerticalSeparatorLine from './VerticalSeparatorLine.tsx';
import AvatarUserNameAndTimeView from './AvatarUserNameAndTimeView.tsx';
import {useGlobalState} from '../context/GlobalContext.tsx';
import UpDownVoteView from './UpDownVoteView.tsx';

interface TopicItemProps {
  index: number;
  topic: Topic | undefined;
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
  isShowInPostList,
}) => {
  const {globalState, dispatch} = useGlobalState();
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
        type: 'UPVOTE_TOPIC',
        payload: {
          tid: topic?.tid,
        },
      });
      await PostAPI.vote(topic?.mainPid, 1);
    } catch (e) {
      console.error(e);
      //如果失败，恢复本地数据
      dispatch({
        type: 'DOWNVOTE_TOPIC',
        payload: {
          tid: topic?.tid,
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
        type: 'DOWNVOTE_TOPIC',
        payload: {
          tid: topic?.tid,
        },
      });
      await PostAPI.vote(topic?.mainPid, -1);
    } catch (e) {
      console.error(e);
      //如果失败，恢复本地数据
      dispatch({
        type: 'UPVOTE_TOPIC',
        payload: {
          tid: topic?.tid,
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
          <AvatarUserNameAndTimeView
            avatar={topic?.user?.picture}
            username={
              topic?.user ? topic?.user.username : topic?.author.username
            }
            timestamp={topic?.lastposttime}
          />
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
              <UpDownVoteView
                voteCount={topic?.votes || 0}
                onClickUpvote={onClickUpvote}
                onClickDownVote={onClickDownVote}
              />

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
