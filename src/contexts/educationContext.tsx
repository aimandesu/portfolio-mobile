import {createContext, useContext, useState} from 'react';
import {useProfileStore} from '../store/store';
import {EducationClass, educationSchema} from '../lib/zod/EducationSchema';
import {z} from 'zod';

export enum EducationStatus {
  INITIAL = 'initial',
  LOADING = 'loading',
  COMPLETED = 'completed',
  ERROR = 'error',
}

export interface EducationState {
  educationList: EducationClass[];
  status: EducationStatus;
  error?: string;
}

export interface EducationContextType {
  getEducation: (userId: number) => Promise<void>;
  addEducation: (education: EducationClass) => Promise<void>;
  deleteEducation: (educationId: number) => Promise<void>;
  state: EducationState;
}

const EducationContext = createContext<EducationContextType | undefined>(
  undefined,
);

export const EducationProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [state, setState] = useState<EducationState>({
    educationList: [],
    status: EducationStatus.INITIAL,
  });

  const addEducation = async (education: EducationClass) => {
    setState(prev => ({...prev, status: EducationStatus.LOADING}));
    try {
      const {token} = useProfileStore.getState();
      const formData = new FormData();
      formData.append('location', education.location);
      formData.append('level', education.level);
      formData.append('achievement', education.achievement);

      const response = await fetch('http://10.0.2.2:8000/api/education', {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // if (!response.ok) {
      //   throw new Error("Failed to add education");
      // }

      const newEducation = await response.json();

      if (newEducation.error) {
        throw new Error(newEducation.error);
      }

      const parsedEducation = educationSchema.parse(newEducation.data);

      setState(prev => ({
        educationList: [...prev.educationList, parsedEducation],
        status: EducationStatus.COMPLETED,
      }));
    } catch (error: any) {
      console.log(error);
      setState(prev => ({
        ...prev,
        status: EducationStatus.ERROR,
        error: error.message || 'Something went wrong',
      }));
      throw new Error(error);
    }
  };

  const deleteEducation = async (id: number) => {
    const {token} = useProfileStore.getState();

    setState(prev => ({...prev, status: EducationStatus.LOADING}));
    try {
      const response = await fetch(`http://10.0.2.2:8000/api/education/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete education data');
      }

      setState(prev => ({
        educationList: prev.educationList.filter(edu => edu.id !== id),
        status: EducationStatus.COMPLETED,
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        status: EducationStatus.ERROR,
        error: error.message || 'Failed to delete education',
      }));
      throw new Error(error);
    }
  };

  const getEducation = async (userId: number) => {
    try {
      setState(prev => ({...prev, status: EducationStatus.LOADING}));

      const response = await fetch(
        `http://10.0.2.2:8000/api/education/user/${userId}`,
      );

      if (!response.ok) {
        throw new Error('Failed to fetch education data');
      }

      const data = await response.json();

      // Validate the structure with Zod
      const educationList = z.array(educationSchema).parse(data.data);

      setState({
        educationList,
        status: EducationStatus.COMPLETED,
      });
    } catch (e: any) {
      setState(prev => ({
        ...prev,
        status: EducationStatus.ERROR,
        error: e.message ?? 'An error occurred',
      }));
      throw new Error(e);
    }
  };

  return (
    <EducationContext.Provider
      value={{getEducation, addEducation, deleteEducation, state}}>
      {children}
    </EducationContext.Provider>
  );
};

export const useEducation = (): EducationContextType => {
  const context = useContext(EducationContext);
  if (!context) throw new Error('useEducation must be used within a Provider');
  return context;
};
