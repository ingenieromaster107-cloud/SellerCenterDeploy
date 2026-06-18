'use client';

import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { useTranslate } from 'src/locales';

// ----------------------------------------------------------------------

export type SessionExpiredReason = 'idle' | 'unauthorized';

type Props = {
  open: boolean;
  reason: SessionExpiredReason | null;
  onConfirm: () => void;
};

const TITLE_KEYS: Record<SessionExpiredReason, string> = {
  idle: 'session.expiredByInactivityTitle',
  unauthorized: 'session.expiredTitle',
};

const MESSAGE_KEYS: Record<SessionExpiredReason, string> = {
  idle: 'session.expiredByInactivityMessage',
  unauthorized: 'session.expiredMessage',
};

/**
 * Diálogo que muestra un mensaje informativo al expirar la sesión (por inactividad o por una respuesta 401).
 * 
 * @param open 
 * @param reason 
 * @param onConfirm
 * @returns Un componente de diálogo que muestra el mensaje de sesión expirada.
 */
export function SessionExpiredDialog({ open, reason, onConfirm }: Props) {
  const { translate } = useTranslate();

  const effectiveReason: SessionExpiredReason = reason ?? 'unauthorized';

  return (
    <Dialog
      open={open}
      disableEscapeKeyDown
      maxWidth="xs"
      fullWidth
      aria-labelledby="session-expired-title"
    >
      <DialogTitle id="session-expired-title">
        {translate(TITLE_KEYS[effectiveReason])}
      </DialogTitle>

      <DialogContent>
        <Stack spacing={1}>
          <Typography variant="body2" color="text.secondary">
            {translate(MESSAGE_KEYS[effectiveReason])}
          </Typography>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button variant="contained" onClick={onConfirm} autoFocus>
          {translate('session.goToLogin')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
