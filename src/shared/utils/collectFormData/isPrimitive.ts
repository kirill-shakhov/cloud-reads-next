export const isPrimitive = (
  value: unknown
): value is string | number | boolean | bigint =>
  value !== null &&
  value !== undefined &&
  typeof value !== 'object' &&
  typeof value !== 'function';
