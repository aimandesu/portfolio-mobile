import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useForm, Controller} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {launchImageLibrary} from 'react-native-image-picker';
import {usePreventNavigation} from '../../../hooks/usePreventNavigationHook';
import {UserSchema, ProfileClass} from '../../../lib/zod/UserSchema';
import {RootStackParamList} from '../../../navigation/AppNavigation';
import {useTheme} from '@react-navigation/native';
import {keepLocalCopy, pick, types} from '@react-native-documents/picker';
import {RNFile, useProfileStore} from '../../../store/store';
import Clipboard from '@react-native-clipboard/clipboard';

type EditProfileProps = NativeStackScreenProps<
  RootStackParamList,
  'EditProfile'
>;

const EditProfile = ({navigation, route}: EditProfileProps) => {
  const {profile} = route.params;
  const {updateProfile, uploadImage, uploadResume} = useProfileStore();
  const {colors} = useTheme();

  const [imageFile, setImageFile] = useState<RNFile | null>(null);
  const [resumeFile, setResumeFile] = useState<RNFile | null>(null);
  const [isSuccessfullySubmitted, setIsSuccessfullySubmitted] =
    useState<boolean>(false);

  useEffect(() => {
    if (isSuccessfullySubmitted) {
      navigation.goBack();
    }
  }, [isSuccessfullySubmitted, navigation]);

  const {
    control,
    handleSubmit,
    setValue,
    formState: {isDirty},
  } = useForm<ProfileClass>({
    resolver: zodResolver(UserSchema),
    defaultValues: profile,
    mode: 'onChange',
  });

  usePreventNavigation(isDirty && !isSuccessfullySubmitted, {
    title: 'Discard your changes?',
    description: 'Are you sure you want to discard changes?',
    confirmText: 'Yes, discard',
    cancelText: 'No, keep editing',
  });

  const onSubmit = async (data: ProfileClass) => {
    // onSave?.(data);
    try {
      await updateProfile(data);
      if (imageFile) {
        await uploadImage(imageFile);
      }

      if (resumeFile) {
        await uploadResume(resumeFile);
      }
      setIsSuccessfullySubmitted(true);
    } catch (error: any) {
      console.log(error);
    }
  };

  const handlePickImage = () => {
    launchImageLibrary({mediaType: 'photo', selectionLimit: 1}, response => {
      if (response.assets && response.assets.length > 0) {
        const asset = response.assets[0];
        if (asset.uri) {
          // Create a file object for the image
          const file = {
            uri: asset.uri,
            type: asset.type || 'image/jpeg',
            name: asset.fileName || `image-${Date.now()}.jpg`,
          };
          setImageFile(file);
          setValue('image', file, {shouldDirty: true});
        }
      }
    });
  };

  const handlePickResume = async () => {
    try {
      const [file] = await pick({
        allowMultiSelection: false,
        type: [types.pdf],
      });

      // Create a local copy (optional, depending on your needs)
      const [localCopy] = await keepLocalCopy({
        files: [
          {
            uri: file.uri,
            fileName: file.name || `resume-${Date.now()}.pdf`,
          },
        ],
        destination: 'documentDirectory',
      });

      // Create a file object for the resume
      const resume = {
        uri: file.uri,
        type: file.type || 'application/pdf',
        name: file.name || `resume-${Date.now()}.pdf`,
      };

      setValue('resume', resume, {shouldDirty: true});

      setResumeFile(resume);
    } catch (err) {
      console.error('Error picking resume:', err);
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          disabled={!isDirty}
          onPress={handleSubmit(onSubmit)}
          style={{opacity: isDirty ? 1 : 0.5, marginRight: 10}}>
          <Text style={{color: isDirty ? colors.text : 'gray'}}>Save</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, handleSubmit, isDirty]);

  return (
    <ScrollView
      contentContainerStyle={{padding: 16, paddingBottom: 40}}
      keyboardShouldPersistTaps="handled">
      <View style={{display: 'flex', flexDirection: 'row'}}>
        <Controller
          control={control}
          name="image"
          render={({field: {value, onChange}}) => (
            <TouchableOpacity onPress={handlePickImage}>
              <View
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  borderWidth: 1,
                  borderStyle: 'solid',
                  borderColor: colors.text,
                  justifyContent: value ? undefined : 'center',
                  alignItems: 'center',
                }}>
                {value ? (
                  <Image
                    source={{
                      uri:
                        typeof value === 'string'
                          ? `http://10.0.2.2:8000/storage/${value}` // backend image stored as just filename
                          : value.uri, // RNFile object
                    }}
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: 50,
                      marginBottom: 10,
                    }}
                  />
                ) : (
                  <Text style={{color: colors.text}}>pick image</Text>
                )}
              </View>
            </TouchableOpacity>
          )}
        />
        <View style={{width: 10}} />
        <Controller
          control={control}
          name="resume"
          render={({field: {value}}) => {
            const resumeUrl = typeof value === 'string' ? value : value?.uri;

            return (
              <View style={{gap: 8, flexGrow: 1}}>
                {/* Upload PDF Button */}
                <TouchableOpacity onPress={handlePickResume}>
                  <View
                    style={{
                      borderWidth: 1,
                      borderColor: '#ccc',
                      padding: 12,
                      borderRadius: 8,
                      backgroundColor: '#f9f9f9',
                    }}>
                    <Text style={{color: '#555', textAlign: 'center'}}>
                      {resumeUrl ? 'Change PDF' : 'Upload PDF'}
                    </Text>
                  </View>
                </TouchableOpacity>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: '#ccc',
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: 8,
                    backgroundColor: '#f9f9f9',
                  }}>
                  <Text
                    style={{
                      flex: 1,
                      fontSize: 12,
                      color: '#333',
                    }}
                    numberOfLines={1}
                    ellipsizeMode="middle">
                    {typeof value === 'string'
                      ? `http://10.0.2.2:8000/storage/${resumeUrl}`
                      : ''}
                  </Text>

                  {/* Copy Button */}
                  <TouchableOpacity
                    onPress={() => {
                      Clipboard.setString(
                        resumeUrl == ''
                          ? ''
                          : `http://10.0.2.2:8000/storage/${resumeUrl}`,
                      );
                      // Show toast if you want
                    }}
                    style={{
                      marginLeft: 8,
                      padding: 8,
                      backgroundColor: '#eee',
                      borderRadius: 6,
                    }}>
                    <Text style={{fontSize: 12}}>Copy</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
        />
      </View>
      <Text style={{color: colors.text}}>Username</Text>
      <Controller
        control={control}
        name="username"
        render={({field: {value, onChange}}) => (
          <TextInput
            value={value}
            onChangeText={onChange}
            placeholder="Username"
            style={styles.input}
          />
        )}
      />

      {/* Name */}
      <Text style={{color: colors.text}}>Name</Text>
      <Controller
        control={control}
        name="name"
        render={({field: {value, onChange}}) => (
          <TextInput
            value={value}
            onChangeText={onChange}
            placeholder="Name"
            style={styles.input}
          />
        )}
      />

      {/* Title */}
      <Text style={{color: colors.text}}>Title</Text>
      <Controller
        control={control}
        name="title"
        render={({field: {value, onChange}}) => (
          <TextInput
            value={value ?? ''}
            onChangeText={onChange}
            placeholder="Title"
            style={styles.input}
          />
        )}
      />

      {/* About */}
      <Text style={{color: colors.text}}>About</Text>
      <Controller
        control={control}
        name="about"
        render={({field: {value, onChange}}) => (
          <TextInput
            value={value ?? ''}
            onChangeText={onChange}
            placeholder="About"
            style={[styles.input, {height: 80}]}
            multiline
          />
        )}
      />

      {/* Location */}
      <Text style={{color: colors.text}}>Location</Text>
      <Controller
        control={control}
        name="location"
        render={({field: {value, onChange}}) => (
          <TextInput
            value={value ?? ''}
            onChangeText={onChange}
            placeholder="Location"
            style={styles.input}
          />
        )}
      />

      {/* Address */}
      <Text style={{color: colors.text}}>Address</Text>
      <Controller
        control={control}
        name="address"
        render={({field: {value, onChange}}) => (
          <TextInput
            value={value ?? ''}
            onChangeText={onChange}
            placeholder="Address"
            style={styles.input}
          />
        )}
      />

      {/* Email */}
      <Text style={{color: colors.text}}>Email</Text>
      <Controller
        control={control}
        name="email"
        render={({field: {value, onChange}}) => (
          <TextInput
            value={value}
            onChangeText={onChange}
            placeholder="Email"
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        )}
      />

      {/* Age */}
      <Text style={{color: colors.text}}>Age</Text>
      <Controller
        control={control}
        name="age"
        render={({field: {value, onChange}}) => (
          <TextInput
            value={value ? String(value) : ''}
            onChangeText={text => onChange(Number(text))}
            placeholder="Age"
            style={styles.input}
            keyboardType="numeric"
          />
        )}
      />
    </ScrollView>
  );
};

export default EditProfile;

const styles = {
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#eee',
  },
  uploadBox: {
    width: 120,
    height: 120,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    //   justifyContent: 'center',
    //   alignItems: 'center',
    marginBottom: 16,
  },
};
