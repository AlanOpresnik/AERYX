export interface UserClerk {
  _id: string;

  clerkId: string;

  email: string;

  firstName: string;

  lastName: string;

  username: string | null;

  imageUrl: string | null;

  createdAt: string;

  updatedAt: string;
}

export interface UserAddress {
  street?: string;
  number?: string;
  city?: string;
  province?: string;
  postalCode?: string;
}

export interface UserDataInterface {
  _id: string;
  clerkId: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  address?: UserAddress;
  createdAt?: string;
  updatedAt?: string;
}

export type UpdateProfileState = {
  error: string | null;
  success: boolean;
};

export const initialUpdateProfileState: UpdateProfileState = {
  error: null,
  success: false,
};