import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  RefreshControl,
  ListRenderItem,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import React, {useEffect, useRef, useState, useContext} from 'react';
import COLORS from '../colors.tsx';
import {Button, Toast} from 'native-base';
import {
  isCancelledError,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import Icon from 'react-native-vector-icons/AntDesign';
import {
  Asset,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import {
  Category,
  KnowledgeEntity,
  MultiMedia,
  PostTopicRequest,
  Topic,
} from '../types.tsx';
import {useMMKV, useMMKVObject} from 'react-native-mmkv';
import {useNavigation} from '@react-navigation/native';
import {isEmpty} from '../utils.tsx';
import AWSHelper from '../service/AWSHepler.tsx';
import TopicAPI from '../service/topicAPI.tsx';
import HeaderView from '../component/HeaderView.tsx';
import SeparatorLine from '../component/SeparatorLine.tsx';
import AddMediaView from '../component/AddMediaView.tsx';

interface CreatePostViewProps {}

/**
 * 发布帖子
 * @param props
 * @constructor
 */
const CreatePostView: React.FC<CreatePostViewProps> = props => {
  const queryClient = useQueryClient();
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = React.useState(false);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const titleTextInputRef = useRef<TextInput>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [selectedAssets, setSelectedAssets] = useState<Asset[]>([]);

  const [defaultCategory, setDefaultCategory] =
    useMMKVObject<Category>('default.category');

  const mutation = useMutation({
    mutationFn: async (postTopicRequest: PostTopicRequest) => {
      const response = await TopicAPI.postTopic(postTopicRequest);
      return response.response;
    },
    onSuccess: (data, variables, context) => {
      Toast.show({
        description: '发布成功',
      });
      navigation.goBack();
    },
    onError: (error, variables, context) => {
      console.error(error);
      Alert.alert('发布失败');
    },
  });

  const isEnablePublish =
    !isEmpty(title) && !isEmpty(content) && defaultCategory !== undefined;

  const onClickPublish = async () => {
    if (isEmpty(title)) {
      Alert.alert('请补充标题');
      return;
    }
    if (isEmpty(content)) {
      Alert.alert('请补充内容');
      return;
    }
    if (defaultCategory === undefined) {
      Alert.alert('请选择分类');
      return;
    }

    setIsUploading(true);

    const multiMedia: MultiMedia = {
      images: [],
      videos: [],
      audios: [],
    };
    if (selectedAssets.length > 0) {
      for (let i = 0; i < selectedAssets.length; i++) {
        const asset = selectedAssets[i];
        const s3Url = await AWSHelper.uploadFile(
          // @ts-ignore
          asset.uri,
          asset.fileName,
          asset.type,
        );
        multiMedia.images.push(s3Url);
      }
    } else {
      console.log('no image');
    }
    const postTopicRequest: PostTopicRequest = {
      cid: defaultCategory.cid,
      title: title,
      content: content,
      multimedia: multiMedia,
    };
    console.log('postTopicRequest', postTopicRequest);
    setIsUploading(false);
    mutation.mutate(postTopicRequest);
  };

  useEffect(() => {
    setTimeout(() => {
      titleTextInputRef?.current?.focus();
    }, 100);
  }, []);

  return (
    <View
      style={{
        flex: 1,
      }}>
      <HeaderView
        title={''}
        leftButton={
          <Icon
            name={'close'}
            size={24}
            color={COLORS.primaryTextColor}
            onPress={() => navigation.goBack()}
          />
        }
        rightButton={
          <Button
            paddingX={24}
            borderRadius={8}
            isLoading={mutation.isPending || isUploading}
            isDisabled={!isEnablePublish}
            isLoadingText={'发布中'}
            colorScheme={'error'}
            onPress={onClickPublish}>
            发布
          </Button>
        }
      />
      <ScrollView
        style={{
          flex: 1,
          paddingLeft: 24,
          paddingRight: 24,
        }}>
        {/*标题*/}
        <TextInput
          style={{
            fontSize: 20,
            fontWeight: 'bold',
            color: COLORS.primaryTextColor,
            marginTop: 24,
            marginBottom: 12,
          }}
          ref={titleTextInputRef}
          numberOfLines={1}
          placeholder="标题"
          placeholderTextColor={COLORS.secondaryTextColor}
          onChangeText={text => setTitle(text)}
        />
        {/*内容*/}
        <TextInput
          style={{
            minHeight: 150,
            color: COLORS.primaryTextColor,
            textAlignVertical: 'auto',
            textAlign: 'left',
            fontSize: 16,
            marginBottom: 12,
          }}
          multiline={true}
          placeholder="内容"
          placeholderTextColor={COLORS.secondaryTextColor}
          onChangeText={text => setContent(text)}
        />
        {/*media bar*/}
        <AddMediaView
          style={{
            marginBottom: 12,
          }}
          onChanged={(assets: Asset[]) => {
            setSelectedAssets(assets);
          }}
        />
        {/*Pick Category*/}
        <SeparatorLine
          style={{
            marginBottom: 12,
          }}
        />
        <TouchableOpacity
          onPress={() => {
            // @ts-ignore
            navigation.navigate('SelectCategory', {
              onGoBack: (category: Category) => {
                console.log('onGoBack', category.cid);
                setDefaultCategory(category);
              },
            });
          }}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontSize: 14,
                color: COLORS.primaryTextColor,
              }}>
              分类版块
            </Text>
            <Text>{defaultCategory ? defaultCategory.name : '未选择 >'}</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default CreatePostView;
