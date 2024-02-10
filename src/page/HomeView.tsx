import {
  Text,
  View,
  ListRenderItem,
  FlatList,
  TouchableWithoutFeedback,
} from 'react-native';
import React, {useEffect, useRef, useState, useContext} from 'react';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import PagerView from 'react-native-pager-view';
import TopicListView from './TopicListView.tsx';
import {HomeTopTab, User} from '../types.tsx';
import CategoryAPI from '../service/categoryAPI.tsx';
import COLORS from '../colors.tsx';
import CurrentAvatarView from '../component/CurrentAvatarView.tsx';
import {useTranslation} from 'react-i18next';
import {useAuth} from '../context/AuthContext.tsx';
import {useNavigation} from '@react-navigation/native';

const HomeView = () => {
  const pagerViewRef = useRef<PagerView | null>(null);
  const {t} = useTranslation();
  const {isAuthAlready, currentUser} = useAuth();
  const navigation = useNavigation();

  const defaultTabs: HomeTopTab[] = [
    {
      cid: 'recent',
      name: t('Recent'),
      selected: false,
    },
    {
      cid: 'popular',
      name: t('Popular'),
      selected: false,
    },
  ];
  const [topTabs, setTopTabs] = useState<HomeTopTab[]>(defaultTabs);

  const query = useQuery({
    queryKey: ['/api/v3/categories'],
    queryFn: async () => {
      const result = await CategoryAPI.getCategories();
      let appendTopTabs: HomeTopTab[] = [];
      for (const item of result.response.categories) {
        appendTopTabs.push({
          cid: item.cid,
          name: item.name,
          selected: false,
        });
      }
      setTopTabs(prevState => {
        return [...prevState, ...appendTopTabs];
      });
      return result.response.categories;
    },
  });

  const renderTabItem: ListRenderItem<HomeTopTab> = props => {
    const onClickTab = () => {
      const newTabs = topTabs.map(tab => {
        tab.selected = tab.cid === props.item.cid;
        return tab;
      });
      setTopTabs(newTabs);
      pagerViewRef?.current?.setPage(props.index);
    };
    return (
      <TouchableWithoutFeedback onPress={onClickTab}>
        <View
          style={{
            padding: 10,
            borderBottomWidth: 2,
            alignItems: 'center',
            justifyContent: 'center',
            borderBottomColor: props.item.selected
              ? COLORS.lighthouseRed
              : 'transparent',
          }}>
          <Text
            style={{
              fontSize: 14,
              textAlign: 'center',
              fontWeight: props.item.selected ? 'bold' : 'normal',
            }}>
            {props.item.name}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  return (
    <View
      style={{
        flex: 1,
      }}>
      <View
        style={{
          flexDirection: 'row',
          paddingLeft: 12,
          paddingRight: 12,
          marginTop: 44,
          height: 54,
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottomWidth: 1,
          borderBottomColor: COLORS.separatorColor,
        }}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
          }}>
          <FlatList
            horizontal={true}
            data={topTabs}
            showsHorizontalScrollIndicator={false}
            renderItem={renderTabItem}
          />
        </View>
        <CurrentAvatarView />
      </View>
      <PagerView
        style={{flex: 1}}
        initialPage={1}
        ref={pagerViewRef}
        onPageScroll={e => {}}
        onPageSelected={e => {
          const currentIndex = e.nativeEvent.position;
          const newTabs = topTabs.map((tab, index) => {
            tab.selected = index === currentIndex;
            return tab;
          });
          setTopTabs(newTabs);
        }}>
        {topTabs.map((tab, index) => {
          return <TopicListView key={index.toString()} cid={tab.cid} />;
        })}
      </PagerView>
    </View>
  );
};

export default HomeView;
