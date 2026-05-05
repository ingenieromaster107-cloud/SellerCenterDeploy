import { renderHook } from '@testing-library/react';

import { useAuthContext } from 'src/auth/hooks';

import { useSellerStatus } from './use-seller-status';

jest.mock('src/auth/hooks', () => ({
  useAuthContext: jest.fn(),
}));

const mockedAuth = useAuthContext as jest.MockedFunction<typeof useAuthContext>;

const buildAuth = (status?: string) =>
  ({
    user: status
      ? ({ sellerLinkingStatus: status } as unknown as ReturnType<typeof useAuthContext>['user'])
      : null,
  }) as unknown as ReturnType<typeof useAuthContext>;

describe('useSellerStatus', () => {
  it('falls back to PENDING when user is missing', () => {
    mockedAuth.mockReturnValue(buildAuth());
    const { result } = renderHook(() => useSellerStatus());
    expect(result.current.status).toBe('PENDING');
    expect(result.current.isPending).toBe(true);
  });

  it('returns APPROVED when backend says so', () => {
    mockedAuth.mockReturnValue(buildAuth('APPROVED'));
    const { result } = renderHook(() => useSellerStatus());
    expect(result.current.status).toBe('APPROVED');
    expect(result.current.isApproved).toBe(true);
    expect(result.current.isPending).toBe(false);
  });

  it.each(['PROCESSING', 'DISAPPROVED'] as const)('handles %s', (status) => {
    mockedAuth.mockReturnValue(buildAuth(status));
    const { result } = renderHook(() => useSellerStatus());
    expect(result.current.status).toBe(status);
  });

  it('falls back to PENDING when backend returns an unknown value', () => {
    mockedAuth.mockReturnValue(buildAuth('SOMETHING_WEIRD'));
    const { result } = renderHook(() => useSellerStatus());
    expect(result.current.status).toBe('PENDING');
  });
});
