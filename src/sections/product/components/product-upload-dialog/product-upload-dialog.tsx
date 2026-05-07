'use client';

import Box from '@mui/material/Box';
import Step from '@mui/material/Step';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Stepper from '@mui/material/Stepper';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CircularProgress from '@mui/material/CircularProgress';

import { useProductUploadDialog } from 'src/hooks/product/use-product-upload-dialog';

import { useTranslate } from 'src/locales/langs/i18n';

import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';

import { CsvErrorsAlert } from './csv-errors-alert';
import { CsvPreviewTable } from './csv-preview-table';
import { ImportModeSelector, type ImportModeOption } from './import-mode-selector';

const CSV_ACCEPT_ATTR = '.csv';
const IMAGES_ACCEPT_ATTR = '.zip,.jpg,.jpeg,.png';

// ----------------------------------------------------------------------

export const ProductUploadDialog = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const { translate } = useTranslate();
  const {
    step,
    csvInputRef,
    imgInputRef,
    csvFile,
    imagesZip,
    importMode,
    setImportMode,
    parsedCsv,
    rowErrorMap,
    hasLocalRowErrors,
    uploading,
    queueResult,
    result,
    showCancelDialog,
    csvInvalid,
    zipInvalid,
    csvErrors,
    onPickCsv,
    onPickImages,
    handleCsvFiles,
    handleImageFiles,
    onDropCsv,
    onDropImages,
    setCsvFile,
    setImagesZip,
    disabledUpload,
    goToPreview,
    goBackToUpload,
    confirmAndImport,
    clearAll,
    handleCancelUpload,
    handleCancelBulkUpload,
    setShowCancelDialog,
  } = useProductUploadDialog({ onClose });

  const stepLabels = [
    translate('productLoad.steps.upload'),
    translate('productLoad.steps.preview'),
    translate('productLoad.steps.processing'),
    translate('productLoad.steps.results'),
  ];

  const modeOptions: ImportModeOption[] = [
    {
      value: 'CREATE',
      title: translate('productLoad.modes.create.title'),
      description: translate('productLoad.modes.create.description'),
    },
    {
      value: 'UPDATE',
      title: translate('productLoad.modes.update.title'),
      description: translate('productLoad.modes.update.description'),
    },
    {
      value: 'REPLACE',
      title: translate('productLoad.modes.replace.title'),
      description: translate('productLoad.modes.replace.description'),
    },
  ];

  const dropZoneSx = (theme: any) => ({
    p: 3,
    borderRadius: 2,
    border: `1px dashed ${theme.vars?.palette?.divider || theme.palette.divider}`,
    bgcolor: 'background.paper',
    textAlign: 'center',
    cursor: 'pointer',
    minHeight: 220,
    '&:hover': {
      bgcolor: theme.vars
        ? `rgba(${theme.vars.palette.primary.mainChannel} / 0.04)`
        : 'action.hover',
    },
  });

  return (
    <Dialog fullWidth maxWidth="lg" onClose={onClose} open={open}>
      <DialogTitle sx={{ pb: 1 }}>{translate('productLoad.dialog.title')}</DialogTitle>

      <Box sx={{ px: 3, pb: 1 }}>
        <Stepper activeStep={step} alternativeLabel>
          {stepLabels.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      <DialogContent dividers sx={{ pt: 1.5 }}>
        {/* ---------------------------- STEP 0: Upload --------------------------- */}
        {step === 0 && (
          <Stack spacing={3}>
            <Stack spacing={1}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {translate('productLoad.dialog.intro1')}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {translate('productLoad.dialog.intro2')}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {translate('productLoad.dialog.intro3')}
              </Typography>
            </Stack>

            <Box
              sx={{
                display: 'grid',
                gap: 2,
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                alignItems: 'start',
              }}
            >
              {/* CSV picker */}
              <Stack spacing={1}>
                <Typography variant="subtitle2">{translate('productLoad.fileLabel')}</Typography>
                <Box
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onDrop={onDropCsv}
                  onClick={onPickCsv}
                  sx={dropZoneSx}
                >
                  <Stack spacing={1.5} alignItems="center">
                    <Iconify icon="solar:file-text-bold" color="primary.main" width={35} />
                    <Typography variant="subtitle2">
                      {translate('productLoad.dropZone.csvTitle')}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {CSV_ACCEPT_ATTR.toUpperCase()} — {translate('productLoad.dropZone.maxSize')}
                    </Typography>
                    <input
                      ref={csvInputRef}
                      type="file"
                      accept={CSV_ACCEPT_ATTR}
                      onChange={(e: any | null) => {
                        handleCsvFiles(e.target.files);
                        e.target.value = null;
                      }}
                      style={{ display: 'none' }}
                    />
                  </Stack>
                </Box>

                {!!csvFile && (
                  <Chip
                    sx={{ alignSelf: 'flex-start' }}
                    label={`${
                      csvFile.name.length > 20 ? `${csvFile.name.slice(0, 17)}...` : csvFile.name
                    } (${Math.round(csvFile.size / 1024)} KB)`}
                    onDelete={() => setCsvFile(null)}
                    size="small"
                  />
                )}

                {csvFile && (csvInvalid?.badType || csvInvalid?.tooBig) && (
                  <Alert severity="warning" variant="outlined">
                    {csvInvalid.badType && <div>{translate('productLoad.errors.invalidType')}</div>}
                    {csvInvalid.tooBig && <div>{translate('productLoad.errors.tooBig')}</div>}
                  </Alert>
                )}
              </Stack>

              {/* Images / ZIP picker */}
              <Stack spacing={1}>
                <Typography variant="subtitle2">{translate('productLoad.imagesLabel')}</Typography>
                <Box
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onDrop={onDropImages}
                  onClick={onPickImages}
                  sx={dropZoneSx}
                >
                  <Stack spacing={1.5} alignItems="center">
                    <Iconify icon="solar:gallery-circle-outline" color="primary.main" width={35} />
                    <Typography variant="subtitle2">
                      {translate('productLoad.dropZone.imagesTitle')}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {IMAGES_ACCEPT_ATTR.toUpperCase()} — {translate('productLoad.dropZone.maxSizeImages')}
                    </Typography>
                    <input
                      ref={imgInputRef}
                      type="file"
                      accept={IMAGES_ACCEPT_ATTR}
                      multiple
                      onChange={(e: any | null) => {
                        handleImageFiles(e.target.files);
                        e.target.value = null;
                      }}
                      style={{ display: 'none' }}
                    />
                  </Stack>
                </Box>

                {!!imagesZip && (
                  <Chip
                    sx={{ alignSelf: 'flex-start' }}
                    label={`${
                      imagesZip.name.length > 20
                        ? `${imagesZip.name.slice(0, 17)}...`
                        : imagesZip.name
                    } (${Math.round(imagesZip.size / 1024)} KB)`}
                    onDelete={() => setImagesZip(null)}
                    size="small"
                  />
                )}

                {imagesZip && (zipInvalid?.badType || zipInvalid?.tooBig) && (
                  <Alert severity="warning" variant="outlined">
                    {zipInvalid.badType && (
                      <div>{translate('productLoad.errors.invalidZip')}</div>
                    )}
                    {zipInvalid.tooBig && (
                      <div>{translate('productLoad.errors.tooBigImages')}</div>
                    )}
                  </Alert>
                )}
              </Stack>
            </Box>

            {/* Mode picker */}
            <Stack spacing={1}>
              <Typography variant="subtitle2">{translate('productLoad.modeLabel')}</Typography>
              <ImportModeSelector
                value={importMode}
                onChange={setImportMode}
                options={modeOptions}
                disabled={uploading}
              />
            </Stack>

            <CsvErrorsAlert csvFile={csvFile} csvErrors={csvErrors} />

            {result && !result.ok && (
              <Alert severity="error" icon={<Iconify icon="solar:close-circle-bold" width={20} />}>
                {result.message}
              </Alert>
            )}
          </Stack>
        )}

        {/* ---------------------------- STEP 1: Preview -------------------------- */}
        {step === 1 && parsedCsv && (
          <Stack spacing={2}>
            <Alert severity={hasLocalRowErrors ? 'warning' : 'info'}>
              {hasLocalRowErrors
                ? translate('productLoad.preview.warningWithErrors')
                : translate('productLoad.preview.info')}
            </Alert>
            <CsvPreviewTable
              headers={parsedCsv.headers}
              rows={parsedCsv.rows}
              rowErrorMap={rowErrorMap}
              errorTooltipTitle={translate('productLoad.preview.errorTooltipTitle')}
              rowsLabel={translate('productLoad.preview.rows')}
              errorsLabel={translate('productLoad.preview.errors')}
              emptyCellLabel={translate('productLoad.preview.emptyCell')}
            />
          </Stack>
        )}

        {/* --------------------------- STEP 2: Processing ------------------------ */}
        {step === 2 && (
          <Stack spacing={2} alignItems="center" sx={{ py: 6 }}>
            <CircularProgress size={48} />
            <Typography variant="h6">{translate('productLoad.processing.title')}</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>
              {translate('productLoad.processing.description')}
            </Typography>
          </Stack>
        )}

        {/* --------------------------- STEP 3: Queued ---------------------------- */}
        {step === 3 && queueResult && (
          <Stack spacing={2.5} alignItems="center" sx={{ py: 4 }}>
            <Box
              sx={{
                width: 72,
                height: 72,
                borderRadius: '50%',
                bgcolor: queueResult.success ? 'success.lighter' : 'error.lighter',
                color: queueResult.success ? 'success.main' : 'error.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Iconify
                icon={queueResult.success ? 'solar:check-circle-bold' : 'solar:close-circle-bold'}
                width={40}
              />
            </Box>

            <Stack spacing={0.5} alignItems="center">
              <Typography variant="h6">
                {queueResult.success
                  ? translate('productLoad.queue.successTitle')
                  : translate('productLoad.queue.failedTitle')}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>
                {queueResult.message}
              </Typography>
            </Stack>

            {queueResult.success && (
              <Card sx={{ p: 2, width: '100%', maxWidth: 480 }}>
                <Stack spacing={1.5}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {translate('productLoad.queue.jobId')}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {queueResult.job_id}
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {translate('productLoad.queue.status')}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600, textTransform: 'capitalize' }}
                    >
                      {queueResult.status}
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {translate('productLoad.queue.profileId')}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {queueResult.profile_id}
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {translate('productLoad.queue.importMode')}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {queueResult.import_mode}
                    </Typography>
                  </Stack>
                </Stack>
              </Card>
            )}

            {queueResult.success && (
              <Typography
                variant="caption"
                sx={{ color: 'text.secondary', textAlign: 'center', maxWidth: 480 }}
              >
                {translate('productLoad.queue.notifyNote')}
              </Typography>
            )}
          </Stack>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        {step === 0 && (
          <>
            {!!csvFile && (
              <Button onClick={clearAll} disabled={uploading} variant="text">
                {translate('productLoad.actions.clear')}
              </Button>
            )}
            <Box sx={{ flexGrow: 1 }} />
            <Button onClick={handleCancelBulkUpload} disabled={uploading} variant="text">
              {translate('productLoad.actions.cancel')}
            </Button>
            <Button
              variant="contained"
              onClick={goToPreview}
              disabled={disabledUpload}
              startIcon={<Iconify icon="eva:arrow-forward-fill" />}
            >
              {translate('productLoad.actions.continue')}
            </Button>
          </>
        )}

        {step === 1 && (
          <>
            <Button
              onClick={goBackToUpload}
              disabled={uploading}
              variant="text"
              startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
            >
              {translate('productLoad.actions.back')}
            </Button>
            <Box sx={{ flexGrow: 1 }} />
            <Button onClick={handleCancelBulkUpload} disabled={uploading} variant="text">
              {translate('productLoad.actions.cancel')}
            </Button>
            <Button
              variant="contained"
              onClick={confirmAndImport}
              disabled={uploading || hasLocalRowErrors}
              startIcon={<Iconify icon="eva:cloud-upload-fill" />}
            >
              {translate('productLoad.actions.confirmAndSend')}
            </Button>
          </>
        )}

        {step === 2 && (
          <Button disabled variant="text">
            {translate('productLoad.actions.processing')}
          </Button>
        )}

        {step === 3 && queueResult && (
          <>
            <Box sx={{ flexGrow: 1 }} />
            <Button
              variant="contained"
              onClick={handleCancelUpload}
              startIcon={<Iconify icon="eva:checkmark-fill" />}
            >
              {translate('productLoad.actions.finish')}
            </Button>
          </>
        )}
      </DialogActions>

      {!!csvFile || !!imagesZip ? (
        <ConfirmDialog
          open={showCancelDialog}
          onClose={() => setShowCancelDialog(false)}
          title={translate('productLoad.cancelDialog.title')}
          content={translate('productLoad.cancelDialog.content')}
          action={
            <Button variant="contained" onClick={handleCancelUpload}>
              {translate('productLoad.cancelDialog.continue')}
            </Button>
          }
        />
      ) : null}
    </Dialog>
  );
};
