'use client';

import type { CreateProductPayload } from 'src/interfaces';
import type { ImagePreview } from '../components/product-image-upload';

import * as z from 'zod';
import { useState, useCallback } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller, useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useTranslate } from 'src/locales';
import { HomeContent } from 'src/layouts/home';
import { useCategories } from 'src/actions/category/use-categories';
import { useCreateProduct } from 'src/actions/product/use-create-product';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { SectionLoadingOverlay } from 'src/components/loading-screen';

import { ProductImageUpload } from '../components/product-image-upload';
import { CategoryTreeSelect } from '../components/category-tree-select';

// ----------------------------------------------------------------------

/** Mensajes seguros que nuestras funciones de sanitización generan */
const SAFE_MESSAGES = [
  'el sku ingresado ya se encuentra registrado',
  'ocurrió un error al crear el producto',
];

/** Última capa: solo deja pasar mensajes conocidos como seguros. */
function sanitizeUserError(error: Error, fallback: string): string {
  const msg = error?.message;
  if (!msg) return fallback;
  const lower = msg.toLowerCase();
  if (SAFE_MESSAGES.some((safe) => lower.includes(safe))) return msg;
  return fallback;
}

const defaultValues = {
  name: '',
  sku: '',
  categoryId: '',
  price: 0,
  weight: 0,
  stock: 0,
  shortDescription: '',
  description: '',
};

// ----------------------------------------------------------------------

/** Agrega separadores de miles con punto (ej: "8800000" → "8.800.000") */
function formatThousands(digits: string): string {
  if (!digits) return '';
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/**
 * Campo de precio en pesos colombianos.
 * - Limpia el "0" al hacer foco.
 * - Solo acepta dígitos; aplica separador de miles con punto automáticamente.
 * - Restaura "0" si se deja vacío al perder foco.
 */
function PriceField({ label }: { label: string }) {
  const { control } = useFormContext();
  const [display, setDisplay] = useState('0');

  return (
    <Controller
      name="price"
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          fullWidth
          label={label}
          value={display}
          onFocus={() => {
            if (display === '0') setDisplay('');
          }}
          onChange={(e) => {
            const digits = e.target.value.replace(/\D/g, '');
            setDisplay(formatThousands(digits));
            field.onChange(digits === '' ? '' : digits);
          }}
          onBlur={() => {
            if (!display) {
              setDisplay('0');
              field.onChange(0);
            }
            field.onBlur();
          }}
          error={!!error}
          helperText={error?.message}
          slotProps={{
            inputLabel: { shrink: true },
            input: {
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            },
          }}
        />
      )}
    />
  );
}

/**
 * Campo de stock.
 * - Limpia el "0" al hacer foco.
 * - Solo acepta dígitos enteros.
 * - Restaura "0" si se deja vacío al perder foco.
 */
function StockField({ label }: { label: string }) {
  const { control } = useFormContext();
  const [display, setDisplay] = useState('0');

  return (
    <Controller
      name="stock"
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          fullWidth
          label={label}
          value={display}
          onFocus={() => {
            if (display === '0') setDisplay('');
          }}
          onChange={(e) => {
            const digits = e.target.value.replace(/\D/g, '');
            setDisplay(digits);
            field.onChange(digits === '' ? '' : Number(digits));
          }}
          onBlur={() => {
            if (!display) {
              setDisplay('0');
              field.onChange(0);
            }
            field.onBlur();
          }}
          error={!!error}
          helperText={error?.message}
          slotProps={{ inputLabel: { shrink: true } }}
        />
      )}
    />
  );
}

/**
 * Campo de peso en kilogramos.
 * - Limpia el "0" al hacer foco.
 * - Solo acepta enteros o decimales con UN solo punto (ej: 2.5, 7.236).
 * - Restaura "0" si se deja vacío al perder foco.
 */
function WeightField({ label }: { label: string }) {
  const { control } = useFormContext();
  const [display, setDisplay] = useState('0');

  return (
    <Controller
      name="weight"
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          fullWidth
          label={label}
          value={display}
          onFocus={() => {
            if (display === '0') setDisplay('');
          }}
          onChange={(e) => {
            let val = e.target.value.replace(/[^\d.]/g, '');
            // Solo un punto decimal permitido
            const dotIdx = val.indexOf('.');
            if (dotIdx !== -1) {
              val = val.slice(0, dotIdx + 1) + val.slice(dotIdx + 1).replace(/\./g, '');
            }
            // No permitir empezar con punto
            if (val === '.') val = '';
            setDisplay(val);
            field.onChange(val);
          }}
          onBlur={() => {
            let val = display;
            // Quitar punto final si quedó solo (ej: "2.")
            if (val.endsWith('.')) val = val.slice(0, -1);
            if (!val) {
              setDisplay('0');
              field.onChange(0);
            } else {
              setDisplay(val);
              field.onChange(val);
            }
            field.onBlur();
          }}
          error={!!error}
          helperText={error?.message}
          slotProps={{
            inputLabel: { shrink: true },
            input: {
              endAdornment: <InputAdornment position="end">kg</InputAdornment>,
            },
          }}
        />
      )}
    />
  );
}

// ----------------------------------------------------------------------

/**
 * Vista del formulario para crear un producto simple.
 *
 * Contiene:
 * - Campos del producto (nombre, SKU, categoría, precio, peso, descripciones)
 * - Upload de imágenes con preview
 * - Validación con Zod
 * - Envío al backend mediante useCreateProduct
 * - Redirección a la lista de productos tras éxito
 */
