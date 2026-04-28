import type { SettingsState } from './types';

import { defaultSettings, SETTINGS_STORAGE_KEY } from './settings-config';

// ----------------------------------------------------------------------
// Stub: Next.js's cookie-based settings detection is not used in the Vite
// build. The SettingsProvider receives defaultSettings directly.
// This file is kept for potential SSR migrations in the future.

export async function detectSettings(
  _storageKey: string = SETTINGS_STORAGE_KEY
): Promise<SettingsState> {
  return defaultSettings;
}
