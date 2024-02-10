import {Text, View} from 'react-native';
import React from 'react';
import {useTranslation} from 'react-i18next';

const NoMoreDataView = () => {
  const {t} = useTranslation();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        padding: 10,
        alignItems: 'center',
      }}>
      {/*<Text>{t('No more data')}</Text>*/}
    </View>
  );
};
export default NoMoreDataView;