export function ProductCreateSimpleView() {
  const router = useRouter();
  const { translate } = useTranslate();
  const [images, setImages] = useState<ImagePreview[]>([]);

  const { categoryTree, categoriesLoading } = useCategories();

  /** Esquema de validación Zod para el formulario (usa traducciones) */
  const CreateProductSchema = z.object({
    name: z.string().min(1, translate('productCreate', 'validation.nameRequired')),
    sku: z.string().min(1, translate('productCreate', 'validation.skuRequired')),
    categoryId: z.string().min(1, translate('productCreate', 'validation.categoryRequired')),
    price: z.coerce.number().positive(translate('productCreate', 'validation.pricePositive')),
    weight: z.coerce.number().positive(translate('productCreate', 'validation.weightPositive')),
    stock: z.coerce.number().min(0, translate('productCreate', 'validation.stockMin')),
    shortDescription: z.string().min(1, translate('productCreate', 'validation.shortDescRequired')),
    description: z.string().min(1, translate('productCreate', 'validation.descRequired')),
  });

  const { mutateAsync: createProduct, isPending } = useCreateProduct({
    onSuccess: () => {
      toast.success(translate('productCreate', 'successMessage'));
      router.push(paths.product.root);
    },
    onError: (error) => {
      toast.error(sanitizeUserError(error, translate('productCreate', 'errorMessage')));
    },
  });

  const methods = useForm({
    resolver: zodResolver(CreateProductSchema),
    defaultValues,
  });

  const { handleSubmit } = methods;

  /**
   * Convierte archivos File a base64 para enviar al backend.
   */
  const fileToBase64 = useCallback((file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Elimina el prefijo "data:image/...;base64,"
        const base64 = result.split(',')[1] ?? '';
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    }), []);

  const onSubmit = handleSubmit(async (data) => {
    const base64Images = await Promise.all(images.map((img) => fileToBase64(img.file)));

    const payload: CreateProductPayload = {
      name: data.name,
      sku: data.sku,
      categoryId: data.categoryId,
      price: Number(data.price),
      weight: Number(data.weight),
      stock: Number(data.stock),
      shortDescription: data.shortDescription,
      description: data.description,
      images: base64Images,
      files: images.map((img) => img.file),
    };

    await createProduct(payload);
  });

  const handleAddImages = useCallback((newImages: ImagePreview[]) => {
    setImages((prev) => [...prev, ...newImages]);
  }, []);

  const handleRemoveImage = useCallback((index: number) => {
    setImages((prev) => {
      const updated = [...prev];
      // Revoca la URL del object para evitar memory leaks
      URL.revokeObjectURL(updated[index].preview);
      updated.splice(index, 1);
      return updated;
    });
  }, []);

  // ------------------------------------------------------------------

  return (
    <HomeContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <CustomBreadcrumbs
        heading={translate('productCreate', 'heading')}
        links={[
          { name: translate('productList', 'breadcrumbHome'), href: paths.home.root },
          { name: translate('productList', 'breadcrumbProduct'), href: paths.product.root },
          { name: translate('productCreate', 'breadcrumbCreate') },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Form methods={methods} onSubmit={onSubmit}>
        <Box sx={{ position: 'relative' }}>
          <SectionLoadingOverlay
            open={isPending}
            message={translate('productCreate', 'loadingMessage')}
          />
        <Stack spacing={3}>
          {/* ===== INFORMACIÓN DEL PRODUCTO ===== */}
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              {translate('productCreate', 'basicInfo')}
            </Typography>

            <Box
              sx={{
                gap: 3,
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
              }}
            >
              <Field.Text
                name="sku"
                label={translate('productCreate', 'sku')}
              />
              <Field.Text name="name" label={translate('productCreate', 'productName')} />
              <CategoryTreeSelect
                name="categoryId"
                label={translate('productCreate', 'category')}
                placeholder={translate('productCreate', 'selectCategory')}
                loadingText={translate('productCreate', 'loadingCategories')}
                categoryTree={categoryTree}
                loading={categoriesLoading}
                selectedLabel={translate('productCreate', 'selectedCategories')}
                sx={{ gridColumn: '1 / -1' }}
              />
              <PriceField label={translate('productCreate', 'price')} />
              <WeightField label={translate('productCreate', 'weight')} />
              <Field.Text
                name="shortDescription"
                label={translate('productCreate', 'shortDescription')}
                multiline
                rows={3}
                sx={{ gridColumn: '1 / -1' }}
              />
            </Box>
          </Card>

          {/* ===== DESCRIPCIÓN COMPLETA DEL PRODUCTO ===== */}
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              {translate('productCreate', 'descriptionSection')}
            </Typography>

            <Field.Editor
              name="description"
              placeholder={translate('productCreate', 'descriptionPlaceholder')}
            />
          </Card>

          {/* ===== IMÁGENES ===== */}
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              {translate('productCreate', 'imagesSection')}
            </Typography>

            <ProductImageUpload
              images={images}
              onAdd={handleAddImages}
              onRemove={handleRemoveImage}
              maxImages={5}
              maxSizeKB={100}
            />
          </Card>

          {/* ===== STOCK ===== */}
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              {translate('productCreate', 'stockSection')}
            </Typography>

            <StockField label={translate('productCreate', 'stock')} />
          </Card>

          <Divider />

          {/* ===== BOTÓN ENVIAR ===== */}
          <Stack direction="row" justifyContent="flex-end">
            <LoadingButton
              type="submit"
              variant="contained"
              size="large"
              loading={isPending}
            >
              {translate('productCreate', 'savePublish')}
            </LoadingButton>
          </Stack>
        </Stack>
        </Box>
      </Form>
    </HomeContent>
  );
}
