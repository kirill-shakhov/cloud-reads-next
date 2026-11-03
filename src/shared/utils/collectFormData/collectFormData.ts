import { isPrimitive } from './isPrimitive';

export const collectFormData = (data: Record<string, unknown>): FormData => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value instanceof File) {
      formData.append(key, value);
    } else if (isPrimitive(value)) {
      formData.append(key, String(value));
    }
  });

  return formData;
};
