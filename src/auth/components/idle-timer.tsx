'use client';

import { useIdleTimer } from 'react-idle-timer';

// ----------------------------------------------------------------------

type Props = {
  timeout: number;
  onIdle: () => void;
};

export function IdleTimer({ timeout, onIdle }: Props) {
  useIdleTimer({
    timeout,
    onIdle,
    throttle: 1000,
    crossTab: true,
  });

  return null;
}
