import type { MassUploadResultRowInterface } from 'src/interfaces/load/bulk-loading.interface';

import { useMemo, useState } from 'react';

import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

interface UploadResultsDetailTableProps {
  results: MassUploadResultRowInterface[];
  labels: {
    rowColumn: string;
    productColumn: string;
    statusColumn: string;
    messageColumn: string;
    fieldsColumn: string;
    statusSuccess: string;
    statusFailed: string;
    showOnlyFailed: string;
    showAll: string;
  };
}

export const UploadResultsDetailTable = ({
  results,
  labels,
}: Readonly<UploadResultsDetailTableProps>) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [onlyFailed, setOnlyFailed] = useState(true);

  const filtered = useMemo(
    () => (onlyFailed ? results.filter((r) => r.status !== 'success') : results),
    [results, onlyFailed]
  );

  const start = page * rowsPerPage;
  const visible = filtered.slice(start, start + rowsPerPage);

  return (
    <Stack spacing={1.5}>
      <Stack direction="row" justifyContent="flex-end">
        <Button
          size="small"
          variant="text"
          startIcon={<Iconify icon={onlyFailed ? 'solar:list-bold' : 'solar:eye-bold'} width={16} />}
          onClick={() => {
            setOnlyFailed((v) => !v);
            setPage(0);
          }}
        >
          {onlyFailed ? labels.showAll : labels.showOnlyFailed}
        </Button>
      </Stack>

      <TableContainer component={Paper} sx={{ maxHeight: 360 }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: 64, fontWeight: 600 }}>{labels.rowColumn}</TableCell>
              <TableCell sx={{ width: 100, fontWeight: 600 }}>{labels.productColumn}</TableCell>
              <TableCell sx={{ width: 100, fontWeight: 600 }}>{labels.statusColumn}</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>{labels.messageColumn}</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>{labels.fieldsColumn}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visible.map((r) => (
              <TableRow key={r.row}>
                <TableCell>{r.row}</TableCell>
                <TableCell>{r.product_id ?? '—'}</TableCell>
                <TableCell>
                  <Label
                    variant="soft"
                    color={r.status === 'success' ? 'success' : 'error'}
                    sx={{ textTransform: 'uppercase' }}
                  >
                    {r.status === 'success' ? labels.statusSuccess : labels.statusFailed}
                  </Label>
                </TableCell>
                <TableCell sx={{ maxWidth: 300 }}>
                  <Typography variant="body2">{r.message}</Typography>
                </TableCell>
                <TableCell>
                  {r.errors.length > 0 ? (
                    <Stack spacing={0.5}>
                      {r.errors.map((err, idx) => (
                        <Typography key={idx} variant="caption">
                          <strong>{err.field}:</strong> {err.message}
                        </Typography>
                      ))}
                    </Stack>
                  ) : (
                    <Typography variant="caption" sx={{ color: 'text.disabled' }}>—</Typography>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={filtered.length}
        page={page}
        onPageChange={(_, p) => setPage(p)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
        rowsPerPageOptions={[10, 25, 50]}
      />
    </Stack>
  );
};
