import {View, Text, TextInput, TouchableOpacity} from 'react-native';
import React from 'react';
import {useForm, Controller} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {EducationClass, educationSchema} from '../../lib/zod/EducationSchema';
import {useEducation} from '../../contexts/educationContext';

const Education = () => {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<EducationClass>({
    resolver: zodResolver(educationSchema),
    defaultValues: {},
  });

  const {state, addEducation} = useEducation();

  const onSubmit = async (data: EducationClass) => {
    try {
      await addEducation(data);
    } catch (error: any) {
      //   console.log(error);
    }
  };

  return (
    <View style={{padding: 20}}>
      {/* Location */}
      <Controller
        control={control}
        name="location"
        render={({field: {onChange, onBlur, value}}) => (
          <>
            <TextInput
              placeholder="Location"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={{
                borderWidth: 1,
                borderColor: 'gray',
                marginBottom: 8,
                padding: 8,
              }}
            />
            {errors.location && (
              <Text style={{color: 'red'}}>{errors.location.message}</Text>
            )}
          </>
        )}
      />

      {/* Level */}
      <Controller
        control={control}
        name="level"
        render={({field: {onChange, value}}) => (
          <>
            {/* In React Native you can't use `<select>`. Maybe you use a Picker or custom buttons */}
            <Text>Level</Text>
            <TouchableOpacity onPress={() => onChange('spm')}>
              <Text style={{color: value === 'spm' ? 'blue' : 'black'}}>
                SPM
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onChange('master')}>
              <Text style={{color: value === 'master' ? 'blue' : 'black'}}>
                Master
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onChange('diploma')}>
              <Text style={{color: value === 'diploma' ? 'blue' : 'black'}}>
                Diploma
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onChange('degree')}>
              <Text style={{color: value === 'degree' ? 'blue' : 'black'}}>
                Degree
              </Text>
            </TouchableOpacity>

            {errors.level && (
              <Text style={{color: 'red'}}>{errors.level.message}</Text>
            )}
          </>
        )}
      />

      {/* Submit */}
      <TouchableOpacity
        onPress={handleSubmit(onSubmit)}
        style={{
          marginTop: 20,
          backgroundColor: 'black',
          padding: 10,
          alignItems: 'center',
        }}>
        <Text style={{color: 'white'}}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Education;
