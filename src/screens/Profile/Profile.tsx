import {View, Text, Button, TouchableOpacity} from 'react-native';
import React from 'react';
import {ProfileInitial, useProfileStore} from '../../store/store';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {layoutSafeArea} from '../../utils/CustomStyles';
import {useNavigation, useTheme} from '@react-navigation/native';
import {Image} from 'react-native';
import {faPencil} from '@fortawesome/free-solid-svg-icons/faPencil';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {AuthScreenNavigationProp} from '../../navigation/AppNavigation';
import {EducationProvider} from '../../contexts/educationContext';
import Education from '../Education/Education';

const Profile = () => {
  const {profile, logout} = useProfileStore();
  const {colors, custom} = useTheme();
  const area = layoutSafeArea({
    right: 10,
    left: 10,
  });

  const navigation = useNavigation<AuthScreenNavigationProp>();

  return (
    <View style={area.safeArea}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
        }}>
        <Image
          source={{
            uri:
              typeof profile?.image === 'string'
                ? `http://10.0.2.2:8000/storage/${profile?.image ?? ''}`
                : 'https://static.vecteezy.com/system/resources/thumbnails/025/221/361/small_2x/cartoon-cat-cute-ai-generate-png.png',
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
        <View style={{width: 10}} />
        <View
          style={{
            padding: 10,
          }}>
          <Text
            style={{
              color: custom.absoluteWhite,
              backgroundColor: custom.backgroundContainer,
              height: 'auto',
              borderRadius: 20,
              paddingHorizontal: 5,
            }}>
            {profile?.age ?? 'Age years old'}
          </Text>
        </View>
      </View>
      <View style={{height: 10}} />
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('EditProfile', {
            profile: {
              ...profile,
              username: profile?.username ?? '',
              id: profile?.id ?? 0,
              name: profile?.name ?? '',
              email: profile?.email ?? '',
            },
            // onSave: profile => {
            //   // Update your state or API here
            //   // console.log('Saved with new status:', newStatus);
            // },
          });
        }}
        style={{
          display: 'flex',
          flexDirection: 'row',
          padding: 10,
          borderRadius: 10,
          backgroundColor: custom.backgroundContainer,
          justifyContent: 'space-between',
        }}>
        <Text style={{color: custom.absoluteWhite}}>
          {profile?.title ?? 'Title'}
        </Text>
        <FontAwesomeIcon icon={faPencil} color={custom.absoluteWhite} />
      </TouchableOpacity>
      <View style={{height: 10}} />
      <View
        style={{
          padding: 10,
          borderRadius: 10,
          backgroundColor: custom.backgroundContainer,
        }}>
        <Text style={{color: custom.absoluteWhite}}>
          {profile?.address ?? 'Address, '}
          {profile?.location ?? 'Location'}
        </Text>
        <Text style={{color: custom.absoluteWhite}}>
          {profile?.about ?? 'About'}
        </Text>
        <Text style={{color: custom.absoluteWhite}}>
          {profile?.email ?? 'Email'}
        </Text>
      </View>
      <EducationProvider>
        <Education />
      </EducationProvider>
    </View>
  );
};

export default Profile;
