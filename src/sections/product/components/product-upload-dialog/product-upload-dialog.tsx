'use client';

import Box from '@mui/material/Box';
import Step from '@mui/material/Step';
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
import { UploadResultsSummary } from './upload-results-summary';
import { UploadResultsDetailTable } from './upload-results-detail-table';
import { ImportModeSelector, type ImportModeOption } from './import-mode-selector';

const CSV_ACCEPT_ATTR = '.csv,.xml,.xls';

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
    csvFile,
    importMode,
    setImportMode,
    parsedCsv,
    rowErrorMap,
    hasLocalRowErrors,
    uploading,
    importResult,
    failedResults,
    result,
    showCancelDialog,
    csvInvalid,
    csvErrors,
    onPickCsv,
    handleCsvFiles,
    onDropCsv,
    setCsvFile,
    disabledUpload,
    goToPreview,
    goBackToUpload,
    confirmAndImport,
    retryFailed,
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
        {/* ------------------------------- STEP 0 ------------------------------ */}
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
              {/* File picker */}
              <Stack spacing={1}>
                <Typography variant="subtitle2">{translate('productLoad.fileLabel')}</Typography>
                <Box
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onDrop={onDropCsv}
                  onClick={onPickCsv}
                  sx={(theme) => ({ ...dropZoneSx(theme), minHeight: 220 })}
                >
                  <Stack spacing={1.5} alignItems="center">
                    <Iconify icon="solar:file-text-bold" color="primary.main" width={35} />
                    <Typography variant="subtitle2">
                      {translate('productLoad.dropZone.title')}
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
                    {csvInvalid.badType && (
                      <div>{translate('productLoad.errors.invalidType')}</div>
                    )}
                    {csvInvalid.tooBig && <div>{translate('productLoad.errors.tooBig')}</div>}
                  </Alert>
                )}
              </Stack>

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
            </Box>

            <CsvErrorsAlert csvFile={csvFile} csvErrors={csvErrors} />

            {result && !result.ok && (
              <Alert severity="error" icon={<Iconify icon="solar:close-circle-bold" width={20} />}>
                {result.message}
              </Alert>
            )}
          </Stack>
        )}

        {/* ------------------------------- STEP 1 ------------------------------ */}
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

        {/* ------------------------------- STEP 2 ------------------------------ */}
        {step === 2 && (
          <Stack spacing={2} alignItems="center" sx={{ py: 6 }}>
            <CircularProgress size={48} />
            <Typography variant="h6">{translate('productLoad.processing.title')}</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>
              {translate('productLoad.processing.description')}
            </Typography>
          </Stack>
        )}

        {/* ------------------------------- STEP 3 ------------------------------ */}
        {step === 3 && importResult && (
          <Stack spacing={2.5}>
            <Alert
              severity={importResult.success ? 'success' : 'error'}
              icon={
                <Iconify
                  icon={importResult.success ? 'solar:check-circle-bold' : 'solar:close-circle-bold'}
                  width={20}
                />
              }
            >
              {importResult.message}
            </Alert>

            <UploadResultsSummary
              summary={importResult.summary}
              labels={{
                total: translate('productLoad.summary.total'),
                processed: translate('productLoad.summary.processed'),
                success: translate('productLoad.summary.success'),
                failed: translate('productLoad.summary.failed'),
              }}
            />

            <UploadResultsDetailTable
              results={importResult.results}
              labels={{
                rowColumn: translate('productLoad.results.rowColumn'),
                productColumn: translate('productLoad.results.productColumn'),
                statusColumn: translate('productLoad.results.statusColumn'),
                messageColumn: translate('productLoad.results.messageColumn'),
                fieldsColumn: translate('productLoad.results.fieldsColumn'),
                statusSuccess: translate('productLoad.results.statusSuccess'),
                statusFailed: translate('productLoad.results.statusFailed'),
                showOnlyFailed: translate('productLoad.results.showOnlyFailed'),
                showAll: translate('productLoad.results.showAll'),
              }}
            />
          </Stack>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        {/* Botones por paso */}
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

        {step === 3 && importResult && (
          <>
            {failedResults.length > 0 && (
              <Button
                onClick={retryFailed}
                variant="outlined"
                color="error"
                startIcon={<Iconify icon="solar:download-bold" width={18} />}
              >
                {translate('productLoad.actions.downloadErrors')}
              </Button>
            )}
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

      {csvFile ? (
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
