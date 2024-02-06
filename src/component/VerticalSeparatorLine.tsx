import {View} from 'react-native';
import COLORS from '../colors.tsx';

const VerticalSeparatorLine: React.FC = () => {
  return (
    <View
      style={{
        width: 1,
        margin: 1,
        height: '100%',
        backgroundColor: COLORS.separatorColor,
      }}
    />
  );
};
export default VerticalSeparatorLine;
