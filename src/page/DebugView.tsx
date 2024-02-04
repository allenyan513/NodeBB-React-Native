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
            })
            .catch(error => {});
        }}
      />

    </View>
  );
}

export default DebugView;
