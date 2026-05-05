import { currentUserAdapter } from './current-user.adapter';

describe('currentUserAdapter', () => {
  it('maps the basic customer fields with safe defaults', () => {
    const result = currentUserAdapter({
      customer: { email: 'a@b.co', firstname: 'A', lastname: 'B' },
    });
    expect(result).toMatchObject({ email: 'a@b.co', firstname: 'A', lastname: 'B' });
    expect(result.sellerProfile).toBeUndefined();
  });

  it('coerces null fields to empty strings', () => {
    const result = currentUserAdapter({
      customer: { email: null, firstname: null, lastname: null },
    });
    expect(result).toMatchObject({ email: '', firstname: '', lastname: '' });
  });

  it.each([
    [0, 'PENDING'],
    [1, 'APPROVED'],
    [2, 'PROCESSING'],
    [3, 'DISABLED'],
    [4, 'DENIED'],
  ])('maps seller_status %s to %s', (code, expected) => {
    const result = currentUserAdapter({
      customer: {
        email: 'x@y.z',
        firstname: 'X',
        lastname: 'Y',
        seller_profile: {
          seller_id: 7,
          seller_status: code,
          seller_status_label: 'Label',
          shop_url: 'shop',
        },
      },
    });
    expect(result.sellerProfile?.status).toBe(expected);
    expect(result.sellerProfile?.statusCode).toBe(code);
    expect(result.sellerProfile?.statusLabel).toBe('Label');
    expect(result.sellerProfile?.sellerId).toBe(7);
    expect(result.sellerProfile?.shopUrl).toBe('shop');
  });

  it('leaves sellerProfile.status undefined for an unknown numeric code', () => {
    const result = currentUserAdapter({
      customer: {
        email: 'x@y.z',
        firstname: 'X',
        lastname: 'Y',
        seller_profile: {
          seller_id: 1,
          seller_status: 42,
          seller_status_label: 'Unknown',
          shop_url: '',
        },
      },
    });
    expect(result.sellerProfile?.status).toBeUndefined();
    expect(result.sellerProfile?.statusCode).toBe(42);
  });

  it('handles a null seller_profile block', () => {
    const result = currentUserAdapter({
      customer: { email: 'a@b.co', firstname: 'A', lastname: 'B', seller_profile: null },
    });
    expect(result.sellerProfile).toBeUndefined();
  });
});
