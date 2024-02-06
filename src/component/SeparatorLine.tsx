import {StyleProp, View, ViewStyle} from 'react-native';
import COLORS from '../colors.tsx';

interface SeparatorLineProps {
  style?: StyleProp<ViewStyle>;
}

const SeparatorLine: React.FC<SeparatorLineProps> = props => {
  return (
    <View
      style={[
        {
          height: 1,
          backgroundColor: COLORS.separatorColor,
        },
        props.style,
      ]}
    />
  );
};
export default SeparatorLine;
