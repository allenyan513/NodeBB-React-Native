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
  Button,
  ScrollView,
  Alert,
} from 'react-native';
import React, {useEffect, useRef, useState, useContext} from 'react';
import COLORS from '../colors.tsx';
import {
  isCancelledError,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import Icon from 'react-native-vector-icons/AntDesign';
import HeaderView from '../component/HeaderView.tsx';
import {
  Asset,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import {Category, KnowledgeEntity, PostTopicRequest, Topic} from '../types.tsx';
import {useMMKV, useMMKVObject} from 'react-native-mmkv';
import {useNavigation} from '@react-navigation/native';
import {isEmpty} from '../utils.tsx';
import AWSHelper from '../service/AWSHepler.tsx';
import TopicAPI from '../service/topicAPI.tsx';

interface CreatePostViewProps {}

const CreatePostView: React.FC<CreatePostViewProps> = props => {
  const queryClient = useQueryClient();
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = React.useState(false);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedAssets, setSelectedAssets] = useState<Asset[]>([]);
  const titleTextInputRef = useRef<TextInput>(null);

  const [defaultCategory, setDefaultCategory] =
    useMMKVObject<Category>('default.category');

  const mutation = useMutation({
    mutationFn: async (newData: {
      title: string;
      content: string;
      cid: number;
    }) => {
      const newTopic: PostTopicRequest = {
        title: newData.title,
        content: newData.content,
        cid: newData.cid,
      };
      const response = await TopicAPI.postTopic(newTopic);
      return response.response;
    },
    onSuccess: (data, variables, context) => {
      Alert.alert(
        '发帖成功',
        '',
        [
          {
            text: 'Ok',
            onPress: () => {
              navigation.goBack();
              // // @ts-ignore
              // navigation.navigate('TopicDetail', {
              //   tid: data?.tid,
              // });
            },
          },
        ],
        {cancelable: false},
      );
    },
    onError: (error, variables, context) => {
      console.error(error);
      Alert.alert('发帖失败');
    },
  });

  const onClickLaunchPicker = async () => {
    launchImageLibrary({mediaType: 'photo', selectionLimit: 9}, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        console.log('response', response);
        //判断如果图片超过9张，就不添加了
        // @ts-ignore
        if (selectedAssets.length + response.assets.length > 9) {
          Alert.alert('最多只能选择9张图片');
          return;
        }
        // @ts-ignore
        setSelectedAssets(prevState => {
          // @ts-ignore
          return [...prevState, ...response.assets];
        });
      }
    });
  };

  const renderItem: ListRenderItem<Asset> = ({item}) => {
    return (
      <TouchableOpacity
        onLongPress={() => {
          //remove
          Alert.alert('是否移除这张图片?', '', [
            {
              text: 'Cancel',
              onPress: () => {},
            },
            {
              text: 'Ok',
              onPress: () => {
                setSelectedAssets(prevState => {
                  return prevState.filter(asset => asset.uri !== item.uri);
                });
              },
            },
          ]);
        }}>
        <Image
          source={{uri: item.uri}}
          style={{
            borderRadius: 6,
            borderWidth: 1,
            borderColor: 'lightgray',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 12,
            width: 200,
            height: 200,
          }}
        />
      </TouchableOpacity>
    );
  };
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

    //如果有图片，先上传图片，然后获取urlList
    let appendContent = '';
    if (selectedAssets.length > 0) {
      //上传所有图片，获取urlList
      let s3UrlList = [];
      for (let i = 0; i < selectedAssets.length; i++) {
        console.log(`uploading...${i}`);
        const asset = selectedAssets[i];
        const s3Url = await AWSHelper.uploadFile(
          // @ts-ignore
          asset.uri,
          asset.fileName,
          asset.type,
        );
        s3UrlList.push(s3Url);
      }
      // 遍历 s3UrlList 在content 前面插入 ![url](url)
      for (let i = 0; i < s3UrlList.length; i++) {
        appendContent += `![${s3UrlList[i]}](${s3UrlList[i]})\n\n`;
      }
    } else {
      console.log('no image');
    }

    mutation.mutate({
      title: title,
      content: appendContent + content,
      cid: defaultCategory.cid,
    });
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
        paddingLeft: 12,
        paddingRight: 12,
      }}>
      <HeaderView
        title={'Create Post'}
        onClickRightButton={onClickPublish}
        rightText={'Publish'}
      />
      <ScrollView
        style={{
          flex: 1,
        }}>
        <TextInput
          style={{
            fontSize: 20,
            fontWeight: 'bold',
            color: COLORS.primaryTextColor,
            padding: 12,
          }}
          ref={titleTextInputRef}
          numberOfLines={1}
          placeholder="Title"
          placeholderTextColor={COLORS.secondaryTextColor}
          onChangeText={text => setTitle(text)}
        />
        <TextInput
          style={{
            minHeight: 150,
            padding: 12,
            color: COLORS.primaryTextColor,
            textAlignVertical: 'auto',
            textAlign: 'left',
            fontSize: 16,
          }}
          multiline={true}
          placeholder="body of text"
          placeholderTextColor={COLORS.secondaryTextColor}
          onChangeText={text => setContent(text)}
        />
        {/*media bar*/}
        <View
          style={{
            flexDirection: 'row',
            padding: 12,
          }}>
          <Icon
            style={{
              padding: 12,
              borderWidth: 1,
              borderColor: 'lightgray',
              borderRadius: 6,
              marginRight: 12,
            }}
            name={'picture'}
            size={24}
            color={COLORS.primaryTextColor}
            onPress={onClickLaunchPicker}
          />
          <Icon
            style={{
              padding: 12,
              borderWidth: 1,
              borderRadius: 6,
              borderColor: 'lightgray',
            }}
            name={'camera'}
            size={24}
            color={COLORS.primaryTextColor}
            onPress={() => {}}
          />
        </View>
        <FlatList
          style={{
            padding: 12,
          }}
          data={selectedAssets}
          horizontal={true}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={() => <View style={{width: 12}} />}
          renderItem={renderItem}
        />
        {/*Pick Category*/}
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
              padding: 12,
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
