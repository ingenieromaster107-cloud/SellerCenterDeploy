import type { ButtonProps } from '@mui/material/Button';

import { useCallback } from 'react';

import Button from '@mui/material/Button';

import { useRouter } from 'src/routes/hooks';

import { useLogout } from 'src/actions/auth/useLogout';

import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

type Props = ButtonProps & {
  onClose?: () => void;
};

export function SignOutButton({ onClose, sx, ...other }: Props) {
  const router = useRouter();

  const { checkUserSession } = useAuthContext();
  const { mutateAsync } = useLogout();

  const handleLogout = useCallback(async () => {
    try {
      await mutateAsync(null);
      await checkUserSession?.();

      onClose?.();
      router.refresh();
    } catch (error) {
      console.error("Error during logout ", error);
    }
  }, [checkUserSession, onClose, router, mutateAsync]);

  return (
    <Button
      fullWidth
      variant="soft"
      size="large"
      color="error"
      onClick={handleLogout}
      sx={sx}
      {...other}
    >
      Logout
    </Button>
  );
}
