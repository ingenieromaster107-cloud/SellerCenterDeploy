import type { ICustomer } from 'src/interfaces/customer/customer.interface';

import * as z from 'zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import { FieldsetLegend } from 'src/components';
import { useTranslate } from 'src/locales/langs/i18n';
import { EntityType } from 'src/shared/constants/graphql-entity-type';
import { useGetAttributes } from 'src/actions/attributes/use-attributes';
import { AttributeCode } from 'src/shared/constants/graphql-attribute-code';

import { toast } from 'src/components/snackbar';
import { ErrorContent } from 'src/components/error-content';
import { Form, Field, schemaUtils } from 'src/components/hook-form';
import { LoadingScreen } from 'src/components/loading-screen/loading-screen';

//---- Define the validation schema for user personal data using Zod
export type FormPersonalDataValues = z.infer<ReturnType<typeof UserPersonalDataSchema>>;

export const UserPersonalDataSchema = (t: (key: string) => string) =>
  z.object({
    firstName: z.string().min(1, { error: t('formErrorRequired.firstNameRequired') }),
    lastName: z.string().min(1, { error: t('formErrorRequired.lastNameRequired') }),
    email: schemaUtils.email(),
    identificationType: z.object({
      label: z.string().min(1, { error: t('formErrorRequired.identificationTypeRequired') }),
      value: z.string().min(1, { error: t('formErrorRequired.identificationTypeRequired') }),
    }),
    identificationNumber: z
      .string()
      .min(1, { error: t('formErrorRequired.identificationNumberRequired') }),
  });

export const updatePersonalDataSchema = UserPersonalDataSchema((key) => key);

const defaultPersonalDataValues: FormPersonalDataValues = {
  firstName: '',
  lastName: '',
  email: '',
  identificationType: {
    label: '',
    value: '',
  },
  identificationNumber: '',
};
//---- Define the validation schema for user personal data using Zod

//---- Define the validation schema for user address data using Zod
export type FormAddressDataValues = z.infer<ReturnType<typeof UserAddressDataSchema>>;

export const UserAddressDataSchema = (t: (key: string) => string) =>
  z.object({
    phoneNumber: z
      .string()
      .min(10, { error: t('formErrorRequired.phoneNumberRequired') }),
    country: schemaUtils.nullableInput(
      z.string().min(1, { error: t('formErrorRequired.countryRequired') }),
      {
        error: t('formErrorRequired.countryRequired'),
      }
    ),
    address: z.string().min(1, { error: t('formErrorRequired.addressRequired') }),
    state: z.string().min(1, { error: t('formErrorRequired.stateRequired') }),
    city: z.string().min(1, { error: t('formErrorRequired.cityRequired') }),
    zipCode: z.string().min(1, { error: t('formErrorRequired.zipCodeRequired') }),
  });

export const updateUserAddressSchema = UserAddressDataSchema((key) => key);

const defaultAddresslDataValues: FormAddressDataValues = {
  phoneNumber: '',
  country: null,
  address: '',
  state: '',
  city: '',
  zipCode: '',
};
//---- Define the validation schema for user address data using Zod

type ProfileConfigurationProps = {
  customer: ICustomer;
};

