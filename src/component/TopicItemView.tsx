import {Alert, Image, Text, TouchableWithoutFeedback, View} from 'react-native';
import {MultiMedia, Topic, TopicAction} from '../types.tsx';
import Icon from 'react-native-vector-icons/AntDesign';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import PostAPI from '../service/postAPI.tsx';
import COLORS from '../colors.tsx';
import VerticalSeparatorLine from './VerticalSeparatorLine.tsx';
import AvatarUserNameAndTimeView from './AvatarUserNameAndTimeView.tsx';
import {useGlobalState} from '../context/GlobalContext.tsx';
import UpDownVoteView from './UpDownVoteView.tsx';
import PagerView from 'react-native-pager-view';
import TopicListView from '../page/TopicListView.tsx';

interface TopicItemProps {
  index: number;
  topic: Topic | undefined;
}

const MultiMediaView: React.FC<{multiMedia: MultiMedia | undefined}> = ({
  multiMedia,
}) => {
  if (!multiMedia || !multiMedia.images || multiMedia.images.length === 0) {
    return <View />;
  }
  return (
    <View style={{height: 150}}>
      <Image
        style={{
          height: 150,
          width: 150,
          borderRadius: 8,
          marginRight: 8,
          marginBottom: 8,
        }}
        src={multiMedia.images[0]}
      />
    </View>
  );
};

/**
 * 主题列表项
 * @param topic
 * @param dispatch
 * @constructor
 */
const TopicItemView: React.FC<TopicItemProps> = ({index, topic}) => {
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
          backgroundColor: COLORS.ffffff,
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
              borderColor: COLORS.f9f9f9,
              borderWidth: 1,
              padding: 8,
              borderRadius: 8,
              color: COLORS.primaryTextColor,
              backgroundColor: COLORS.f9f9f9,
              fontSize: 12,
            }}>
            {topic?.category.name}
          </Text>
        </View>

        <View
          style={{
            marginBottom: 8,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View style={{}}>
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

            {/*内容*/}
            <Text
              style={{
                fontSize: 14,
                color: COLORS.secondaryTextColor,
              }}>
              {topic?.content}
            </Text>
          </View>
          <MultiMediaView multiMedia={topic?.multimedia} />
        </View>

        {/*toolbar*/}
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
      </View>
    </TouchableWithoutFeedback>
  );
};

export default TopicItemView;
