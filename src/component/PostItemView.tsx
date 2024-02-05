import {
  Image,
  ListRenderItem,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import {Post, Topic} from '../types.tsx';
import React from 'react';
import RenderHTML from 'react-native-render-html';
import {Avatar} from 'native-base';
import Icon from 'react-native-vector-icons/AntDesign';

interface PostItemProps {
  post: Post;
}

const PostItemView: React.FC<PostItemProps> = ({post}) => {
  return (
    <View
      style={{
        padding: 10,
      }}>
      <View
        style={{
          flexDirection: 'row',
        }}>
        <Avatar
          size={'sm'}
          source={{uri: post.user.picture}} />

        <Text> {post.user.username} </Text>
        <Text> {post.timestampISO} </Text>
      </View>
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
