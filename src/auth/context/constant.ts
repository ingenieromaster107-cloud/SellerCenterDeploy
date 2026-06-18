export const ACCESS_TOKEN_STORAGE_KEY = 'access_token';
export const EXPIRATION_TIME = 'expiration_time';
export const CUSTOMER_KEY = 'customer';
export const CUSTOMER_ID = 'customer_id';
export const TOUR_STEP_INDEX = 'tour-step-index';
export const TOKEN_REFRESH_RATIO = 0.8;

/** Claves de almacenamiento relacionadas con la autenticación que se eliminan cuando finaliza la sesión. */
export const AUTH_STORAGE_KEYS = [
  ACCESS_TOKEN_STORAGE_KEY,
  EXPIRATION_TIME,
  CUSTOMER_ID,
  CUSTOMER_KEY,
  TOUR_STEP_INDEX,
] as const;

/** Tiempo que permanece visible el mensaje antes de redirigir al login. */
export const REDIRECT_DELAY_MS = 4000;

/** El backend expone el tiempo de vida del token en horas. */
export const MS_PER_HOUR = 60 * 60 * 1000;
