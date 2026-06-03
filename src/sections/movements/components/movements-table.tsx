import type { GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import type { LangCode } from 'src/locales/langs/i18n';
import type { Movement, MovementCategory, MovementsPagination } from '../types';

import { useRef, useMemo, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { esES } from '@mui/x-data-grid/locales';

import { fCurrencyCop } from 'src/utils/format-number';
import { fDate, FORMAT_PATTERNS } from 'src/utils/format-time';

import { useTranslate } from 'src/locales';

import { Label } from 'src/components/label';

import { MovementsEmpty } from './movements-empty';
import { MovementsTableToolbar } from './movements-table-toolbar';
import { MOVEMENT_CATEGORY, MOVEMENT_CATEGORY_COLOR } from '../constants';

type MoneyTone = 'plain' | 'net';

function renderMoney(value: number | null, emphasis: boolean, tone: MoneyTone = 'plain') {
  const amount = value ?? 0;

  if (amount === 0) {
    return (
      <Box component="span" sx={{ color: 'text.disabled' }}>
        —
      </Box>
    );
  }

  const color =
    tone === 'net'
      ? amount < 0
        ? 'error.main'
        : 'success.main'
      : emphasis
        ? 'text.primary'
        : 'text.secondary';

  return (
    <Box component="span" sx={{ color, fontWeight: emphasis || tone === 'net' ? 600 : 400 }}>
      {fCurrencyCop(amount)}
    </Box>
  );
}

type MovementsTableProps = {
  rows: Movement[];
  totalCount: number;
  isLoading: boolean;
  pagination: MovementsPagination;
  onPaginationChange: (pagination: MovementsPagination) => void;
  dateFrom: string;
  dateTo: string;
  activeCategories: MovementCategory[];
  onDateRangeChange: (dateFrom: string, dateTo: string) => void;
  onExport: () => void;
  isExporting: boolean;
};

export function MovementsTable({
  rows,
  totalCount,
  isLoading,
  pagination,
  onPaginationChange,
  dateFrom,
  dateTo,
  activeCategories,
  onDateRangeChange,
  onExport,
  isExporting,
}: MovementsTableProps) {
  const { translate } = useTranslate();
  const currentLang = localStorage.getItem('i18n_lang') as LangCode | null;

  const NoRowsOverlay = useCallback(
    () => (
      <MovementsEmpty dateFrom={dateFrom} dateTo={dateTo} activeCategories={activeCategories} />
    ),
    [dateFrom, dateTo, activeCategories]
  );

  const Toolbar = useCallback(
    () => (
      <MovementsTableToolbar
        dateFrom={dateFrom}
        dateTo={dateTo}
        onChange={onDateRangeChange}
        onExport={onExport}
        isExporting={isExporting}
      />
    ),
    [dateFrom, dateTo, onDateRangeChange, onExport, isExporting]
  );

  // Scrollbar horizontal flotante: solo aparece mientras el nativo queda bajo el viewport.
  const wrapperRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const lastRef = useRef({ visible: false, left: 0, width: 0 });
  const [floatBar, setFloatBar] = useState({ visible: false, left: 0, width: 0 });

  useEffect(() => {
    const root = wrapperRef.current;
    const bar = barRef.current;
    const inner = innerRef.current;
    if (!root || !bar || !inner) return undefined;
    const scroller = root.querySelector<HTMLDivElement>('.MuiDataGrid-virtualScroller');
    if (!scroller) return undefined;

    let syncing = false; // evita el eco entre ambos scrolls

    const recompute = () => {
      const hasOverflow = scroller.scrollWidth - scroller.clientWidth > 1;
      const scRect = scroller.getBoundingClientRect();
      const nativeVisible = scRect.bottom <= window.innerHeight + 4;
      const visible = hasOverflow && !nativeVisible;

      inner.style.width = `${scroller.scrollWidth}px`;

      const next = { visible, left: scRect.left, width: scroller.clientWidth };
      const prev = lastRef.current;
      if (prev.visible !== next.visible || prev.left !== next.left || prev.width !== next.width) {
        lastRef.current = next;
        setFloatBar(next);
      }
    };

    const onBarScroll = () => {
      if (syncing) {
        syncing = false;
        return;
      }
      syncing = true;
      scroller.scrollLeft = bar.scrollLeft;
    };

    const onScrollerScroll = () => {
      if (syncing) {
        syncing = false;
        return;
      }
      syncing = true;
      bar.scrollLeft = scroller.scrollLeft;
    };

    recompute();
    bar.addEventListener('scroll', onBarScroll, { passive: true });
    scroller.addEventListener('scroll', onScrollerScroll, { passive: true });
    window.addEventListener('scroll', recompute, { passive: true });
    window.addEventListener('resize', recompute);
    const observer = new ResizeObserver(recompute);
    observer.observe(scroller);

    return () => {
      bar.removeEventListener('scroll', onBarScroll);
      scroller.removeEventListener('scroll', onScrollerScroll);
      window.removeEventListener('scroll', recompute);
      window.removeEventListener('resize', recompute);
      observer.disconnect();
    };
  }, [rows]);

  const columns: GridColDef<Movement>[] = useMemo(
    () => [
      {
        field: 'created_at',
        headerName: translate('movements.table.date'),
        width: 130,
        valueFormatter: (value: string) => fDate(value, FORMAT_PATTERNS.paramCase.date),
      },
      {
        field: 'order_increment_id',
        headerName: translate('movements.table.order'),
        width: 140,
      },
      {
        field: 'category',
        headerName: translate('movements.table.category'),
        width: 140,
        renderCell: (params) => (
          <Label variant="soft" color={MOVEMENT_CATEGORY_COLOR[params.row.category]}>
            {translate(`movements.category.${params.row.category}`)}
          </Label>
        ),
      },
      {
        field: 'product_name',
        headerName: translate('movements.table.product'),
        flex: 1,
        minWidth: 200,
        valueFormatter: (value: string | null) => value ?? '—',
      },
      {
        field: 'amount',
        headerName: translate('movements.table.amount'),
        width: 150,
        align: 'right',
        headerAlign: 'right',
        renderCell: (params) =>
          renderMoney(
            params.row.amount,
            params.row.category === MOVEMENT_CATEGORY.SALE ||
              params.row.category === MOVEMENT_CATEGORY.REFUND
          ),
      },
      {
        field: 'commission_value',
        headerName: translate('movements.table.commission'),
        width: 140,
        align: 'right',
        headerAlign: 'right',
        renderCell: (params) =>
          renderMoney(
            params.row.commission_value,
            params.row.category === MOVEMENT_CATEGORY.COMMISSION
          ),
      },
      {
        field: 'net_value',
        headerName: translate('movements.table.net'),
        width: 140,
        align: 'right',
        headerAlign: 'right',
        renderCell: (params) => renderMoney(params.row.net_value, false, 'net'),
      },
      {
        field: 'guide_number',
        headerName: translate('movements.table.guide'),
        width: 150,
        valueFormatter: (value: string | null) => value ?? '—',
      },
      {
        field: 'order_status',
        headerName: translate('movements.table.orderStatus'),
        width: 140,
        valueFormatter: (value: string | null) => value ?? '—',
      },
    ],
    [translate]
  );

  // Agrupación visual por orden: banda alterna + separador al inicio de cada grupo.
  const groupMeta = useMemo(() => {
    const separatorIds = new Set<string>();
    const altIds = new Set<string>();
    let prevOrder: string | null = null;
    let groupIndex = -1;

    rows.forEach((row, index) => {
      if (row.order_increment_id !== prevOrder) {
        groupIndex += 1;
        prevOrder = row.order_increment_id;
        if (index > 0) separatorIds.add(row.movement_id);
      }
      if (groupIndex % 2 === 1) altIds.add(row.movement_id);
    });

    return { separatorIds, altIds };
  }, [rows]);

  const paginationModel: GridPaginationModel = {
    page: pagination.page,
    pageSize: pagination.pageSize,
  };

  return (
    <Box ref={wrapperRef} sx={{ width: '100%', position: 'relative' }}>
      <DataGrid<Movement>
        rows={rows}
        columns={columns}
        getRowId={(row) => row.movement_id}
        getRowClassName={(params) =>
          [
            groupMeta.altIds.has(params.row.movement_id) ? 'mv-group-alt' : '',
            groupMeta.separatorIds.has(params.row.movement_id) ? 'mv-group-start' : '',
          ]
            .filter(Boolean)
            .join(' ')
        }
        loading={isLoading}
        rowCount={totalCount}
        paginationMode="server"
        paginationModel={paginationModel}
        onPaginationModelChange={(model) =>
          onPaginationChange({ page: model.page, pageSize: model.pageSize })
        }
        pageSizeOptions={[10, 25, 50, 100]}
        disableRowSelectionOnClick
        autoHeight
        localeText={
          currentLang === 'es' ? esES.components.MuiDataGrid.defaultProps.localeText : undefined
        }
        slots={{ toolbar: Toolbar, noRowsOverlay: NoRowsOverlay }}
        sx={{
          '& .MuiDataGrid-cell:focus': { outline: 'none' },
          '& .MuiDataGrid-virtualScroller': { minHeight: rows.length === 0 ? 340 : 220 },
          '& .MuiDataGrid-row.mv-group-alt': { bgcolor: 'action.hover' },
          '& .MuiDataGrid-row.mv-group-start .MuiDataGrid-cell': {
            borderTop: '2px solid',
            borderTopColor: 'divider',
          },
        }}
      />

      <Box
        ref={barRef}
        sx={{
          position: 'fixed',
          bottom: 0,
          left: floatBar.left,
          width: floatBar.width,
          height: 14,
          display: floatBar.visible ? 'block' : 'none',
          overflowX: 'auto',
          overflowY: 'hidden',
          zIndex: (theme) => theme.zIndex.appBar,
          bgcolor: 'background.paper',
          borderTop: '1px solid',
          borderColor: 'divider',
          boxShadow: (theme) => theme.customShadows?.z8 ?? theme.shadows[8],
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': { height: 10 },
          '&::-webkit-scrollbar-thumb': {
            borderRadius: 5,
            backgroundColor: (theme) => theme.palette.text.disabled,
          },
        }}
      >
        <Box ref={innerRef} sx={{ height: 1 }} />
      </Box>
    </Box>
  );
}
