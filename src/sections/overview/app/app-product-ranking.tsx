import type { GridColDef } from '@mui/x-data-grid';
import type { CardProps } from '@mui/material/Card';
import type { LangCode } from 'src/locales/langs/i18n';
import type { SellerProductRankingItem } from 'src/interfaces/dashboard/seller-product-ranking';

import { useMemo, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { DataGrid } from '@mui/x-data-grid';
import { esES } from '@mui/x-data-grid/locales';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import LinearProgress from '@mui/material/LinearProgress';

import { fNumber, fPercent, fCurrency } from 'src/utils/format-number';

import { useTranslate } from 'src/locales';

import { EmptyContent } from 'src/components/empty-content';
import { FloatingScrollbar } from 'src/components/floating-scrollbar';

// ----------------------------------------------------------------------

type Props = CardProps & {
  title?: string;
  items: SellerProductRankingItem[];
  isLoading: boolean;
};

export function AppProductRanking({ title, items, isLoading, sx, ...other }: Props) {
  const { translate } = useTranslate();
  const currentLang = localStorage.getItem('i18n_lang') as LangCode | null;

  const NoRowsOverlay = useCallback(() => <EmptyContent filled sx={{ py: 6 }} />, []);

  const columns: GridColDef<SellerProductRankingItem>[] = useMemo(
    () => [
      {
        field: 'sku',
        headerName: translate('dashboardModule.productRanking.columns.sku'),
        width: 150,
      },
      {
        field: 'product_name',
        headerName: translate('dashboardModule.productRanking.columns.product'),
        flex: 1,
        minWidth: 240,
        renderCell: (params) => (
          <Typography variant="subtitle2" noWrap sx={{ display: 'flex', alignItems: 'center', height: 1 }}>
            {params.row.product_name || params.row.sku}
          </Typography>
        ),
      },
      {
        field: 'gross_sales',
        headerName: translate('dashboardModule.productRanking.columns.sales'),
        width: 160,
        align: 'right',
        headerAlign: 'right',
        valueFormatter: (value: number) => fCurrency(value),
      },
      {
        field: 'units_sold',
        headerName: translate('dashboardModule.productRanking.columns.units'),
        width: 120,
        align: 'right',
        headerAlign: 'right',
        valueFormatter: (value: number) => fNumber(value),
      },
      {
        field: 'visits',
        headerName: translate('dashboardModule.productRanking.columns.visits'),
        width: 120,
        align: 'right',
        headerAlign: 'right',
        valueFormatter: (value: number) => fNumber(value),
      },
      {
        field: 'participation',
        headerName: translate('dashboardModule.productRanking.columns.participation'),
        width: 180,
        align: 'right',
        headerAlign: 'right',
        renderCell: (params) => (
          <Box
            sx={{
              gap: 1,
              height: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}
          >
            <LinearProgress
              variant="determinate"
              value={Math.min(params.row.participation, 100)}
              sx={{ width: 64 }}
            />
            <Typography variant="body2">{fPercent(params.row.participation)}</Typography>
          </Box>
        ),
      },
    ],
    [translate]
  );

  return (
    <Card sx={sx} {...other}>
      <CardHeader title={title} />

      <FloatingScrollbar refreshKey={items}>
        <DataGrid<SellerProductRankingItem>
          rows={items}
          columns={columns}
          getRowId={(row) => row.product_id}
          loading={isLoading}
          pageSizeOptions={[10, 25, 50]}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          disableRowSelectionOnClick
          autoHeight
          localeText={
            currentLang === 'es' ? esES.components.MuiDataGrid.defaultProps.localeText : undefined
          }
          slots={{ noRowsOverlay: NoRowsOverlay }}
          slotProps={{ loadingOverlay: { variant: 'skeleton', noRowsVariant: 'skeleton' } }}
          sx={{
            border: 0,
            '& .MuiDataGrid-toolbar': { py: 0.5 },
            '& .MuiDataGrid-cell:focus': { outline: 'none' },
            '& .MuiDataGrid-virtualScroller': { minHeight: items.length === 0 ? 220 : 'auto' },
          }}
        />
      </FloatingScrollbar>
    </Card>
  );
}
