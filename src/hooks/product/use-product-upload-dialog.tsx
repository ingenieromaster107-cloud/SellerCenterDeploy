import type {
  ImportMode,
  MassUploadResultRowInterface,
  StartMassUploadImportResponseInterface,
} from 'src/interfaces/load/bulk-loading.interface';

import { useRef, useMemo, useState, useCallback } from 'react';

import { fileToBase64 } from 'src/utils/codificateFile';
import { parseCsv, type ParsedCsv } from 'src/utils/parse-csv';
import { downloadErrorsCsv } from 'src/utils/download-errors-csv';
import { CSV_MAX_BYTES, validateCsvFile, validateCsvContent } from 'src/utils/validate-csv';

import { useValidateMassUpload } from 'src/actions/product/useValidateMassUpload';
import { useStartMassUploadImport } from 'src/actions/product/useStartMassUploadImport';

import { toast } from 'src/components/snackbar';

// ----------------------------------------------------------------------

const CSV_ACCEPTED = [
  'text/csv',
  'application/vnd.ms-excel',
  'text/xml',
  'application/csv',
  'text/plain',
];
const IMG_ACCEPTED = ['image/jpeg', 'image/png'];
const ZIP_ACCEPTED = ['application/zip', 'application/x-zip-compressed', 'multipart/x-zip'];
const MAX_IMG_BYTES = 5 * 1024 * 1024;

interface ResultBanner {
  ok: boolean;
  message: string;
}

/**
 * Wizard de carga masiva (4 pasos):
 *  0 - Upload + selección de modo (CREATE/UPDATE/REPLACE) + validación local
 *  1 - Preview tabulado con marcado de filas con error local
 *  2 - Procesando (validateMassUpload → startMassUploadImport)
 *  3 - Resultados (resumen + detalle + descarga de errores)
 */
export type UploadStep = 0 | 1 | 2 | 3;

const isCsvByName = (name: string) => /\.csv$/i.test(name);

