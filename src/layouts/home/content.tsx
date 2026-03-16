'use client';

import { ReactNode } from 'react';

import { mergeClasses } from 'minimal-shared/utils';

import { Breakpoint, styled, SxProps, Theme } from '@mui/material/styles';
import Container, { ContainerProps } from '@mui/material/Container';

import { useSettingsContext } from 'src/components/settings';

import { layoutClasses } from '../core';

// ----------------------------------------------------------------------

type HomeContentProps = ContainerProps & {
  children?: ReactNode;
  sx?: SxProps<Theme>;
  className?: string;
  disablePadding?: boolean;
  maxWidth?: ContainerProps['maxWidth'];
  layoutQuery?: Breakpoint;
};

export function HomeContent({
  sx,
  children,
  className,
  disablePadding = false,
  maxWidth = 'lg',
  layoutQuery = 'lg',
  ...other
}: HomeContentProps) {
  const settings = useSettingsContext();

  const isNavHorizontal = settings.state.navLayout === 'horizontal';

  return (
    <Container
      className={mergeClasses([layoutClasses.content, className])}
      maxWidth={settings.state.compactLayout ? maxWidth : false}
      sx={[
        (theme: Theme) => ({
          display: 'flex',
          flex: '1 1 auto',
          flexDirection: 'column',
          pt: 'var(--layout-home-content-pt)',
          pb: 'var(--layout-home-content-pb)',
          [theme.breakpoints.up(layoutQuery)]: {
            px: 'var(--layout-home-content-px)',
            ...(isNavHorizontal && { '--layout-home-content-pt': '40px' }),
          },
          ...(disablePadding && {
            p: {
              xs: 0,
              sm: 0,
              md: 0,
              lg: 0,
              xl: 0,
            },
          }),
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      {children}
    </Container>
  );
}

// ----------------------------------------------------------------------

export const VerticalDivider = styled('span')(({ theme }) => ({
  width: 1,
  height: 10,
  flexShrink: 0,
  display: 'none',
  position: 'relative',
  alignItems: 'center',
  flexDirection: 'column',
  marginLeft: theme.spacing(2.5),
  marginRight: theme.spacing(2.5),
  backgroundColor: 'currentColor',
  color: theme.vars.palette.divider,
  '&::before, &::after': {
    top: -5,
    width: 3,
    height: 3,
    content: '""',
    flexShrink: 0,
    borderRadius: '50%',
    position: 'absolute',
    backgroundColor: 'currentColor',
  },
  '&::after': { bottom: -5, top: 'auto' },
}));