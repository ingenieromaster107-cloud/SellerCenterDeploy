import { renderHook } from '@testing-library/react';

import { useSellerStatus } from './use-seller-status';

const mockUseSellerProfile = jest.fn();
jest.mock('src/actions/auth/use-seller-profile', () => ({
  useSellerProfile: (...args: any[]) => mockUseSellerProfile(...args),
}));

jest.mock('src/interfaces/seller/seller-status', () => ({
  SELLER_STATUS: {
    APPROVED: 'APPROVED',
    PENDING: 'PENDING',
    PROCESSING: 'PROCESSING',
    DISABLED: 'DISABLED',
    DENIED: 'DENIED',
  },
}));

describe('useSellerStatus', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns isApproved=true when status is APPROVED', () => {
    mockUseSellerProfile.mockReturnValue({
      data: { status: 'APPROVED', statusLabel: 'Approved' },
    });

    const { result } = renderHook(() => useSellerStatus());

    expect(result.current.isApproved).toBe(true);
    expect(result.current.isPending).toBe(false);
    expect(result.current.isProcessing).toBe(false);
    expect(result.current.isDisabled).toBe(false);
    expect(result.current.isDenied).toBe(false);
  });

  it('returns isPending=true when status is PENDING', () => {
    mockUseSellerProfile.mockReturnValue({
      data: { status: 'PENDING', statusLabel: 'Pending' },
    });

    const { result } = renderHook(() => useSellerStatus());

    expect(result.current.isPending).toBe(true);
    expect(result.current.isApproved).toBe(false);
    expect(result.current.isProcessing).toBe(false);
    expect(result.current.isDisabled).toBe(false);
    expect(result.current.isDenied).toBe(false);
  });

  it('returns isProcessing=true when status is PROCESSING', () => {
    mockUseSellerProfile.mockReturnValue({
      data: { status: 'PROCESSING', statusLabel: 'Processing' },
    });

    const { result } = renderHook(() => useSellerStatus());

    expect(result.current.isProcessing).toBe(true);
    expect(result.current.isApproved).toBe(false);
    expect(result.current.isPending).toBe(false);
    expect(result.current.isDisabled).toBe(false);
    expect(result.current.isDenied).toBe(false);
  });

  it('returns isDisabled=true when status is DISABLED', () => {
    mockUseSellerProfile.mockReturnValue({
      data: { status: 'DISABLED', statusLabel: 'Disabled' },
    });

    const { result } = renderHook(() => useSellerStatus());

    expect(result.current.isDisabled).toBe(true);
    expect(result.current.isApproved).toBe(false);
    expect(result.current.isPending).toBe(false);
    expect(result.current.isProcessing).toBe(false);
    expect(result.current.isDenied).toBe(false);
  });

  it('returns isDenied=true when status is DENIED', () => {
    mockUseSellerProfile.mockReturnValue({
      data: { status: 'DENIED', statusLabel: 'Denied' },
    });

    const { result } = renderHook(() => useSellerStatus());

    expect(result.current.isDenied).toBe(true);
    expect(result.current.isApproved).toBe(false);
    expect(result.current.isPending).toBe(false);
    expect(result.current.isProcessing).toBe(false);
    expect(result.current.isDisabled).toBe(false);
  });

  it('defaults to PENDING status when profile is null', () => {
    mockUseSellerProfile.mockReturnValue({ data: null });

    const { result } = renderHook(() => useSellerStatus());

    expect(result.current.status).toBe('PENDING');
    expect(result.current.isPending).toBe(true);
    expect(result.current.isApproved).toBe(false);
    expect(result.current.isProcessing).toBe(false);
    expect(result.current.isDisabled).toBe(false);
    expect(result.current.isDenied).toBe(false);
  });

  it('defaults statusLabel to empty string when profile is null', () => {
    mockUseSellerProfile.mockReturnValue({ data: null });

    const { result } = renderHook(() => useSellerStatus());

    expect(result.current.statusLabel).toBe('');
  });

  it('returns statusLabel from profile', () => {
    mockUseSellerProfile.mockReturnValue({
      data: { status: 'APPROVED', statusLabel: 'Active Seller' },
    });

    const { result } = renderHook(() => useSellerStatus());

    expect(result.current.statusLabel).toBe('Active Seller');
  });
});
