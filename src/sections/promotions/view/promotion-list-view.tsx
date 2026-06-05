'use client';

import type { SellerPromotionStatus, SellerPromotionDataRaw } from 'src/interfaces/promotions';

import { useState, useCallback } from 'react';
import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Tabs from '@mui/material/Tabs';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useTranslate } from 'src/locales';
import { HomeContent } from 'src/layouts/home';
import { useGetSellerPromotions } from 'src/actions/promotions/use-get-seller-promotions';
import {
  usePauseSellerPromotion,
} from 'src/actions/promotions/use-pause-seller-promotion';
import {
  useDeleteSellerPromotion,
} from 'src/actions/promotions/use-delete-seller-promotion';
import {
  useActivateSellerPromotion,
} from 'src/actions/promotions/use-activate-seller-promotion';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { ErrorContent } from 'src/components/error-content';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import {
  useTable,
  TableNoData,
  getComparator,
  TableSkeleton,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

import { PROMOTION_STATUS_COLORS } from '../resources/constants';
import { PromotionTableRow } from '../components/promotion-table-row';
import { PromotionTableToolbar } from '../components/promotion-table-toolbar';

// ----------------------------------------------------------------------

type StatusTab = SellerPromotionStatus | 'all';

const STATUS_TABS: StatusTab[] = ['all', 'ACTIVE', 'PAUSED', 'PENDING_APPROVAL', 'EXPIRED', 'EXHAUSTED'];

// ----------------------------------------------------------------------

export function PromotionListView() {
  const { translate } = useTranslate();
  const router = useRouter();

  const [searchValue, setSearchValue] = useState('');
  const [statusTab, setStatusTab] = useState<StatusTab>('all');
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });

  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    type: 'delete' | 'pause' | 'activate' | null;
    promotionId: number | null;
  }>({ open: false, type: null, promotionId: null });

  const table = useTable({ defaultOrderBy: 'from_date', defaultOrder: 'desc' });

  const filter = statusTab !== 'all' ? { status: statusTab } : undefined;

  const { items, totalCount, isLoading, isFetching, isError } = useGetSellerPromotions({
    pageSize: paginationModel.pageSize,
    currentPage: paginationModel.page + 1,
    filter,
  });

  const isTableLoading = isLoading || isFetching;

  const { mutate: deletePromotion, isPending: isDeleting } = useDeleteSellerPromotion({
    onSuccess: () => {
      toast.success(translate('promotionsModule.confirmDelete.successMessage'));
      closeConfirmDialog();
    },
    onError: () => {
      toast.error(translate('promotionsModule.confirmDelete.errorMessage'));
    },
  });

  const { mutate: pausePromotion, isPending: isPausing } = usePauseSellerPromotion({
    onSuccess: () => {
      toast.success(translate('promotionsModule.confirmPause.successMessage'));
      closeConfirmDialog();
    },
    onError: () => {
      toast.error(translate('promotionsModule.confirmPause.errorMessage'));
    },
  });

  const { mutate: activatePromotion, isPending: isActivating } = useActivateSellerPromotion({
    onSuccess: () => {
      toast.success(translate('promotionsModule.confirmActivate.successMessage'));
      closeConfirmDialog();
    },
    onError: () => {
      toast.error(translate('promotionsModule.confirmActivate.errorMessage'));
    },
  });

  const filteredItems = items
    .filter((row) => {
      if (!searchValue) return true;
      const q = searchValue.toLowerCase();
      return (
        row.name.toLowerCase().includes(q) ||
        (row.coupon_code?.toLowerCase() ?? '').includes(q)
      );
    })
    .sort(getComparator(table.order, table.orderBy) as (a: any, b: any) => number);

  const closeConfirmDialog = useCallback(() => {
    setConfirmDialog({ open: false, type: null, promotionId: null });
  }, []);

  const handleOpenDeleteDialog = useCallback((id: number) => {
    setConfirmDialog({ open: true, type: 'delete', promotionId: id });
  }, []);

  const handleOpenPauseDialog = useCallback((id: number) => {
    setConfirmDialog({ open: true, type: 'pause', promotionId: id });
  }, []);

  const handleOpenActivateDialog = useCallback((id: number) => {
    setConfirmDialog({ open: true, type: 'activate', promotionId: id });
  }, []);

  const handleConfirmAction = useCallback(() => {
    if (!confirmDialog.promotionId) return;
    if (confirmDialog.type === 'delete') deletePromotion(confirmDialog.promotionId);
    if (confirmDialog.type === 'pause') pausePromotion(confirmDialog.promotionId);
    if (confirmDialog.type === 'activate') activatePromotion(confirmDialog.promotionId);
  }, [confirmDialog, deletePromotion, pausePromotion, activatePromotion]);

  const TABLE_HEAD = [
    { id: 'name', label: translate('promotionsModule.table.columns.name') },
    { id: 'discount_type', label: translate('promotionsModule.table.columns.discountType') },
    { id: 'apply_type', label: translate('promotionsModule.table.columns.applyType') },
    { id: 'discount_amount', label: translate('promotionsModule.table.columns.discountAmount') },
    { id: 'from_date', label: translate('promotionsModule.table.columns.fromDate') },
    { id: 'to_date', label: translate('promotionsModule.table.columns.toDate') },
    { id: 'times_used', label: translate('promotionsModule.table.columns.timesUsed'), align: 'center' as const },
    { id: 'status', label: translate('promotionsModule.table.columns.status') },
    { id: 'actions', label: translate('promotionsModule.table.columns.actions'), align: 'right' as const },
  ];

  const isConfirmPending = isDeleting || isPausing || isActivating;

  const confirmTitle =
    confirmDialog.type === 'delete'
      ? translate('promotionsModule.confirmDelete.title')
      : confirmDialog.type === 'pause'
        ? translate('promotionsModule.confirmPause.title')
        : translate('promotionsModule.confirmActivate.title');

  const confirmContent =
    confirmDialog.type === 'delete'
      ? translate('promotionsModule.confirmDelete.content')
      : confirmDialog.type === 'pause'
        ? translate('promotionsModule.confirmPause.content')
        : translate('promotionsModule.confirmActivate.content');

  if (isError) {
    return (
      <HomeContent>
        <ErrorContent
          title={translate('promotionsModule.errors.loadError.title')}
          description={translate('promotionsModule.errors.loadError.description')}
          sx={{ mt: 10 }}
          slotProps={{}}
        />
      </HomeContent>
    );
  }

  return (
    <HomeContent>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <CustomBreadcrumbs
          heading={translate('promotionsModule.list.heading')}
          links={[
            { name: translate('promotionsModule.breadcrumbs.home'), href: paths.home.root },
            { name: translate('promotionsModule.breadcrumbs.promotions') },
            { name: translate('promotionsModule.breadcrumbs.list') },
          ]}
        />
        <Button
          variant="contained"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={() => router.push(paths.promotions.create)}
        >
          {translate('promotionsModule.list.addPromotion')}
        </Button>
      </Stack>

      <Card>
        {/* Status tabs */}
        <Tabs
          value={statusTab}
          onChange={(_, val) => {
            setStatusTab(val as StatusTab);
            setPaginationModel((p) => ({ ...p, page: 0 }));
          }}
          sx={{
            px: 2.5,
            boxShadow: (theme) =>
              `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
          }}
        >
          {STATUS_TABS.map((tab) => (
            <Tab
              key={tab}
              value={tab}
              label={
                <Stack direction="row" alignItems="center" spacing={0.75}>
                  <Typography variant="body2">
                    {translate(`promotionsModule.status.${tab}`)}
                  </Typography>
                  {tab !== 'all' && (
                    <Label
                      variant={statusTab === tab ? 'filled' : 'soft'}
                      color={PROMOTION_STATUS_COLORS[tab as SellerPromotionStatus]}
                    >
                      {items.filter((i: SellerPromotionDataRaw) => i.status === tab).length}
                    </Label>
                  )}
                </Stack>
              }
            />
          ))}
        </Tabs>

        <PromotionTableToolbar
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          statusFilter={statusTab}
          onStatusChange={(val) => {
            setStatusTab(val);
            setPaginationModel((p) => ({ ...p, page: 0 }));
          }}
        />

        <Box sx={{ position: 'relative' }}>
          <Scrollbar>
            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
              <TableHeadCustom
                sx={{}}
                order={table.order}
                orderBy={table.orderBy}
                headCells={TABLE_HEAD}
                rowCount={filteredItems.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
              />

              <TableBody>
                {isTableLoading
                  ? [...Array(paginationModel.pageSize)].map((_, i) => (
                      <TableSkeleton key={i} sx={{ height: 68 }} />
                    ))
                  : filteredItems.map((row) => (
                      <PromotionTableRow
                        key={row.entity_id}
                        row={row}
                        onView={(id) => router.push(paths.promotions.details(id))}
                        onEdit={(id) => router.push(paths.promotions.edit(id))}
                        onPause={handleOpenPauseDialog}
                        onActivate={handleOpenActivateDialog}
                        onDelete={handleOpenDeleteDialog}
                      />
                    ))}

                {!isTableLoading && (
                  <TableEmptyRows
                    height={68}
                    emptyRows={Math.max(0, paginationModel.pageSize - filteredItems.length)}
                  />
                )}

                <TableNoData notFound={!isTableLoading && filteredItems.length === 0} />
              </TableBody>
            </Table>
          </Scrollbar>
        </Box>

        <TablePaginationCustom
          count={totalCount}
          page={paginationModel.page}
          rowsPerPage={paginationModel.pageSize}
          onPageChange={(_, page) => setPaginationModel((p) => ({ ...p, page }))}
          onRowsPerPageChange={(e) =>
            setPaginationModel({ page: 0, pageSize: parseInt(e.target.value, 10) })
          }
          dense={false}
          onChangeDense={table.onChangeDense}
        />
      </Card>

      {/* Confirm dialog */}
      <Dialog open={confirmDialog.open} onClose={closeConfirmDialog} maxWidth="xs" fullWidth>
        <DialogTitle>{confirmTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText>{confirmContent}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeConfirmDialog} disabled={isConfirmPending}>
            {translate('promotionsModule.actions.cancel')}
          </Button>
          <Button
            onClick={handleConfirmAction}
            color={confirmDialog.type === 'delete' ? 'error' : 'primary'}
            variant="contained"
            disabled={isConfirmPending}
          >
            {isConfirmPending
              ? '...'
              : confirmDialog.type === 'delete'
                ? translate('promotionsModule.confirmDelete.confirmButton')
                : translate('promotionsModule.actions.confirm')}
          </Button>
        </DialogActions>
      </Dialog>
    </HomeContent>
  );
}
