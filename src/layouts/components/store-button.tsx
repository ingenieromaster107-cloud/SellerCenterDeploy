

import IconButton from '@mui/material/IconButton';

import { StoreIcon } from 'src/components/icons';

interface Props {
    sx?: object;
}

export function StoreButton({ sx, ...props }: Props) {
  return (
    <IconButton sx={{ ...sx }} {...props}>
      <StoreIcon />
    </IconButton>
  );
}
