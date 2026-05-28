export type UserRole =
  | "CUSTOMER"
  | "ORGANIZER";

export default interface User {
  id: number;

  fullName: string;

  email: string;

  role: UserRole;

  referralCode?: string;

  referredBy?: string;

  profilePicture?: string;

  createdAt?: string;
  updatedAt?: string;
}