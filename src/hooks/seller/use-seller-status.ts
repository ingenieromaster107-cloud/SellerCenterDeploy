'use client';

import { useMemo } from 'react';

import { SELLER_STATUS, isSellerStatus, type SellerStatus } from 'src/interfaces/seller/seller-status';

import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

/**
 * Hook que expone el estado de vinculación del seller actual.
 *
 * Mientras el backend implementa el campo `sellerLinkingStatus` en la query
 * `GetCurrentUser`, este hook devuelve `PENDING` como default — esto es
 * intencional para que módulos como Academy (que deben funcionar en cualquier
 * estado) no rompan, y para que la UI condicional por estado se comporte de
 * forma predecible.
 */
export const useSellerStatus = (): {
  status: SellerStatus;
  isApproved: boolean;
  isPending: boolean;
  isProcessing: boolean;
  isDisapproved: boolean;
} => {
  const { user } = useAuthContext();

  return useMemo(() => {
    const raw = user?.sellerLinkingStatus;
    const status: SellerStatus = isSellerStatus(raw) ? raw : SELLER_STATUS.PENDING;

    return {
      status,
      isApproved: status === SELLER_STATUS.APPROVED,
      isPending: status === SELLER_STATUS.PENDING,
      isProcessing: status === SELLER_STATUS.PROCESSING,
      isDisapproved: status === SELLER_STATUS.DISAPPROVED,
    };
  }, [user?.sellerLinkingStatus]);
};
