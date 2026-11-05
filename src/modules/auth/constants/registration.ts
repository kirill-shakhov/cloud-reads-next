import type { RegistrationData, RegistrationStep } from '../types';

// confirmPassword is validated on step 1; otherwise a mismatch would only surface on the last step, where the field is hidden.
export const stepFields: Record<RegistrationStep, (keyof RegistrationData)[]> =
  {
    1: ['username', 'password', 'confirmPassword'],
    2: ['firstName', 'lastName'],
    3: ['email'],
    4: ['country', 'bio'],
  };

export const REGISTRATION_TOTAL_STEPS = 4;
