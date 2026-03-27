import { useMockedUser } from './use-mocked-user';

jest.mock('src/_mock', () => ({
  _mock: {
    image: { avatar: () => 'avatar-url' },
    phoneNumber: () => '+57-300-000-0000',
    countryNames: () => 'Colombia',
  },
}));

describe('useMockedUser', () => {
  it('returns mocked user data with expected default values', () => {
    const { user } = useMockedUser();

    expect(user).toMatchObject({
      id: expect.any(String),
      displayName: 'Jaydon Frankie',
      email: 'demo@minimals.cc',
      phoneNumber: expect.any(String),
      country: expect.any(String),
      address: '90210 Broadway Blvd',
      state: 'California',
      city: 'San Francisco',
      zipCode: '94116',
      role: 'admin',
      isPublic: true,
    });

    expect(user.photoURL).toBe('avatar-url');
    expect(user.about).toContain('Phasellus');
  });
});
