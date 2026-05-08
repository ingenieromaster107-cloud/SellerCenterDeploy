import { useState } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

interface CsvPreviewTableProps {
  headers: string[];
  rows: Array<Record<string, string>>;
  rowErrorMap: Map<number, string[]>;
  /** Texto i18n para "Fila X con errores", se concatena con \n del array. */
  errorTooltipTitle: string;
  /** Texto i18n para el contador en el header. */
  rowsLabel: string;
  errorsLabel: string;
  /** Texto i18n para "celda vacía". */
  emptyCellLabel: string;
}

export const CsvPreviewTable = ({
  headers,
  rows,
  rowErrorMap,
  errorTooltipTitle,
  rowsLabel,
  errorsLabel,
  emptyCellLabel,
}: Readonly<CsvPreviewTableProps>) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const totalErrors = rowErrorMap.size;
  const start = page * rowsPerPage;
  const visibleRows = rows.slice(start, start + rowsPerPage);

  return (
    <Stack spacing={1.5}>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ flexWrap: 'wrap' }}>
        <Typography variant="body2">
          <strong>{rows.length}</strong> {rowsLabel}
        </Typography>
        {totalErrors > 0 && (
          <Stack direction="row" spacing={0.5} alignItems="center" sx={{ color: 'error.main' }}>
            <Iconify icon="solar:close-circle-bold" width={16} />
            <Typography variant="body2">
              <strong>{totalErrors}</strong> {errorsLabel}
            </Typography>
          </Stack>
        )}
      </Stack>

      <TableContainer component={Paper} sx={{ maxHeight: 360 }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: 56, fontWeight: 600 }}>#</TableCell>
              {headers.map((h) => (
                <TableCell key={h} sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>
                  {h}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleRows.map((row, i) => {
              const absoluteIdx = start + i;
              const errors = rowErrorMap.get(absoluteIdx);
              const hasError = !!errors && errors.length > 0;
              return (
                <TableRow
                  key={absoluteIdx}
                  sx={{
                    bgcolor: hasError ? 'error.lighter' : 'inherit',
                    '&:hover': { bgcolor: hasError ? 'error.lighter' : 'action.hover' },
                  }}
                >
                  <TableCell sx={{ verticalAlign: 'top' }}>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <Typography variant="caption">{absoluteIdx + 1}</Typography>
                      {hasError && (
                        <Tooltip
                          title={
                            <Box>
                              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                                {errorTooltipTitle}
                              </Typography>
                              {errors!.map((e, idx) => (
                                <div key={idx}>• {e}</div>
                              ))}
                            </Box>
                          }
                          arrow
                        >
                          <Box
                            sx={{
                              display: 'inline-flex',
                              color: 'error.main',
                              cursor: 'help',
                            }}
                          >
                            <Iconify icon="solar:close-circle-bold" width={16} />
                          </Box>
                        </Tooltip>
                      )}
                    </Stack>
                  </TableCell>
                  {headers.map((h) => {
                    const value = row[h];
                    const isEmpty = value === undefined || String(value).trim() === '';
                    return (
                      <TableCell
                        key={h}
                        sx={{
                          verticalAlign: 'top',
                          maxWidth: 200,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {isEmpty ? (
                          <Typography variant="caption" sx={{ color: 'text.disabled', fontStyle: 'italic' }}>
                            {emptyCellLabel}
                          </Typography>
                        ) : (
                          <Tooltip title={String(value)} placement="top-start">
                            <span>{String(value)}</span>
                          </Tooltip>
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={rows.length}
        page={page}
        onPageChange={(_, p) => setPage(p)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
        rowsPerPageOptions={[10, 25, 50, 100]}
      />
    </Stack>
  );
};
