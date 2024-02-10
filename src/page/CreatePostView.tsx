import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import React, {useEffect, useRef, useState, useContext} from 'react';
import COLORS from '../colors.tsx';
import {Button, Toast} from 'native-base';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import Icon from 'react-native-vector-icons/AntDesign';
import {Asset} from 'react-native-image-picker';
import {Category, MultiMedia, PostTopicRequest} from '../types.tsx';
import {useMMKVObject} from 'react-native-mmkv';
import {useNavigation} from '@react-navigation/native';
import {isEmpty} from '../utils.tsx';
import AWSHelper from '../service/AWSHepler.tsx';
import TopicAPI from '../service/topicAPI.tsx';
import HeaderView from '../component/HeaderView.tsx';
import SeparatorLine from '../component/SeparatorLine.tsx';
import AddMediaView from '../component/AddMediaView.tsx';
import {useTranslation} from 'react-i18next';

interface CreatePostViewProps {}

/**
 * 发布帖子
 * @param props
 * @constructor
 */
const CreatePostView: React.FC<CreatePostViewProps> = props => {
  const {t} = useTranslation();
  const navigation = useNavigation();
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
        description: t('Post success'),
      });
      //关闭这个页面，打开主题详情页 TopicDetailView topic.tid
      navigation.goBack();
      // @ts-ignore
      navigation.navigate('TopicDetail', {
        tid: data.tid,
      });
    },
    onError: (error, variables, context) => {
      console.error(error);
      Alert.alert(t('Post failed'));
    },
  });

  const isEnablePublish =
    !isEmpty(title) && !isEmpty(content) && defaultCategory !== undefined;

  const onClickPublish = async () => {
    if (!isEnablePublish) {
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
            borderRadius={8}
            size={'sm'}
            isLoading={mutation.isPending || isUploading}
            isDisabled={!isEnablePublish}
            isLoadingText={t('Publishing')}
            colorScheme={'green'}
            onPress={onClickPublish}>
            {t('Publish')}
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
          placeholder={t('Title')}
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
          placeholder={t('What do you want to say?')}
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
              {t('Select Category')}
            </Text>
            <Text>
              {defaultCategory ? defaultCategory.name : t('No selected')}
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default CreatePostView;
