
import React from 'react';

import { useTheme, useColorScheme } from '@mui/material/styles';

interface Props extends React.SVGProps<SVGSVGElement> {
  active?: boolean;
}

export const NotificationBellIcon = ({ active = false, ...props }: Props) => {
  const theme = useTheme();
  const { mode } = useColorScheme();

  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 15 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M11.9545 7.2605V6.75917C11.9545 4.00788 9.75522 1.77783 7.04539 1.77783C4.33557 1.77783 2.13629 4.00788 2.13629 6.75917V7.2605C2.13717 7.85894 1.9625 8.44507 1.63302 8.94939L0.827197 10.1761C0.0919222 11.2961 0.653378 12.8185 1.93265 13.1727C5.27542 14.0983 8.81537 14.0983 12.1581 13.1727C13.4374 12.8185 13.9989 11.2961 13.2636 10.1768L12.4578 8.9501C12.128 8.44586 11.9531 7.85972 11.9538 7.26121L11.9545 7.2605Z"
        stroke={
          mode === 'dark'
            ? theme.palette.common.white
            : '#363636'
        }
      />
      <path
        d="M3.77234 13.8667C4.2487 15.1097 5.5338 16 7.04507 16C8.55635 16 9.84144 15.1097 10.3178 13.8667"
        stroke={
          mode === 'dark'
            ? theme.palette.common.white
            : '#363636'
        }
        strokeLinecap="round"
      />

      {active && (
        <path
          d="M12.8635 7.1111C15.6595 7.1111 17.4053 4.14861 16.0081 1.77777C15.6894 1.23728 15.231 0.78844 14.679 0.476376C14.127 0.164312 13.5009 1.5855e-05 12.8635 0C10.0676 0 8.32178 2.96248 9.71902 5.33332C10.0377 5.87382 10.4961 6.32266 11.048 6.63472C11.6 6.94679 12.2262 7.11108 12.8635 7.1111Z"
          fill="#D80F45"
        />
      )}
    </svg>
  );
};
