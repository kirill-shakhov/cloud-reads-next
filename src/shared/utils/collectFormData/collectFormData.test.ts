import { collectFormData } from './collectFormData';

describe('collectFormData', () => {
  it('appends primitives as strings and files as-is', () => {
    const image = new File(['x'], 'avatar.png', { type: 'image/png' });

    const formData = collectFormData({
      username: 'john',
      age: 30,
      isActive: true,
      image,
    });

    expect(formData.get('username')).toBe('john');
    expect(formData.get('age')).toBe('30');
    expect(formData.get('isActive')).toBe('true');
    expect(formData.get('image')).toBeInstanceOf(File);
  });

  it('skips null, undefined and objects', () => {
    const formData = collectFormData({
      image: null,
      missing: undefined,
      nested: { a: 1 },
    });

    expect(Array.from(formData.keys())).toEqual([]);
  });
});
