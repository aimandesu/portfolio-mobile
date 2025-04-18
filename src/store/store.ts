// import AsyncStorage from '@react-native-async-storage/async-storage/lib/typescript/AsyncStorage';
import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import {ProfileClass, UserSchema} from '../lib/zod/UserSchema';
import {z} from 'zod';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ProfileInitial: ProfileClass = {
  username: '',
  id: 0,
  name: '',
  age: 0,
  title: null,
  about: null,
  location: null,
  image: null,
  address: null,
  email: '',
  resume: null,
};

type ProfileStore = {
  profile: ProfileClass | null;
  token: string | null;
  _hasHydrated: boolean;
  signup: (
    username: string,
    name: string,
    email: string,
    password: string,
    passwordConfirmation: string,
  ) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updatedProfile: ProfileClass) => Promise<void>;
  uploadImage: (imageFile: File) => Promise<void>;
  uploadResume: (resume: File) => Promise<void>;
  resetStorage: () => void;
};

export const useProfileStore = create<ProfileStore>()(
  persist(
    set => ({
      profile: null,
      token: null,
      _hasHydrated: false,
      resetStorage: () => set({profile: null, token: null}),
      signup: async (username, name, email, password, passwordConfirmation) => {
        try {
          const response = await fetch(
            'http://10.0.2.2:8000/api/auth/register',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                username,
                name,
                email,
                password,
                password_confirmation: passwordConfirmation,
              }),
            },
          );

          const data = await response.json();

          if (data.error) {
            throw new Error(data.error);
          }

          const {user, token} = data.data;

          const profile = UserSchema.parse(user);

          set({
            profile,
            token,
          });
        } catch (error: any) {
          if (error instanceof z.ZodError) {
            throw new Error(`Validation error: ${error.message}`);
          }
          throw new Error(error);
        }
      },
      login: async (email, password) => {
        try {
          const response = await fetch('http://10.0.2.2:8000/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({email, password}),
          });
          const data = await response.json();

          if (data.error) {
            throw new Error(data.error); //from json
          }

          const {user, token} = data.data;
          const profile = UserSchema.parse(user);

          set({
            profile: profile,
            token: token,
          });
        } catch (error: any) {
          if (error instanceof z.ZodError) {
            throw new Error(`Validation error: ${error.message}`);
          }
          throw new Error(error);
        }
      },
      logout: async () => {
        const {token} = useProfileStore.getState();
        try {
          await fetch('http://10.0.2.2:8000/api/auth/logout', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });
          set({
            profile: null,
            token: null,
          });
        } catch (error) {
          console.error('Error logout profile:', error);
        }
      },
      updateProfile: async profile => {
        try {
          const {token} = useProfileStore.getState();
          if (!token) {
            throw new Error('No token available');
          }

          const response = await fetch(
            `http://10.0.2.2:8000/api/users/${profile.id}`,
            {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: `Bearer ${token}`,
              },
              body: new URLSearchParams({
                username: profile.username,
                name: profile.name,
                title: profile.title || '',
                age: profile.age?.toString() || '',
                location: profile.location || '',
                address: profile.address || '',
                email: profile.email || '',
                about: profile.about || '',
              }).toString(),
            },
          );

          const {error, data} = await response.json();

          if (error) {
            throw new Error(error); //from json
          }

          const updatedProfile = UserSchema.parse(data);

          set({profile: updatedProfile});
        } catch (error: any) {
          throw new Error(error);
        }
      },
      uploadImage: async imageFile => {
        const {profile, token} = useProfileStore.getState();
        try {
          if (!token) {
            throw new Error('No token available');
          }
          const formData = new FormData();
          formData.append('image', imageFile);

          const response = await fetch(
            `http://10.0.2.2:8000/api/users/${profile?.id}/uploadImage`,
            {
              method: 'POST',
              body: formData,
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          if (!response.ok) throw new Error('Upload failed');
          const data = await response.json();

          set({
            profile: UserSchema.parse({
              ...profile,
              image: data.data.image,
            }),
          });
        } catch (error: any) {
          console.log(error);
          throw new Error(error);
        }
      },
      uploadResume: async (resume: File) => {
        const {profile, token} = useProfileStore.getState();
        try {
          const formData = new FormData();

          if (resume && resume instanceof File) {
            formData.append('resume', resume);
          }

          const response = await fetch(
            `http://10.0.2.2:8000/api/users/${profile?.id}/uploadResume`,
            {
              method: 'POST',
              body: formData,
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          if (!response.ok) {
            throw new Error(`Failed to upload resume: ${response.statusText}`);
          }

          const data = await response.json();

          set({
            profile: UserSchema.parse({
              ...profile,
              resume: data.data.resume,
            }),
          });
        } catch (error: any) {
          throw new Error(error);
        }
      },
    }),
    {
      name: 'user-auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => () => {
        useProfileStore.setState({_hasHydrated: true});
      },
    },
  ),
);
