'use client';

import type { BoxProps } from '@mui/material/Box';
import type { Theme, SxProps } from '@mui/material/styles';
import type { TypographyProps } from '@mui/material/Typography';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { useTranslate } from 'src/locales';

// ----------------------------------------------------------------------

type SearchNotFoundProps = BoxProps & {
  query?: string;
  sx?: SxProps<Theme>;
  slotProps?: {
    title?: TypographyProps;
    description?: TypographyProps;
  };
};

export function SearchNotFound({ query, sx, slotProps, ...other }: SearchNotFoundProps) {
  const { translate } = useTranslate();
  if (!query) {
    return (
      <Typography variant="body2" {...slotProps?.description}>
        {translate('chatModule.sideBar.contactsSearcher.errorMessages.notFound')}
      </Typography>
    );
  }

  return (
    <Box
      sx={[
        {
          gap: 1,
          display: 'flex',
          borderRadius: 1.5,
          textAlign: 'center',
          flexDirection: 'column',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Typography
        variant="h6"
        {...slotProps?.title}
        sx={[
          { color: 'text.primary' },
          ...(Array.isArray(slotProps?.title?.sx) ? slotProps.title.sx : [slotProps?.title?.sx]),
        ]}
      >
        {translate('chatModule.sideBar.contactsSearcher.errorMessages.notFound')}&nbsp;
      </Typography>

      <Typography variant="body2" {...slotProps?.description}>
        {translate('chatModule.sideBar.contactsSearcher.errorMessages.notResultsFoundFor')}&nbsp;
        <strong>{`"${query}"`}</strong>
        .
        <br /> {translate('chatModule.sideBar.contactsSearcher.errorMessages.tryWithAnotherKeyword')}
      </Typography>
    </Box>
  );
}
