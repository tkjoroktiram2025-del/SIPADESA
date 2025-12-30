export enum UserRole {
  ADMIN = 'ADMIN',
  RT_RW = 'RT_RW',
  KADUS = 'KADUS',
  KASI = 'KASI',
}

export interface User {
  id: string;
  username: string;
  password?: string; // In a real app, never store plain text. Using for mock simplicity.
  fullName: string;
  role: UserRole;
  area?: string; // e.g., "RT 01" or "Dusun A"
}

export interface Resident {
  id: string;
  nik: string;
  fullName: string;
  gender: 'Laki-laki' | 'Perempuan';
  birthDate: string;
  address: string;
  rt: string;
  rw: string;
  dusun: string;
  job: string;
  status: 'Tetap' | 'Kontrak' | 'Pindah';
}

export interface AuthState {
  isAuthenticated: boolean;
  currentUser: User | null;
}
