import React from 'react';
import { TextInput, View } from 'react-native';
import { useFormContext, Controller } from 'react-hook-form';
import { z } from 'zod';
import { MultiStepForm } from '@/components/elements/Form/MultiStepForm';

const schemaStep1 = z.object({
  firstname: z.string().min(2),
  lastname: z.string().min(2),
});

const schemaStep2 = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const schemaStep3 = z.object({
  role: z.enum(['customer', 'driver']),
});

const Step1 = () => {
  const { control } = useFormContext();
  return (
    <View>
      <Controller
        control={control}
        name="firstname"
        render={({ field: { onChange, value } }) => (
          <TextInput placeholder="First Name" value={value} onChangeText={onChange} />
        )}
      />
      <Controller
        control={control}
        name="lastname"
        render={({ field: { onChange, value } }) => (
          <TextInput placeholder="Last Name" value={value} onChangeText={onChange} />
        )}
      />
    </View>
  );
};

const Step2 = () => {
  const { control } = useFormContext();
  return (
    <View>
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <TextInput placeholder="Email" value={value} onChangeText={onChange} />
        )}
      />
      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, value } }) => (
          <TextInput placeholder="Password" value={value} secureTextEntry onChangeText={onChange} />
        )}
      />
    </View>
  );
};

const Step3 = () => {
  const { control } = useFormContext();
  return (
    <View>
      <Controller
        control={control}
        name="role"
        render={({ field: { onChange, value } }) => (
          <>
            <TextInput
              placeholder="Role (customer or driver)"
              value={value}
              onChangeText={onChange}
            />
          </>
        )}
      />
    </View>
  );
};

export default function SignUpForm() {
  const handleSubmit = (data: any) => {
    console.log('SignUp data:', data);
  };

  return (
    <MultiStepForm
      onSubmit={handleSubmit}
      steps={[
        { id: 'step1', title: 'Personal Info', schema: schemaStep1, component: Step1 },
        { id: 'step2', title: 'Credentials', schema: schemaStep2, component: Step2 },
        { id: 'step3', title: 'Select Role', schema: schemaStep3, component: Step3 },
      ]}
    />
  );
}
