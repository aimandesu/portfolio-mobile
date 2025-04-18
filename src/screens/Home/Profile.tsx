import {View, Text, Button, TouchableOpacity} from 'react-native';
import React from 'react';
import {useProfileStore} from '../../store/store';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {layoutSafeArea} from '../../utils/CustomStyles';
import {useTheme} from '@react-navigation/native';
import {Image} from 'react-native';

const Profile = () => {
  const {profile, logout} = useProfileStore();
  const {colors, custom} = useTheme();
  const area = layoutSafeArea(); //then we can do something like top: 100

  return (
    <View style={area.safeArea}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          paddingHorizontal: 10,
        }}>
        <Image
          source={{
            uri:
              profile?.image ??
              'https://static.vecteezy.com/system/resources/thumbnails/025/221/361/small_2x/cartoon-cat-cute-ai-generate-png.png',
          }}
          style={{width: 60, height: 60, borderRadius: 25}}
        />
        <View style={{width: 10}} />
        <View
          style={{
            display: 'flex',
          }}>
          <Text
            style={{
              color: colors.text,
            }}>
            {profile?.name}
          </Text>
          <Text
            style={{
              color: colors.text,
            }}>
            {profile?.username}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={{
          margin: 10,
          padding: 10,
          borderRadius: 10,
          backgroundColor: custom.backgroundContainer,
        }}>
        <Text style={{color: custom.absoluteWhite}}>test</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Profile;
