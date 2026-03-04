
import React from 'react';


export interface MoonIconProps extends React.SVGProps<SVGSVGElement> {
  sx?: React.CSSProperties;
}

export const MoonIcon = ({ sx, ...props }: MoonIconProps) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={sx}
    {...props}
  >
    <g clipPath="url(#clip0_18736_5488)">
      <path
        d="M14.6366 8.63783C13.7187 10.248 11.9861 11.3336 10 11.3336C7.05452 11.3336 4.66671 8.94582 4.66671 6.0003C4.66671 4.01406 5.75249 2.28141 7.36289 1.36353C3.97987 1.68429 1.33337 4.53315 1.33337 8.00014C1.33337 11.682 4.31814 14.6668 8.00004 14.6668C11.4668 14.6668 14.3156 12.0206 14.6366 8.63783Z"
        stroke="#292929"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0_18736_5488">
        <rect width="16" height="16" fill="white" />
      </clipPath>
    </defs>
  </svg>
);
