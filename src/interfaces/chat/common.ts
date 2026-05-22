import type { Dayjs } from 'dayjs';

// ----------------------------------------------------------------------

export type PaymentCard = {
  id: string;
  cardType: string;
  primary?: boolean;
  cardNumber: string;
};

export type AddressItem = {
  id?: string;
  name: string;
  company?: string;
  primary?: boolean;
  fullAddress: string;
  phoneNumber?: string;
  addressType?: string;
};

export type DateValue = string | number | null;

export type DatePickerControl = Dayjs | null;

export type SocialLink = {
  twitter: string;
  facebook: string;
  linkedin: string;
  instagram: string;
};
