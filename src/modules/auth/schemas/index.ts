import { mixed, object, ref, string } from 'yup';

export type Translate = (key: string) => string;

export const createLoginSchema = (t: Translate) =>
  object({
    username: string().required(t('validation.usernameRequired')),
    password: string().required(t('validation.passwordRequired')),
  });

export const createRegistrationSchema = (t: Translate) =>
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
