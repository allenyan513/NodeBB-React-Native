import {Button, View} from 'react-native';
import {
  exchangeVerifyToken,
  getCategories,
  getCategoryByCid,
  postTopic,
} from '../service/apis.tsx';
import {useMMKVString} from 'react-native-mmkv';

function DebugView() {
  const [verifyToken, setVerifyToken] = useMMKVString('user.verifyToken');

  return (
    <View
      style={{
        padding: 40,
      }}>
      <Button
        title={'Exchange'}
        onPress={() => {
          exchangeVerifyToken()
            .then(response => {
              const verifyToken = response.data.response.verifyToken;
              console.log('DebugView verifyToken', verifyToken);
              setVerifyToken(verifyToken);
            })
            .catch(error => {});
        }}
      />
      <Button
        title={'getCategories'}
        onPress={async () => {
          const response = await getCategories();
          console.log('getCategories', response.data);
        }}
      />

      <Button
        title={'getCategoryByCid'}
        onPress={async () => {
          const response = await getCategoryByCid(5);
          console.log('getCategories', response.data);
        }}
      />

      <Button
        title={'getCategoryByCid'}
        onPress={async () => {
          const response = await getCategoryByCid(5);
          console.log('getCategories', response.data);
        }}
      />
      <Button
        title={'postTopic'}
        onPress={async () => {
          const response = await postTopic();
          console.log('getCategories', response.data);
        }}
      />
    </View>
  );
}

export default DebugView;
