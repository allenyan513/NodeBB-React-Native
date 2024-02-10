import {View, FlatList, RefreshControl, ListRenderItem} from 'react-native';
import React, {useEffect, useRef, useState, useContext} from 'react';

import {useQuery, useQueryClient} from '@tanstack/react-query';
import SeparatorLine from '../component/SeparatorLine.tsx';
import NotificationItemView from '../component/NotificationItemView.tsx';
import UserAPI from '../service/userAPI.tsx';
import HeaderView from '../component/HeaderView.tsx';
import {useTranslation} from 'react-i18next';
import EmptyView from '../component/EmptyView.tsx';

interface NotificationsViewProps {}

const NotificationsView: React.FC<NotificationsViewProps> = props => {
  const {t} = useTranslation();
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = React.useState(false);
  const {isPending, isError, error, data} = useQuery({
    queryKey: ['/api/notifications'],
    queryFn: async () => {
      const result = await UserAPI.getNotifications();
      return result.notifications;
    },
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({
      queryKey: ['/api/notifications'],
    });
    setRefreshing(false);
  };

  return (
    <View
      style={{
        flex: 1,
      }}>
      <HeaderView
        style={{
          marginTop: 44,
        }}
        title={t('Notification')}
      />
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
        }}>
        <FlatList
          style={{
            flex: 1,
          }}
          data={data}
          renderItem={props => {
            return <NotificationItemView data={props.item} />;
          }}
          keyExtractor={(item, index) => index.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ItemSeparatorComponent={() => {
            return <SeparatorLine />;
          }}
          ListEmptyComponent={() => {
            return <EmptyView />;
          }}
        />
      </View>
    </View>
  );
};

export default NotificationsView;
