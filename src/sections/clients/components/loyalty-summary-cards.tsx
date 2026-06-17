import type { SellerLoyaltyData } from 'src/interfaces/clients/seller-loyalty';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';

import { fNumber, fPercent } from 'src/utils/format-number';

import { useTranslate } from 'src/locales';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  summary: SellerLoyaltyData;
  isLoading: boolean;
};

export function LoyaltySummaryCards({ summary, isLoading }: Props) {
  const { translate } = useTranslate();

  const cards = [
    {
      title: translate('clientsModule.loyalty.cards.total'),
      value: fNumber(summary.total_customers),
      icon: 'solar:users-group-rounded-bold-duotone',
      color: 'primary.main',
      bg: 'primary.lighter',
    },
    {
      title: translate('clientsModule.loyalty.cards.new'),
      value: fNumber(summary.new_customers),
      icon: 'solar:user-plus-bold',
      color: 'info.main',
      bg: 'info.lighter',
    },
    {
      title: translate('clientsModule.loyalty.cards.frequent'),
      value: fNumber(summary.frequent_customers),
      icon: 'solar:heart-bold',
      color: 'success.main',
      bg: 'success.lighter',
    },
    {
      title: translate('clientsModule.loyalty.cards.loyaltyRate'),
      value: fPercent(summary.loyalty_rate),
      icon: 'solar:cup-star-bold',
      color: 'warning.main',
      bg: 'warning.lighter',
    },
  ] as const;

  return (
    <Box
      sx={{
        gap: 2,
        mb: 3,
        display: 'grid',
        gridTemplateColumns: {
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(4, 1fr)',
        },
      }}
    >
      {cards.map((card) => (
        <Card key={card.title} variant="outlined" sx={{ p: 2.5 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar variant="rounded" sx={{ width: 44, height: 44, color: card.color, bgcolor: card.bg }}>
              <Iconify icon={card.icon} width={24} />
            </Avatar>
            <Stack spacing={0.25}>
              <Typography variant="caption" color="text.secondary">
                {card.title}
              </Typography>
              {isLoading ? (
                <Skeleton width={56} height={28} />
              ) : (
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {card.value}
                </Typography>
              )}
            </Stack>
          </Stack>
        </Card>
      ))}
    </Box>
  );
}
