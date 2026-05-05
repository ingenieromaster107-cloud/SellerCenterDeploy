import { renderHook } from '@testing-library/react';

import { useAuthContext } from 'src/auth/hooks';

import { useSellerStatus } from './use-seller-status';

jest.mock('src/auth/hooks', () => ({
  useAuthContext: jest.fn(),
}));

const mockedAuth = useAuthContext as jest.MockedFunction<typeof useAuthContext>;

const buildAuth = (sellerProfile?: {
  status?: string;
  statusLabel?: string;
  statusCode?: number;
}) =>
  ({
    user: sellerProfile
      ? ({
          sellerProfile: {
            sellerId: 1,
            status: sellerProfile.status,
            statusCode: sellerProfile.statusCode ?? 0,
            statusLabel: sellerProfile.statusLabel ?? '',
            shopUrl: 'shop',
          },
        } as unknown as ReturnType<typeof useAuthContext>['user'])
      : null,
  }) as unknown as ReturnType<typeof useAuthContext>;

describe('useSellerStatus', () => {
  it('falls back to PENDING when user is missing', () => {
    mockedAuth.mockReturnValue(buildAuth());
    const { result } = renderHook(() => useSellerStatus());
    expect(result.current.status).toBe('PENDING');
    expect(result.current.isPending).toBe(true);
  });

  it('falls back to PENDING when sellerProfile is missing', () => {
    mockedAuth.mockReturnValue({
      user: { firstname: 'X' } as any,
    } as any);
    const { result } = renderHook(() => useSellerStatus());
    expect(result.current.status).toBe('PENDING');
  });

  it('returns APPROVED with statusLabel from backend', () => {
    mockedAuth.mockReturnValue(
      buildAuth({ status: 'APPROVED', statusCode: 1, statusLabel: 'Aprobado' })
    );
    const { result } = renderHook(() => useSellerStatus());
    expect(result.current.status).toBe('APPROVED');
    expect(result.current.statusLabel).toBe('Aprobado');
    expect(result.current.isApproved).toBe(true);
    expect(result.current.isPending).toBe(false);
  });

  it.each([
    ['PROCESSING', 2],
    ['DISABLED', 3],
    ['DENIED', 4],
  ] as const)('handles %s', (status, code) => {
    mockedAuth.mockReturnValue(buildAuth({ status, statusCode: code }));
    const { result } = renderHook(() => useSellerStatus());
    expect(result.current.status).toBe(status);
  });

  it('exposes per-status booleans matching the active status', () => {
    mockedAuth.mockReturnValue(buildAuth({ status: 'DENIED', statusCode: 4 }));
    const { result } = renderHook(() => useSellerStatus());
    expect(result.current.isDenied).toBe(true);
    expect(result.current.isApproved).toBe(false);
    expect(result.current.isProcessing).toBe(false);
    expect(result.current.isPending).toBe(false);
    expect(result.current.isDisabled).toBe(false);
  });

  it('falls back to PENDING when sellerProfile.status is undefined (unknown code)', () => {
    mockedAuth.mockReturnValue(buildAuth({ statusCode: 99 }));
    const { result } = renderHook(() => useSellerStatus());
    expect(result.current.status).toBe('PENDING');
  });
});
