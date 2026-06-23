import { UserAccount, UserRole } from '../../types';

export interface AuthState {
  user: UserAccount | null;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  role: UserRole;
  password?: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  password?: string;
}
