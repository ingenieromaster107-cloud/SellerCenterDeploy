import type { Customer } from 'src/interfaces/customer/customer.interface';

import { jwtDecode } from 'jwt-decode';

import {
  CUSTOMER_ID,
  CUSTOMER_KEY,
  EXPIRATION_TIME,
  AUTH_STORAGE_KEYS,
  ACCESS_TOKEN_STORAGE_KEY,
} from './constant';

// ----------------------------------------------------------------------

/** Valida la sesión actual del usuario */
export function validateSession() {
  const accessToken = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
  const expirationTime = localStorage.getItem(EXPIRATION_TIME);

  if (!accessToken || !expirationTime) {
    setSession(null);
    return false;
  }

  const isExpired = parseFloat(expirationTime) < Date.now() / 1000;

  if (isExpired) {
    setSession(null);
    return false;
  }

  return true;
}

/** Establece la sesión del usuario */
export function setSession(accessToken: string | null) {
  if (accessToken) {
    const payload: { uid: string; exp: number } = jwtDecode(accessToken);

    if (!(payload.exp < Date.now() / 1000)) {
      localStorage.setItem(EXPIRATION_TIME, payload.exp.toString());
    }

    localStorage.setItem(CUSTOMER_ID, payload.uid);
    localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, accessToken);
  } else {
    localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
    localStorage.removeItem(EXPIRATION_TIME);
    localStorage.removeItem(CUSTOMER_ID);
  }
}

/** Establece el cliente en el almacenamiento local */
export async function setCustomerStorage(customer: Customer | null) {
  try {
    if (customer) {
      localStorage.setItem(CUSTOMER_KEY, JSON.stringify(customer));
    } else {
      localStorage.removeItem(CUSTOMER_KEY);
    }
  } catch (error) {
    console.error('Error during set customer storage:', error);
    throw error;
  }
}

/** Obtiene el token de sesión actual del localStorage */
export function getSession() {
  try {
    if (typeof window === 'undefined') {
      return null;
    }

    const accessToken = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);

    if (!accessToken) {
      return null;
    }

    return accessToken;
  } catch (error) {
    console.error('Error during get session');
    throw error;
  }
}

/** Expira las cookies de autenticación locales */
export function clearAuthCookies() {
  if (typeof document === 'undefined') {
    return;
  }

  const past = 'Thu, 01 Jan 1970 00:00:00 GMT';
  const { hostname } = window.location;

  document.cookie.split(';').forEach((cookie) => {
    const name = cookie.split('=')[0]?.trim();
    if (!name) {
      return;
    }

    document.cookie = `${name}=; expires=${past}; path=/`;
    document.cookie = `${name}=; expires=${past}; path=/; domain=${hostname}`;
    document.cookie = `${name}=; expires=${past}; path=/; domain=.${hostname}`;
  });
}

/** Purga la sesión por completo para evitar bucles de error con datos obsoletos */
export function purgeAuthSession() {
  try {
    if (typeof window === 'undefined') {
      return;
    }

    AUTH_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
    sessionStorage.clear();
    clearAuthCookies();
  } catch (error) {
    console.error('Error during purge auth session:', error);
  }
}
