import {Text, useWindowDimensions, View} from 'react-native';
import {Post, Topic} from '../types.tsx';
import React from 'react';
import RenderHTML from 'react-native-render-html';
import {Avatar} from 'native-base';
import Icon from 'react-native-vector-icons/AntDesign';
import COLORS from '../colors.tsx';

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
  const isFirst = index === 0;
  const isOdd = index % 2 === 0;

  return (
    <View
      style={{
        padding: 10,
        backgroundColor: isOdd ? COLORS.ffffff : COLORS.f9f9f9,
      }}>
      {/*用户头像 & 用户昵称 & 发布时间*/}
      {!isFirst && (
        <View
          style={{
            flexDirection: 'row',
          }}>
          <Avatar size={'sm'} source={{uri: post.user.picture}} />
          <Text> {post.user.username} </Text>
          <Text> {post.timestampISO} </Text>
        </View>
      )}
      <RenderHTML
        contentWidth={useWindowDimensions().width}
        source={{html: post.content}}
      />
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
  );
};

export default PostItemView;