export function ProfileConfiguration({ customer }: ProfileConfigurationProps) {
  const { translate } = useTranslate();

  const {
    attributes,
    isLoading: isLoadingAttributes,
    isError: isErrorAttributes,
  } = useGetAttributes({
    attributeCode: AttributeCode.TipoIdentificacionUsuario,
    entityType: EntityType.Customer,
  });

  //---- Validation schema for user personal data and methods for handling the personal data form
  const schemaUserPersonalData = useMemo(() => UserPersonalDataSchema(translate), [translate]);
  const currentUserPersonalData: FormPersonalDataValues = useMemo(() => {
    const option = attributes?.items?.options.find(
      (attr) => attr.value === customer?.identificationType?.value
    );
    return {
      firstName: (customer?.firstname || '').trim(),
      lastName: (customer?.lastname || '').trim(),
      email: customer?.email || '',
      identificationType: option || { label: '', value: '' },
      identificationNumber: customer?.identificationNumber?.value || '',
    };
  }, [customer, attributes]);

  const methodPersonalData = useForm({
    mode: 'all',
    resolver: zodResolver(schemaUserPersonalData),
    defaultValues: defaultPersonalDataValues,
    values: currentUserPersonalData,
  });

  const {
    handleSubmit: handleSubmitPersonalData,
    formState: { isSubmitting: isSubmittingPersonalData },
  } = methodPersonalData;

  const onSubmitPersonalData = handleSubmitPersonalData(async (data) => {
    try {
      // TODO: Mutación para actualizar datos en backend
      await new Promise((r) => setTimeout(r, 500));
      toast.success('Update success!');
      // console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });
  //---- Validation schema for user personal data and methods for handling the personal data form

  //---- Validation schema for user address data and methods for handling the personal data form
  const schemaUserAddressData = useMemo(() => UserAddressDataSchema(translate), [translate]);
  const currentUserAddressData: FormAddressDataValues = useMemo(() => {
    const address = customer?.addresss || null;

    return {
      phoneNumber: address?.telephone || '',
      country: address?.country_code || '',
      address: address?.street?.join(' ') || '',
      state: address?.region?.region_id
        ? String(address?.region?.region_id)
        : address?.region?.region_code || '',
      city: address?.city || '',
      zipCode: address?.postcode || '',
    };
  }, [customer]);

  const methodAddressData = useForm({
    mode: 'all',
    resolver: zodResolver(schemaUserAddressData),
    defaultValues: defaultAddresslDataValues,
    values: currentUserAddressData,
  });

  const {
    handleSubmit: handleSubmitAddressData,
    formState: { isSubmitting: isSubmittingAddressData },
  } = methodAddressData;

  const onSubmitAddressData = handleSubmitAddressData(async (data) => {
    try {
      // TODO: Mutación para actualizar datos en backend
      await new Promise((r) => setTimeout(r, 500));
      toast.success('Update success!');
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });
  //---- Validation schema for user personal data and methods for handling the personal data form

  if (isLoadingAttributes) {
    return <LoadingScreen />;
  }

  if (isErrorAttributes) {
    return (
      <ErrorContent title={translate('noResultsFound')} description={translate('noDataFound')} />
    );
  }

  return (
    <>
      <Box sx={{ mt: 3 }}>
        <Form methods={methodPersonalData} onSubmit={onSubmitPersonalData}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <Card sx={{ p: 3, border: '1px solid', borderColor: 'divider' }} component="fieldset">
                <FieldsetLegend>informacion personal</FieldsetLegend>
                <Box
                  sx={{
                    rowGap: 3,
                    columnGap: 2,
                    display: 'grid',
                    gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
                  }}
                >
                  <Field.Text name="firstName" label={translate('formPlaceholder.firstName')} />
                  <Field.Text name="lastName" label={translate('formPlaceholder.lastName')} />
                  <Field.Text name="email" label={translate('formPlaceholder.email')} />
                  <Field.Autocomplete
                    name="identificationType"
                    label={translate('formPlaceholder.identificationType')}
                    options={
                      Array.isArray(attributes?.items?.options)
                        ? attributes.items?.options.map(
                            (attribute: { label: any; value: any }) => ({
                              label: attribute.label,
                              value: attribute.value,
                            })
                          )
                        : []
                    }
                    getOptionLabel={(option) => option.label ?? ''}
                    isOptionEqualToValue={(option, value) => option.value === value?.value}
                    loading={isLoadingAttributes}
                  />
                  <Field.Text
                    name="identificationNumber"
                    label={translate('formPlaceholder.identificationNumber')}
                  />
                </Box>

                <Stack spacing={3} sx={{ mt: 3, alignItems: 'flex-end' }}>
                  <Button type="submit" variant="contained" loading={isSubmittingPersonalData}>
                    {translate('formPlaceholder.btnSave')}
                  </Button>
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </Form>
      </Box>
      <Box sx={{ mt: 3 }}>
        <Form methods={methodAddressData} onSubmit={onSubmitAddressData}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <Card sx={{ p: 3, border: '1px solid', borderColor: 'divider' }} component="fieldset">
                <FieldsetLegend>Direccion</FieldsetLegend>
                <Box
                  sx={{
                    rowGap: 3,
                    columnGap: 2,
                    display: 'grid',
                    gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
                  }}
                >
                  <Field.Text name="phoneNumber"  label={translate('formPlaceholder.phoneNumber')} />
                  {/* <Field.Phone
                    name="phoneNumber"
                    label={translate('formPlaceholder.phoneNumber')}
                  /> */}
                  <Field.Text name="address" label={translate('formPlaceholder.address')} />
                  {/*<Field.CountrySelect
                    name="country"
                    label={translate('formPlaceholder.country')}
                    placeholder={translate('formPlaceholder.country')}
                    displayValue="code"
                  />*/}
                  <Field.Text name="state" label={translate('formPlaceholder.state')} />
                  <Field.Text name="city" label={translate('formPlaceholder.city')} />
                  <Field.Text name="zipCode" label={translate('formPlaceholder.zipCode')} />
                </Box>

                <Stack spacing={3} sx={{ mt: 3, alignItems: 'flex-end' }}>
                  <Button type="submit" variant="contained" loading={isSubmittingAddressData}>
                    {translate('formPlaceholder.btnSave')}
                  </Button>
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </Form>
      </Box>
    </>
  );
}
