export interface IUserProfile {
  id: string;
  displayName?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  photoURL?: string;
  phoneNumber?: string;
  country?: string;
  address?: string;
  state?: string;
  city?: string;
  zipCode?: string;
  about?: string;
  isPublic?: boolean;
}
