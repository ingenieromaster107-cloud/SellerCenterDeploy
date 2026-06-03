'use client';

import { toast } from 'sonner';
import { useCallback } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';

import { paths } from 'src/routes/paths';

import { useMovementsFilters } from 'src/hooks/movements/use-movements-filters';

import { downloadCsvBlob } from 'src/utils/download-blob';

import { useTranslate } from 'src/locales';
import { HomeContent } from 'src/layouts/home';
import { useExportMovements } from 'src/actions/movements/use-export-movements';
import { useGetMovementsList } from 'src/actions/movements/use-get-movements-list';
import { useGetMovementsSummary } from 'src/actions/movements/use-get-movements-summary';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { MovementsTable } from '../components/movements-table';
import { MovementsSummaryCards } from '../components/movements-summary';

export function MovementsView() {
  const { translate } = useTranslate();

  const { filters, pagination, setDateRange, toggleCategory, setPagination } =
    useMovementsFilters();

  const { summary, isLoading: summaryLoading } = useGetMovementsSummary(
    filters.dateFrom,
    filters.dateTo
  );

  const { items, totalCount, isFetching } = useGetMovementsList(filters, pagination);

  const exportMutation = useExportMovements();

  const handleExport = useCallback(async () => {
    try {
      const csv = await exportMutation.mutateAsync({
        dateFrom: filters.dateFrom,
        dateTo: filters.dateTo,
      });
      downloadCsvBlob(csv, `movimientos_${filters.dateFrom}_${filters.dateTo}.csv`);
      toast.success(translate('movements.export.success'));
    } catch {
      toast.error(translate('movements.export.error'));
    }
  }, [exportMutation, filters.dateFrom, filters.dateTo, translate]);

  return (
    <HomeContent>
      <CustomBreadcrumbs
        heading={translate('movements.title')}
        links={[
          { name: translate('sidebarMenu.home.title'), href: paths.home.root },
          { name: translate('movements.title') },
        ]}
        sx={{ mb: 3 }}
      />

      <Stack spacing={3}>
        <MovementsSummaryCards
          summary={summary}
          isLoading={summaryLoading}
          activeCategories={filters.categories}
          onToggleCategory={toggleCategory}
        />

        <Card sx={{ p: { xs: 2, md: 3 } }}>
          <MovementsTable
            rows={items}
            totalCount={totalCount}
            isLoading={isFetching}
            pagination={pagination}
            onPaginationChange={setPagination}
            dateFrom={filters.dateFrom}
            dateTo={filters.dateTo}
            activeCategories={filters.categories}
            onDateRangeChange={setDateRange}
            onExport={handleExport}
            isExporting={exportMutation.isPending}
          />
        </Card>
      </Stack>
    </HomeContent>
  );
}
