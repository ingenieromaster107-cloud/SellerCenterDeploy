import type { BadgeProps } from '@mui/material/Badge';

import { useState } from 'react';
import { Link } from 'react-router';
import { usePopover } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';

import { useTranslate } from 'src/locales';

import { Iconify } from 'src/components/iconify';
import { CustomPopover } from 'src/components/custom-popover';

import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export function ChatNavAccount() {
  const { user } = useAuthContext();

  const menuActions = usePopover();
  const { translate } = useTranslate();
  const [status] = useState<BadgeProps['variant']>('online');

  const renderMenuActions = () => (
    <CustomPopover
      open={menuActions.open}
      anchorEl={menuActions.anchorEl}
      onClose={menuActions.onClose}
      slotProps={{
        paper: { sx: { p: 0, ml: 0, mt: 0.5 } },
        arrow: { placement: 'top-left' },
      }}
    >
      <Box
        sx={{
          py: 2,
          pr: 1,
          pl: 2,
          gap: 2,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <ListItemText primary={user?.firstname} secondary={user?.email} />
      </Box>

      <Divider sx={{ borderStyle: 'dashed' }} />

      <MenuList sx={{ my: 0.5, px: 0.5 }}>
        <Link to="/account" style={{ textDecoration: 'none', color: 'inherit' }}>
          <MenuItem>
            <Iconify width={24} icon="solar:user-id-bold" />
            {translate('chatModule.profileResumeModal.profile')}
          </MenuItem>
        </Link>

        <Link to="/account?tab=configuration" style={{ textDecoration: 'none', color: 'inherit' }}>
          <MenuItem>
            <Iconify width={24} icon="solar:settings-bold" />
            {translate('chatModule.profileResumeModal.settings')}
          </MenuItem>
        </Link>
      </MenuList>
    </CustomPopover>
  );

  return (
    <>
      <Badge
        variant={status}
        badgeContent=" "
        overlap="circular"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Avatar
          src={user?.email}
          alt={user?.firstname}
          onClick={menuActions.onOpen}
          sx={{ cursor: 'pointer', width: 48, height: 48 }}
        >
          {user?.firstname?.charAt(0).toUpperCase()}
        </Avatar>
      </Badge>

      {renderMenuActions()}
    </>
  );
}
