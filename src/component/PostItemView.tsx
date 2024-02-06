import {Text, useWindowDimensions, View} from 'react-native';
import {Post, Topic} from '../types.tsx';
import React from 'react';
import RenderHTML from 'react-native-render-html';
import {Avatar} from 'native-base';
import Icon from 'react-native-vector-icons/AntDesign';
import COLORS from '../colors.tsx';
import {calculateTime} from '../utils.tsx';
import AvatarUserNameAndTimeView from './AvatarUserNameAndTimeView.tsx';
import {SafeAreaView} from 'react-native-safe-area-context';
import UpDownVoteView from './UpDownVoteView.tsx';

interface PostItemProps {
  index: number;
  post: Post;
}

/**
 * 帖子列表项
 * @param post
 * @constructor
 */
const PostItemView: React.FC<PostItemProps> = ({index, post}) => {
  const width = useWindowDimensions().width;
  const isFirst = index === 0;
  const isOdd = index % 2 === 0;
  const onClickUpvote = () => {};
  const onClickDownVote = () => {};

  return (
    <View
      style={{
        padding: 10,
        backgroundColor: isOdd ? COLORS.ffffff : COLORS.f9f9f9,
      }}>
      {/*用户头像 & 用户昵称 & 发布时间*/}
      {!isFirst && (
        <AvatarUserNameAndTimeView
          avatar={post?.user?.picture}
          username={post?.user.username}
          timestamp={post?.timestamp}
        />
      )}
      <RenderHTML contentWidth={width} source={{html: post.content}} />
      {/*toolbar*/}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <UpDownVoteView
          voteCount={post?.votes || 0}
          onClickUpvote={onClickUpvote}
          onClickDownVote={onClickDownVote}
        />
      </View>
    </View>
  );
};

export default PostItemView;
