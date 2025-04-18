// dynamicLayout.ts
import {StyleSheet} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

interface Insets {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
}

export const layoutSafeArea = (customInsets: Insets = {}) => {
  const insets = useSafeAreaInsets();

  const {
    top = insets.top,
    bottom = insets.bottom,
    left = insets.left,
    right = insets.right,
  } = customInsets;

  return StyleSheet.create({
    safeArea: {
      flex: 1,
      paddingTop: top,
      paddingBottom: bottom,
      paddingLeft: left,
      paddingRight: right,
    },
  });
};

interface CustomText {}
