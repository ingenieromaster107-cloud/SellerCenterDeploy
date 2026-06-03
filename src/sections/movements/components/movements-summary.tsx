import type { IconifyName } from 'src/components/iconify';
import type { MovementCategory, MovementsSummary } from '../types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';

import { fCurrencyCop } from 'src/utils/format-number';

import { useTranslate } from 'src/locales';

import { Iconify } from 'src/components/iconify';

import { MOVEMENT_CATEGORY } from '../constants';

type MovementsSummaryCardsProps = {
  summary?: MovementsSummary;
  isLoading: boolean;
  activeCategories: MovementCategory[];
  onToggleCategory: (category: MovementCategory) => void;
};

type CardSpec = {
  i18nKey: string;
  value: number;
  icon: IconifyName;
  color: 'primary' | 'success' | 'warning' | 'error';
  /** When set, the card acts as a toggle filter for this category. */
  category?: MovementCategory;
};

export function MovementsSummaryCards({
  summary,
  isLoading,
  activeCategories,
  onToggleCategory,
}: MovementsSummaryCardsProps) {
  const { translate } = useTranslate();

  const cards: CardSpec[] = [
    {
      i18nKey: 'movements.summary.grossSales',
      value: summary?.gross_sales ?? 0,
      icon: 'solar:cart-3-bold',
      color: 'success',
      category: MOVEMENT_CATEGORY.SALE,
    },
    {
      i18nKey: 'movements.summary.totalCommissions',
      value: summary?.total_commissions ?? 0,
      icon: 'solar:tag-horizontal-bold-duotone',
      color: 'warning',
      category: MOVEMENT_CATEGORY.COMMISSION,
    },
    {
      i18nKey: 'movements.summary.totalRefunds',
      value: summary?.total_refunds ?? 0,
      icon: 'solar:close-circle-bold',
      color: 'error',
      category: MOVEMENT_CATEGORY.REFUND,
    },
    {
      i18nKey: 'movements.summary.netSeller',
      value: summary?.net_seller ?? 0,
      icon: 'solar:wad-of-money-bold',
      color: 'primary',
    },
  ];

  return (
    <Box
      sx={{
        display: 'grid',
        gap: 2,
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          lg: 'repeat(4, 1fr)',
        },
      }}
    >
      {cards.map((card) => {
        const clickable = Boolean(card.category);
        const isActive = card.category ? activeCategories.includes(card.category) : false;

        return (
          <Card
            key={card.i18nKey}
            onClick={clickable ? () => onToggleCategory(card.category!) : undefined}
            role={clickable ? 'button' : undefined}
            aria-pressed={clickable ? isActive : undefined}
            tabIndex={clickable ? 0 : undefined}
            onKeyDown={
              clickable
                ? (event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      onToggleCategory(card.category!);
                    }
                  }
                : undefined
            }
            sx={(theme) => ({
              p: 2.5,
              position: 'relative',
              transition: theme.transitions.create(['box-shadow', 'border-color', 'transform'], {
                duration: theme.transitions.duration.shortest,
              }),
              border: '2px solid',
              borderColor: isActive ? theme.palette[card.color].main : 'transparent',
              ...(clickable && {
                cursor: 'pointer',
                '&:hover': {
                  boxShadow: theme.customShadows?.z8 ?? theme.shadows[8],
                  borderColor: isActive
                    ? theme.palette[card.color].main
                    : theme.palette[card.color].light,
                },
              }),
              ...(isActive && {
                bgcolor: theme.palette[card.color].lighter ?? theme.palette[card.color].light,
                boxShadow: theme.customShadows?.z8 ?? theme.shadows[8],
              }),
            })}
          >
            {isActive && (
              <Box
                sx={(theme) => ({
                  position: 'absolute',
                  top: 10,
                  right: 10,
                  color: theme.palette[card.color].main,
                  display: 'flex',
                })}
              >
                <Iconify icon="solar:check-circle-bold" width={20} />
              </Box>
            )}

            <Stack direction="row" alignItems="center" spacing={2}>
              <Box
                sx={(theme) => ({
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: isActive
                    ? theme.palette[card.color].main
                    : (theme.palette[card.color].lighter ?? theme.palette[card.color].light),
                  color: isActive
                    ? theme.palette[card.color].contrastText
                    : (theme.palette[card.color].dark ?? theme.palette[card.color].main),
                })}
              >
                <Iconify icon={card.icon} width={24} />
              </Box>

              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography variant="caption" color="text.secondary" noWrap>
                  {translate(card.i18nKey)}
                </Typography>
                {isLoading ? (
                  <Skeleton variant="text" width={120} height={28} />
                ) : (
                  <Typography variant="h6" noWrap>
                    {fCurrencyCop(card.value)}
                  </Typography>
                )}
              </Box>
            </Stack>
          </Card>
        );
      })}
    </Box>
  );
}
