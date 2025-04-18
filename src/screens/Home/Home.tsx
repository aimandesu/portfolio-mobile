import {View, Text, Button} from 'react-native';
import React from 'react';
import {useProfileStore} from '../../store/store';
import {useTheme} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const Home = () => {
  const {profile, logout, resetStorage} = useProfileStore();
  const insets = useSafeAreaInsets();
  const {colors} = useTheme();

  return (
    <View
      style={{
        flex: 1,
        // justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
        // backgroundColor: 'red',
      }}>
      <Button onPress={() => logout()} title={'Log out'} />
      <Button onPress={() => resetStorage()} title={'Reset storage'} />

      <Text style={{color: colors.text}}>{profile?.name}</Text>
    </View>
  );
};

export default Home;
