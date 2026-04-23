export const AUTH_DISABLED_IN_DEV =
  process.env.NODE_ENV === 'development' &&
  process.env.NEXT_PUBLIC_DISABLE_AUTH_IN_DEV === 'true';
