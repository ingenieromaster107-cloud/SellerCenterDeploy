'use client';

import {
  ToolbarLeftPanel,
  ToolbarContainer,
  ToolbarRightPanel,
  CustomToolbarQuickFilter,
  CustomToolbarFilterButton,
  CustomToolbarExportButton,
  CustomToolbarColumnsButton,
} from 'src/components/custom-data-grid';

import { MovementsToolbar } from './movements-toolbar';

type MovementsTableToolbarProps = {
  dateFrom: string;
  dateTo: string;
  onChange: (dateFrom: string, dateTo: string) => void;
  onExport: () => void;
  isExporting: boolean;
  exportLimitExceeded: boolean;
};

export function MovementsTableToolbar({
  dateFrom,
  dateTo,
  onChange,
  onExport,
  isExporting,
  exportLimitExceeded,
}: MovementsTableToolbarProps) {
  return (
    <ToolbarContainer sx={{ p: 2 }}>
      <ToolbarLeftPanel>
        <MovementsToolbar
          dateFrom={dateFrom}
          dateTo={dateTo}
          onChange={onChange}
          onExport={onExport}
          isExporting={isExporting}
          exportLimitExceeded={exportLimitExceeded}
        />
      </ToolbarLeftPanel>

      <ToolbarRightPanel>
        <CustomToolbarColumnsButton showLabel={false} />
        <CustomToolbarFilterButton showLabel={false} />
        <CustomToolbarExportButton showLabel={false} />
        <CustomToolbarQuickFilter />
      </ToolbarRightPanel>
    </ToolbarContainer>
  );
}
