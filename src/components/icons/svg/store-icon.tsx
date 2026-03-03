
import React from 'react';

import { useTheme, useColorScheme } from '@mui/material/styles';

export const StoreIcon = (props: React.SVGProps<SVGSVGElement>) => {
  const theme = useTheme();
  const { mode } = useColorScheme();

  const strokeColor = mode === 'dark' ? theme.palette.common.white : '#363636';

  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M2.00659 7.47998V10.4733C2.00659 13.4666 3.20659 14.6666 6.19993 14.6666H9.79326C12.7866 14.6666 13.9866 13.4666 13.9866 10.4733V7.47998"
        stroke={strokeColor}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.99999 7.99992C9.21999 7.99992 10.12 7.00659 9.99999 5.78659L9.55999 1.33325H6.44666L5.99999 5.78659C5.87999 7.00659 6.77999 7.99992 7.99999 7.99992Z"
        stroke={strokeColor}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.2068 7.99992C13.5534 7.99992 14.5401 6.90659 14.4068 5.56659L14.2201 3.73325C13.9801 1.99992 13.3134 1.33325 11.5668 1.33325H9.53345L10.0001 6.00659C10.1134 7.10659 11.1068 7.99992 12.2068 7.99992Z"
        stroke={strokeColor}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.75992 7.99992C4.85992 7.99992 5.85325 7.10659 5.95992 6.00659L6.10659 4.53325L6.42659 1.33325H4.39326C2.64659 1.33325 1.97992 1.99992 1.73992 3.73325L1.55992 5.56659C1.42659 6.90659 2.41326 7.99992 3.75992 7.99992Z"
        stroke={strokeColor}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.99992 11.3333C6.88659 11.3333 6.33325 11.8866 6.33325 12.9999V14.6666H9.66659V12.9999C9.66659 11.8866 9.11325 11.3333 7.99992 11.3333Z"
        stroke={strokeColor}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
