import type { LinkProps } from '@mui/material/Link';

import Link from '@mui/material/Link';

import { RouterLink } from 'src/routes/components';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type FormReturnLinkProps = Omit<LinkProps, 'href'> & {
  href?: string;
  to?: string;
  icon?: React.ReactNode;
  label?: React.ReactNode;
};

export function FormReturnLink({ sx, href, to, label, icon, children, ...other }: FormReturnLinkProps) {
  const resolvedTo = to ?? href ?? '#';

  return (
    <Link
      component={RouterLink}
      to={resolvedTo}
      color="inherit"
      variant="subtitle2"
      sx={[
        {
          mt: 3,
          gap: 0.5,
          mx: 'auto',
          alignItems: 'center',
          display: 'inline-flex',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      {icon || <Iconify width={16} icon="eva:arrow-ios-back-fill" />}
      {label || 'Return to sign in'}
      {children}
    </Link>
  );
}
