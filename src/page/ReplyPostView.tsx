import {
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  ListRenderItem,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import React, {useEffect, useRef, useState, useContext} from 'react';
import COLORS from '../colors.tsx';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import Icon from 'react-native-vector-icons/AntDesign';
import HeaderView from '../component/HeaderView.tsx';
import {
  Asset,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import {useNavigation} from '@react-navigation/native';
import {isEmpty} from '../utils.tsx';
import AWSHelper from '../service/AWSHepler.tsx';

interface ReplyPostViewProps {}

const ReplyPostView: React.FC<ReplyPostViewProps> = props => {
  const queryClient = useQueryClient();
  const navigation = useNavigation();
  const [content, setContent] = useState('');
  const [selectedAssets, setSelectedAssets] = useState<Asset[]>([]);
  const textInputRef = useRef<TextInput>(null);

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
    if (isEmpty(content)) {
      Alert.alert('请补充内容');
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
  };

  useEffect(() => {
    setTimeout(() => {
      textInputRef?.current?.focus();
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
            minHeight: 50,
            padding: 12,
            color: COLORS.primaryTextColor,
            backgroundColor: 'red',
            textAlignVertical: 'auto',
            textAlign: 'left',
            fontSize: 16,
          }}
          ref={textInputRef}
          multiline={true}
          placeholder="comment"
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
      </ScrollView>
    </View>
  );
};

export default ReplyPostView;
