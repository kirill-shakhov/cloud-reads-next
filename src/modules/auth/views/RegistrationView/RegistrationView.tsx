'use client';

import { type FormEvent, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from '@heroui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { mixed, object, ref, string } from 'yup';

import { LoadingButton } from '@/shared/components/LoadingButton/LoadingButton';
import { useTranslations } from '@/shared/hooks/useTranslations';

import { AuthPageLayout } from '@/modules/auth/components/AuthPageLayout/AuthPageLayout';
import { RegistrationProgressBar } from '@/modules/auth/components/RegistrationProgressBar/RegistrationProgressBar';
import { REGISTRATION_TOTAL_STEPS, stepFields } from '@/modules/auth/constants';
import { useRegistrationStore } from '@/modules/auth/stores/registration';
import type { RegistrationData, RegistrationStep } from '@/modules/auth/types';

import { APP_ROUTES } from '@/shared/constants/routes';
import { buildUrl } from '@/shared/utils/buildUrl/buildUrl';

import { RegistrationStepFour } from './RegistrationStepFour';
import { RegistrationStepOne } from './RegistrationStepOne';
import { RegistrationStepThree } from './RegistrationStepThree';
import { RegistrationStepTwo } from './RegistrationStepTwo';

const defaultValues: RegistrationData = {
  username: '',
  password: '',
  confirmPassword: '',
  firstName: '',
  lastName: '',
  email: '',
  image: null,
  country: '',
  bio: '',
};

const createRegistrationSchema = (t: (key: string) => string) =>
  object({
    username: string()
      .required(t('validation.usernameRequired'))
      .min(3, t('validation.usernameMinLength')),
    password: string()
      .required(t('validation.passwordRequired'))
      .min(6, t('validation.passwordMinLength')),
    confirmPassword: string()
      .required(t('validation.confirmPasswordRequired'))
      .oneOf([ref('password')], t('validation.passwordsDoNotMatch')),
    firstName: string().required(t('validation.firstNameRequired')),
    lastName: string().required(t('validation.lastNameRequired')),
    email: string()
      .required(t('validation.emailRequired'))
      .email(t('validation.emailInvalid')),
    image: mixed<File>().nullable().defined(),
    country: string().required(t('validation.countryRequired')),
    bio: string().required(t('validation.bioRequired')),
  });

export function RegistrationView() {
  const router = useRouter();
  const { t, tRaw } = useTranslations('pages.register');

  const currentStep = useRegistrationStore((state) => state.currentStep);
  const isLoading = useRegistrationStore((state) => state.isLoading);
  const setIsLoading = useRegistrationStore((state) => state.setIsLoading);
  const nextStep = useRegistrationStore((state) => state.nextStep);
  const previousStep = useRegistrationStore((state) => state.previousStep);
  const checkUserExists = useRegistrationStore(
    (state) => state.checkUserExists
  );
  const submitForm = useRegistrationStore((state) => state.submitForm);
  const resetState = useRegistrationStore((state) => state.resetState);

  const schema = useMemo(() => createRegistrationSchema(tRaw), [tRaw]);

  const { control, handleSubmit, setError, setValue, trigger, getValues } =
    useForm<RegistrationData>({
      resolver: yupResolver(schema),
      defaultValues,
    });

  useEffect(() => resetState, [resetState]);

  const validateStep = (step: RegistrationStep): Promise<boolean> =>
    trigger(stepFields[step]);

  const validateFirstStep = async (): Promise<void> => {
    setIsLoading(true);

    try {
      if (!(await validateStep(1))) {
        return;
      }

      const isUsernameTaken = await checkUserExists(getValues('username'));

      if (isUsernameTaken) {
        setError('username', {
          type: 'server',
          message: tRaw('validation.userAlreadyExists'),
        });

        return;
      }

      nextStep();
    } catch {
      toast.danger(tRaw('errors.common.unknown'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextStep = async (): Promise<void> => {
    if (currentStep === 1) {
      await validateFirstStep();

      return;
    }

    const isCurrentStepValid = await validateStep(currentStep);

    if (isCurrentStepValid) {
      nextStep();
    }
  };

  const submit = handleSubmit(async (data) => {
    const isSubmissionSuccessful = await submitForm(data);

    if (isSubmissionSuccessful) {
      router.push(buildUrl(APP_ROUTES.AUTH_EMAIL_SENT, { email: data.email }));
    }
  });

  // Enter on an earlier step must advance the wizard instead of submitting hidden fields.
  const onFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    if (currentStep < REGISTRATION_TOTAL_STEPS) {
      event.preventDefault();
      handleNextStep();

      return;
    }

    return submit(event);
  };

  return (
    <AuthPageLayout
      title={t('title')}
      header={
        <RegistrationProgressBar
          currentStep={currentStep}
          totalSteps={REGISTRATION_TOTAL_STEPS}
          className="mt-6"
        />
      }
    >
      <form className="space-y-6" noValidate onSubmit={onFormSubmit}>
        {currentStep === 1 && <RegistrationStepOne control={control} />}
        {currentStep === 2 && <RegistrationStepTwo control={control} />}
        {currentStep === 3 && (
          <RegistrationStepThree
            control={control}
            onImageChange={(file) => setValue('image', file)}
          />
        )}
        {currentStep === 4 && <RegistrationStepFour control={control} />}

        {currentStep > 1 && (
          <LoadingButton fullWidth variant="secondary" onPress={previousStep}>
            {t('previousStep')}
          </LoadingButton>
        )}

        {currentStep < REGISTRATION_TOTAL_STEPS && (
          <LoadingButton
            key="next"
            fullWidth
            isPending={isLoading}
            onPress={handleNextStep}
          >
            {t('nextStep')}
          </LoadingButton>
        )}

        {currentStep === REGISTRATION_TOTAL_STEPS && (
          <LoadingButton
            key="submit"
            fullWidth
            type="submit"
            isPending={isLoading}
          >
            {t('button')}
          </LoadingButton>
        )}
      </form>

      <p className="mt-10 text-center text-sm text-gray-500 dark:text-neutral-400">
        {t('alreadyHaveAnAccount')}{' '}
        <Link
          href={APP_ROUTES.AUTH_LOGIN}
          className="leading-6 font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          {t('login')}
        </Link>
      </p>
    </AuthPageLayout>
  );
}
