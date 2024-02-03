import {View} from 'react-native';
import COLORS from '../colors.tsx';

const SeparatorLine: React.FC = () => {
  return (
    <View
      style={{
        height: 1,
        backgroundColor: COLORS.separatorColor,
      }}
    />
  );
};
export default SeparatorLine;