export const useProductUploadDialog = ({ onClose }: { onClose: () => void }) => {
  const csvInputRef = useRef<HTMLInputElement>(null);
  const imgInputRef = useRef<HTMLInputElement>(null);

  // Step
  const [step, setStep] = useState<UploadStep>(0);

  // Files
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [imagesZip, setImagesZip] = useState<File | null>(null);

  // Mode
  const [importMode, setImportMode] = useState<ImportMode>('CREATE');

  // CSV parse + validation
  const [parsedCsv, setParsedCsv] = useState<ParsedCsv | null>(null);
  const [csvErrors, setCsvErrors] = useState<string[]>([]);
  const [rowErrorMap, setRowErrorMap] = useState<Map<number, string[]>>(new Map());

  // Backend state
  const [uploading, setUploading] = useState(false);
  const [importResult, setImportResult] =
    useState<StartMassUploadImportResponseInterface['startMassUploadImport'] | null>(null);

  // UX
  const [result, setResult] = useState<ResultBanner | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const { mutateAsync: validateMassUpload } = useValidateMassUpload();
  const { mutateAsync: startMassUploadImport } = useStartMassUploadImport();

  // -------------------- Validity flags --------------------

  const csvInvalid = useMemo(() => {
    if (!csvFile) return null;
    const badType = !CSV_ACCEPTED.includes(csvFile.type) && !isCsvByName(csvFile.name);
    const tooBig = csvFile.size > CSV_MAX_BYTES;
    return { badType, tooBig };
  }, [csvFile]);

  const imgsInvalid = useMemo(() => {
    const badType: string[] = [];
    const tooBig: string[] = [];
    images.forEach((f) => {
      if (!IMG_ACCEPTED.includes(f.type)) badType.push(f.name);
      if (f.size > MAX_IMG_BYTES) tooBig.push(f.name);
    });
    return { badType, tooBig };
  }, [images]);

  const zipInvalid = useMemo(() => {
    if (!imagesZip) return null;
    const badType =
      !ZIP_ACCEPTED.includes(imagesZip.type) && !imagesZip.name?.toLowerCase()?.endsWith('.zip');
    const tooBig = imagesZip.size > MAX_IMG_BYTES;
    return { badType, tooBig };
  }, [imagesZip]);

  // -------------------- File pickers --------------------

  const onPickCsv = () => csvInputRef.current?.click();
  const onPickImages = () => imgInputRef.current?.click();

  const handleCsvFiles = useCallback(
    async (fileList: FileList | null) => {
      const f = (fileList && fileList[0]) || null;
      if (!f) return;
      setCsvFile(f);
      setResult(null);
      setParsedCsv(null);
      setRowErrorMap(new Map());
      setImportResult(null);

      const errors = await validateCsvFile(f);
      setCsvErrors(errors);
    },
    []
  );

  const isZipFile = (f: File) =>
    ZIP_ACCEPTED.includes(f.type) ||
    (typeof f.name === 'string' && f.name.toLowerCase().endsWith('.zip'));

  const handleImageFiles = useCallback(
    (fileList: FileList | null) => {
      const arr = Array.from(fileList || []);
      if (!arr.length) return;

      const zip = arr.find((f) => isZipFile(f));
      if (zip) {
        setImagesZip(zip);
        setImages([]);
        setResult(null);
        return;
      }

      const onlyImgs = arr.filter((f) => IMG_ACCEPTED.includes(f.type));
      if (!onlyImgs.length) return;

      const map = new Map(images.map((x) => [x.name + x.size, x]));
      onlyImgs.forEach((f) => map.set(f.name + f.size, f));
      setImages(Array.from(map.values()));
      setImagesZip(null);
      setResult(null);
    },
    [images]
  );

  const onDropCsv = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.dataTransfer?.files?.length) handleCsvFiles(e.dataTransfer.files);
    },
    [handleCsvFiles]
  );

  const onDropImages = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.dataTransfer?.files?.length) handleImageFiles(e.dataTransfer.files);
    },
    [handleImageFiles]
  );

  // -------------------- Wizard transitions --------------------

  /**
   * Step 0 → 1: parsea el CSV en cliente, valida headers + filas según `mode`.
   * Si hay errores de archivo no avanza.
   */
  const goToPreview = useCallback(async () => {
    if (!csvFile) return;
    setResult(null);

    const text = await csvFile.text();
    const parsed = parseCsv(text);

    const fileErrors = await validateCsvFile(csvFile, { mode: importMode, parsed });
    setCsvErrors(fileErrors);

    if (fileErrors.length > 0) {
      setParsedCsv(parsed);
      setRowErrorMap(new Map());
      return;
    }

    const validation = validateCsvContent(parsed, importMode);
    setParsedCsv(parsed);
    setRowErrorMap(validation.rowErrorMap);
    setStep(1);
  }, [csvFile, importMode]);

  const goBackToUpload = useCallback(() => setStep(0), []);

  /**
   * Step 1 → 2 → 3: encadena las dos mutations del backend.
   * - Step 2: spinner durante el procesamiento.
   * - Step 3: resultados consolidados.
   */
  const confirmAndImport = useCallback(async () => {
    if (!csvFile) return;
    setStep(2);
    setUploading(true);
    setResult(null);
    setImportResult(null);

    try {
      const base64 = await fileToBase64(csvFile);
      const validation = await validateMassUpload({
        attributeSetId: 10,
        fileContentBase64: base64,
        fileName: csvFile.name.replace(/\.[^.]+$/, ''),
        fileType: csvFile.type.includes('xml')
          ? 'xml'
          : csvFile.type.includes('excel')
            ? 'xls'
            : 'csv',
      });

      if (!validation.validateMassUpload.success || !validation.validateMassUpload.profile_id) {
        const message =
          validation.validateMassUpload.message || 'No se pudo validar el archivo.';
        toast.error(message);
        setResult({ ok: false, message });
        setStep(0);
        return;
      }

      const importResp = await startMassUploadImport({
        profileId: validation.validateMassUpload.profile_id,
        importMode,
      });

      setImportResult(importResp.startMassUploadImport);
      setStep(3);
    } catch (err: any) {
      const message = err?.message || 'Error en la carga.';
      toast.error(message);
      setResult({ ok: false, message });
      setStep(0);
    } finally {
      setUploading(false);
    }
  }, [csvFile, importMode, validateMassUpload, startMassUploadImport]);

  // -------------------- Errors download / retry --------------------

  const handleDownloadErrors = useCallback(() => {
    if (!parsedCsv || !importResult) return;
    downloadErrorsCsv({
      originalHeaders: parsedCsv.headers,
      originalRows: parsedCsv.rows,
      results: importResult.results,
    });
  }, [parsedCsv, importResult]);

  const failedResults: MassUploadResultRowInterface[] = useMemo(
    () => importResult?.results.filter((r) => r.status !== 'success') ?? [],
    [importResult]
  );

  /**
   * Genera un nuevo File con SOLO las filas fallidas para que el usuario
   * pueda reintentar el lote acotado. El usuario aún tiene que abrir el
   * archivo y corregir, pero arranca con un CSV pre-filtrado.
   */
  const retryFailed = useCallback(() => {
    handleDownloadErrors();
    toast.success('Descarga del CSV de errores iniciada. Corrígelo y vuelve a subirlo.');
  }, [handleDownloadErrors]);

  // -------------------- Reset / cancel --------------------

  const clearAll = useCallback(() => {
    setCsvFile(null);
    setImages([]);
    setImagesZip(null);
    setResult(null);
    setParsedCsv(null);
    setRowErrorMap(new Map());
    setCsvErrors([]);
    setImportResult(null);
    setStep(0);
  }, []);

  const handleCancelUpload = useCallback(() => {
    clearAll();
    setShowCancelDialog(false);
    onClose();
  }, [clearAll, onClose]);

  const handleCancelBulkUpload = useCallback(() => {
    if (!!csvFile || images.length > 0 || !!imagesZip) {
      setShowCancelDialog(true);
    } else {
      handleCancelUpload();
    }
  }, [csvFile, images, imagesZip, handleCancelUpload]);

  const hasValidImagesChoice = useMemo(() => {
    if (imagesZip) return !(zipInvalid?.badType || zipInvalid?.tooBig);
    if (images.length > 0) return imgsInvalid.badType.length === 0 && imgsInvalid.tooBig.length === 0;
    return false;
  }, [imagesZip, zipInvalid, images, imgsInvalid]);

  // Botón principal del Step 0
  const disabledNext =
    uploading ||
    !csvFile ||
    !!(csvInvalid && (csvInvalid.badType || csvInvalid.tooBig)) ||
    csvErrors.length > 0;

  // Hay errores locales por fila → si TRUE, deshabilitamos confirmar
  const hasLocalRowErrors = rowErrorMap.size > 0;

  // Back-compat para el dialog antiguo: handleUpload tiene el nuevo flujo
  // dependiendo del paso actual.
  const handleUpload = useCallback(async () => {
    if (step === 0) await goToPreview();
    else if (step === 1) await confirmAndImport();
  }, [step, goToPreview, confirmAndImport]);

  return {
    // refs + files
    csvInputRef,
    imgInputRef,
    csvFile,
    images,
    imagesZip,
    setCsvFile,
    setImages,
    setImagesZip,

    // wizard
    step,
    setStep,
    importMode,
    setImportMode,
    parsedCsv,
    rowErrorMap,
    hasLocalRowErrors,
    importResult,
    failedResults,

    // backend status
    uploading,
    result,

    // validity
    csvInvalid,
    imgsInvalid,
    zipInvalid,
    csvErrors,
    hasValidImagesChoice,
    disabledUpload: disabledNext,

    // pickers
    onPickCsv,
    onPickImages,
    handleCsvFiles,
    handleImageFiles,
    onDropCsv,
    onDropImages,

    // wizard actions
    goToPreview,
    goBackToUpload,
    confirmAndImport,
    handleDownloadErrors,
    retryFailed,
    clearAll,

    // back-compat (dialog antiguo)
    handleUpload,
    handleCancelUpload,
    handleCancelBulkUpload,
    showCancelDialog,
    setShowCancelDialog,
  };
};
