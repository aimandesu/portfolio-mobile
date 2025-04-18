import {View, Text, TouchableOpacity, TextInput} from 'react-native';
import React, {useEffect} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Controller, useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {usePreventNavigation} from '../../../hooks/usePreventNavigationHook';
import {UserSchema, ProfileClass} from '../../../lib/zod/UserSchema';
import {RootStackParamList} from '../../../navigation/AppNavigation';

type EditProfileProps = NativeStackScreenProps<
  RootStackParamList,
  'EditProfile'
>;

const EditProfile = ({navigation, route}: EditProfileProps) => {
  const {userId, profile, onSave} = route.params;

  const {
    control,
    handleSubmit,
    formState: {isDirty},
    watch,
  } = useForm<ProfileClass>({
    resolver: zodResolver(UserSchema),
    defaultValues: profile,
    mode: 'onChange',
  });

  const watchedProfile = watch();

  usePreventNavigation(isDirty, {
    title: 'Discard your changes?',
    description: 'Are you sure you want to discard changes?',
    confirmText: 'Yes, discard',
    cancelText: 'No, keep editing',
  });

  const onSubmit = (data: ProfileClass) => {
    onSave?.(data);
    navigation.goBack();
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          disabled={!isDirty}
          onPress={handleSubmit(onSubmit)}
          style={{opacity: isDirty ? 1 : 0.5}}>
          <Text
            style={{
              marginLeft: 5,
              fontSize: 16,
              color: isDirty ? 'white' : 'gray',
            }}>
            Save
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, handleSubmit, isDirty]);

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>EditProfile for user: {userId}</Text>
      <Controller
        control={control}
        name="name"
        render={({field: {onChange, value}}) => (
          <TextInput
            value={value}
            onChangeText={onChange}
            placeholder="Enter name"
          />
        )}
      />
    </View>
  );
};

export default EditProfile;
