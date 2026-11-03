import { createLoginSchema, createRegistrationSchema } from './index';

const t = (key: string): string => key;

const validRegistration = {
  username: 'john',
  password: 'secret1',
  confirmPassword: 'secret1',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  image: null,
  country: 'Poland',
  bio: 'Hello',
};

describe('createLoginSchema', () => {
  const schema = createLoginSchema(t);

  it('requires username and password', async () => {
    await expect(
      schema.validate({ username: '', password: '' }, { abortEarly: false })
    ).rejects.toMatchObject({
      errors: ['validation.usernameRequired', 'validation.passwordRequired'],
    });
  });

  it('accepts filled credentials', async () => {
    await expect(
      schema.isValid({ username: 'john', password: 'secret1' })
    ).resolves.toBe(true);
  });
});

describe('createRegistrationSchema', () => {
  const schema = createRegistrationSchema(t);

  it('accepts a valid form', async () => {
    await expect(schema.isValid(validRegistration)).resolves.toBe(true);
  });

  it('enforces username and password minimum length', async () => {
    await expect(
      schema.validate(
        { ...validRegistration, username: 'ab', password: '12345' },
        { abortEarly: false }
      )
    ).rejects.toMatchObject({
      errors: [
        'validation.usernameMinLength',
        'validation.passwordMinLength',
        'validation.passwordsDoNotMatch',
      ],
    });
  });

  it('rejects mismatching passwords', async () => {
    await expect(
      schema.validate({ ...validRegistration, confirmPassword: 'other' })
    ).rejects.toMatchObject({ errors: ['validation.passwordsDoNotMatch'] });
  });

  it('rejects an invalid email', async () => {
    await expect(
      schema.validate({ ...validRegistration, email: 'not-an-email' })
    ).rejects.toMatchObject({ errors: ['validation.emailInvalid'] });
  });

  it('requires country and bio', async () => {
    await expect(
      schema.validate(
        { ...validRegistration, country: '', bio: '' },
        { abortEarly: false }
      )
    ).rejects.toMatchObject({
      errors: ['validation.countryRequired', 'validation.bioRequired'],
    });
  });
});
