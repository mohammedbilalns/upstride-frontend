export type UserRole = "user" | "mentor" | "admin" | "superadmin";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  isBlocked?: boolean;
  isActive: boolean;
  createdAt: string;
}
