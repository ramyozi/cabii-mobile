import React, { useMemo, useState, useEffect } from 'react';
import { View } from 'react-native';
import { FormProvider, useForm, FieldValues, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ZodSchema } from 'zod';
import * as Haptics from 'expo-haptics';
import Button from '@/components/elements/Button';
import { colors } from '@/theme';

export type StepConfig<TForm extends FieldValues> = {
  id: string;
  title?: string;
  schema?: ZodSchema<any>;
  component: React.FC<{ form: UseFormReturn<TForm> }>;
  when?: (data: TForm) => boolean;
  skippable?: boolean;
};

export interface MultiStepFormProps<TForm extends FieldValues> {
  steps: StepConfig<TForm>[];
  initialValues: TForm;
  onSubmit: (data: TForm) => void | Promise<void>;
  onSkip?: (stepId: string, data: TForm) => void | Promise<void>;
  onStepNext?: (stepId: string, data: TForm) => Promise<boolean | void>;
  onStepBack?: (stepId: string, data: TForm) => boolean | void;
  lockedSteps?: string[];
}

export default function MultiStepForm<TForm extends FieldValues>({
  steps,
  initialValues,
  onSubmit,
  onSkip,
  onStepNext,
  onStepBack,
  lockedSteps = [],
}: MultiStepFormProps<TForm>) {
  const [currentId, setCurrentId] = useState<string>(steps[0]?.id);
  const methods = useForm<TForm>({
    defaultValues: initialValues as any,
    resolver: steps[0]?.schema ? zodResolver(steps[0].schema as any) : undefined,
    mode: 'onTouched',
  });

  const values = methods.watch();
  const activeSteps = useMemo(
    () => steps.filter(s => (s.when ? s.when(values) : true)),
    [steps, JSON.stringify(values)],
  );

  const step = activeSteps.find(s => s.id === currentId) ?? activeSteps[0];
  const StepView = step?.component ?? (() => null);
  const currentIndex = activeSteps.findIndex(s => s.id === currentId);
  const canGoBack = currentIndex > 0;
  const isLast = currentIndex === activeSteps.length - 1;

  useEffect(() => {
    methods.reset(methods.getValues(), { keepValues: true });
  }, [currentId]);

  const handleNext = async () => {
    const ok = step?.schema ? await methods.trigger() : true;
    if (!ok) return;
    Haptics.selectionAsync();

    const proceed = (await onStepNext?.(step.id, methods.getValues())) ?? true;
    if (!proceed) return;

    if (isLast) await onSubmit(methods.getValues());
    else setCurrentId(activeSteps[currentIndex + 1].id);
  };

  const handleBack = () => {
    if (!canGoBack) return;
    const proceed = onStepBack?.(step.id, methods.getValues());
    if (proceed === false) return;
    Haptics.selectionAsync();
    setCurrentId(activeSteps[currentIndex - 1].id);
  };

  const handleSkip = async () => {
    Haptics.selectionAsync();
    await onSkip?.(step.id, methods.getValues());
    if (isLast) await onSubmit(methods.getValues());
    else setCurrentId(activeSteps[currentIndex + 1].id);
  };

  const backLocked = lockedSteps.includes(step.id);

  return (
    <FormProvider {...methods}>
      <View style={{ flex: 1, padding: 20 }}>
        <StepView form={methods} />
        <View style={{ flexDirection: 'row', marginTop: 24, gap: 8 }}>
          {canGoBack && !backLocked && (
            <Button
              title="←"
              onPress={handleBack}
              style={{ flex: 1, backgroundColor: colors.gray }}
            />
          )}
          {step.skippable && (
            <Button
              title="Passer"
              onPress={handleSkip}
              style={{ flex: 1, backgroundColor: colors.darkPurple }}
            />
          )}
          <Button
            title={isLast ? 'Terminer' : 'Suivant'}
            onPress={handleNext}
            style={{ flex: 1 }}
          />
        </View>
      </View>
    </FormProvider>
  );
}
