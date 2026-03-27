jest.mock('src/routes/paths', () => ({
  paths: { auth: { signIn: '/auth/sign-in' } },
}));

describe('auth/context/utils', () => {
  beforeEach(() => {
    sessionStorage.clear();
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getSession', () => {
    it('returns null when no token in sessionStorage', async () => {
      const { getSession } = await import('./utils');
      expect(getSession()).toBeNull();
    });

    it('returns the stored token', async () => {
      sessionStorage.setItem('access_token', 'my-token');
      const { getSession } = await import('./utils');
      expect(getSession()).toBe('my-token');
    });

    it('throws when sessionStorage.getItem fails', async () => {
      const { getSession } = await import('./utils');

      const getItemSpy = jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('boom');
      });

      expect(() => getSession()).toThrow('boom');
      getItemSpy.mockRestore();
    });
  });

  describe('setSession', () => {
    it('stores token + expiration', async () => {
      const { setSession } = await import('./utils');
      await setSession('abc-123');
      expect(sessionStorage.getItem('access_token')).toBe('abc-123');
      expect(sessionStorage.getItem('expiration_time')).toBeTruthy();
    });

    it('removes token when null passed', async () => {
      sessionStorage.setItem('access_token', 'abc');
      sessionStorage.setItem('expiration_time', '123');
      const { setSession } = await import('./utils');

      await setSession(null).catch(() => {});

      expect(sessionStorage.getItem('access_token')).toBeNull();
      expect(sessionStorage.getItem('expiration_time')).toBeNull();
    });

    it('throws on storage error branch', async () => {
      const { setSession } = await import('./utils');

      const setItemSpy = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('set error');
      });

      await expect(setSession('x')).rejects.toThrow('set error');
      setItemSpy.mockRestore();
    });
  });

  describe('validateSession', () => {
    it('executes no-token branch', async () => {
      const { validateSession } = await import('./utils');
      await validateSession().catch(() => {});
      expect(sessionStorage.getItem('access_token')).toBeNull();
    });

    it('keeps token when valid non-expired token exists', async () => {
      sessionStorage.setItem('access_token', 'valid-token');
      sessionStorage.setItem('expiration_time', (Date.now() / 1000).toString());

      const { validateSession } = await import('./utils');
      await validateSession();

      expect(sessionStorage.getItem('access_token')).toBe('valid-token');
    });

    it('removes expired token', async () => {
      sessionStorage.setItem('access_token', 'old-token');
      sessionStorage.setItem('expiration_time', (Date.now() / 1000 - 7200).toString());

      const { validateSession } = await import('./utils');
      await validateSession().catch(() => {});

      expect(sessionStorage.getItem('access_token')).toBeNull();
      expect(sessionStorage.getItem('expiration_time')).toBeNull();
    });

    it('throws on unexpected error branch', async () => {
      const { validateSession } = await import('./utils');

      const getItemSpy = jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('read error');
      });

      await expect(validateSession()).rejects.toThrow('read error');
      getItemSpy.mockRestore();
    });
  });
});
