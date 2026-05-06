import type { MassUploadSummaryInterface } from 'src/interfaces/load/bulk-loading.interface';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

interface UploadResultsSummaryProps {
  summary: MassUploadSummaryInterface;
  labels: {
    total: string;
    processed: string;
    success: string;
    failed: string;
  };
}

type StatColor = 'primary' | 'success' | 'error' | 'info';

const Stat = ({
  iconNode,
  label,
  value,
  color,
}: {
  iconNode: React.ReactNode;
  label: string;
  value: number;
  color: StatColor;
}) => (
  <Card sx={{ flex: 1, minWidth: 140, p: 2 }}>
    <Stack direction="row" spacing={1.5} alignItems="center">
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          bgcolor: `${color}.lighter`,
          color: `${color}.main`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {iconNode}
      </Box>
      <Stack>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {label}
        </Typography>
        <Typography variant="h6" sx={{ lineHeight: 1.1 }}>
          {value}
        </Typography>
      </Stack>
    </Stack>
  </Card>
);

export const UploadResultsSummary = ({ summary, labels }: Readonly<UploadResultsSummaryProps>) => (
  <Stack
    direction={{ xs: 'column', sm: 'row' }}
    spacing={2}
    sx={{ flexWrap: { sm: 'wrap' }, gap: 2 }}
  >
    <Stat
      iconNode={<Iconify icon="solar:file-text-bold" width={22} />}
      label={labels.total}
      value={summary.total_rows}
      color="primary"
    />
    <Stat
      iconNode={<Iconify icon="solar:chart-square-outline" width={22} />}
      label={labels.processed}
      value={summary.processed_rows}
      color="info"
    />
    <Stat
      iconNode={<Iconify icon="solar:check-circle-bold" width={22} />}
      label={labels.success}
      value={summary.success_rows}
      color="success"
    />
    <Stat
      iconNode={<Iconify icon="solar:close-circle-bold" width={22} />}
      label={labels.failed}
      value={summary.failed_rows}
      color="error"
    />
  </Stack>
);
