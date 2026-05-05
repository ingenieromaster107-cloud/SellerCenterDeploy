'use client';

import { useMemo } from 'react';

import { SELLER_STATUS, type SellerStatus } from 'src/interfaces/seller/seller-status';

import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

/**
 * Hook que expone el estado de vinculación del seller actual.
 *
 * Lee `customer.sellerProfile.status` (ya mapeado por el adapter desde el
 * entero `seller_status` que devuelve el backend). Cuando el perfil aún no
 * está disponible o el código es desconocido, devuelve `PENDING` como
 * fallback para no romper módulos que deben seguir accesibles (Academy).
 */
export const useSellerStatus = (): {
  status: SellerStatus;
  statusLabel: string;
  isApproved: boolean;
  isPending: boolean;
  isProcessing: boolean;
  isDisabled: boolean;
  isDenied: boolean;
} => {
  const { user } = useAuthContext();

  return useMemo(() => {
    const profile = user?.sellerProfile;
    const status: SellerStatus = profile?.status ?? SELLER_STATUS.PENDING;
    const statusLabel = profile?.statusLabel ?? '';

    return {
      status,
      statusLabel,
      isApproved: status === SELLER_STATUS.APPROVED,
      isPending: status === SELLER_STATUS.PENDING,
      isProcessing: status === SELLER_STATUS.PROCESSING,
      isDisabled: status === SELLER_STATUS.DISABLED,
      isDenied: status === SELLER_STATUS.DENIED,
    };
  }, [user?.sellerProfile]);
};
