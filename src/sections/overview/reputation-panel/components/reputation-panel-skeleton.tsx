import type { CardProps } from '@mui/material/Card';

import { Box, Card, Grid, Skeleton, CardHeader } from '@mui/material';

export const ReputationPanelSkeleton = ({ sx, ...other }: CardProps) => (
  <Card sx={sx} {...other}>
    <CardHeader
      title={<Skeleton variant="text" width={160} height={28} />}
      subheader={<Skeleton variant="text" width={240} height={18} />}
    />

    <Box sx={{ p: 3, pt: 1 }}>
      <Box
        sx={(t) => ({
          p: { xs: 3, md: 4 },
          mb: 3,
          borderRadius: 2,
          border: `1px solid ${t.palette.divider}`,
        })}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
          <Skeleton variant="circular" width={32} height={32} sx={{ flexShrink: 0 }} />
          <Skeleton variant="text" width={180} height={14} />
        </Box>

        <Skeleton variant="text" width="55%" height={40} sx={{ mb: 1 }} />

        <Skeleton variant="text" width={180} height={20} sx={{ mb: 4 }} />

        <Box>
          <Skeleton variant="text" width={120} height={20} sx={{ mb: 1.5 }} />
          <Skeleton variant="rounded" width="100%" height={10} sx={{ borderRadius: 5, mb: 1 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Skeleton variant="text" width={36} height={14} />
            <Skeleton variant="text" width={48} height={14} />
            <Skeleton variant="text" width={36} height={14} />
          </Box>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }}>
            <Card
              sx={{
                p: 3,
                height: 1,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Skeleton variant="text" width="80%" height={20} />
                <Skeleton variant="text" width="60%" height={40} sx={{ mt: 1.5, mb: 1 }} />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <Skeleton variant="circular" width={16} height={16} sx={{ flexShrink: 0 }} />
                  <Skeleton variant="text" width="70%" height={14} />
                </Box>
              </Box>

              <Skeleton
                variant="rounded"
                width={64}
                height={48}
                sx={{ ml: 2, flexShrink: 0, borderRadius: 1 }}
              />
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  </Card>
);
