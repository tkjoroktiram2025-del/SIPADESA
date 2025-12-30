import { User, UserRole, Resident } from '../types';

const USERS_KEY = 'sipadesa_users';
const RESIDENTS_KEY = 'sipadesa_residents';

// Initial Seed Data
const DEFAULT_ADMIN: User = {
  id: 'admin-1',
  username: 'admin',
  password: 'admin123', // Default password
  fullName: 'Administrator Desa',
  role: UserRole.ADMIN,
};

const INITIAL_RESIDENTS: Resident[] = [
  {
    id: '1',
    nik: '3201010101010001',
    fullName: 'Budi Santoso',
    gender: 'Laki-laki',
    birthDate: '1980-05-12',
    address: 'Jl. Melati No. 5',
    rt: '01',
    rw: '02',
    dusun: 'Mawar',
    job: 'Petani',
    status: 'Tetap',
  },
  {
    id: '2',
    nik: '3201010101010002',
    fullName: 'Siti Aminah',
    gender: 'Perempuan',
    birthDate: '1985-08-20',
    address: 'Jl. Anggrek No. 2',
    rt: '02',
    rw: '02',
    dusun: 'Melati',
    job: 'Guru',
    status: 'Tetap',
  },
];

export const getStoredUsers = (): User[] => {
  const stored = localStorage.getItem(USERS_KEY);
  if (!stored) {
    localStorage.setItem(USERS_KEY, JSON.stringify([DEFAULT_ADMIN]));
    return [DEFAULT_ADMIN];
  }
  return JSON.parse(stored);
};

export const saveUser = (user: User) => {
  const users = getStoredUsers();
  const existingIndex = users.findIndex((u) => u.id === user.id);
  
  if (existingIndex >= 0) {
    users[existingIndex] = user;
  } else {
    users.push(user);
  }
  
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const deleteUser = (userId: string) => {
  let users = getStoredUsers();
  users = users.filter((u) => u.id !== userId);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const getStoredResidents = (): Resident[] => {
  const stored = localStorage.getItem(RESIDENTS_KEY);
  if (!stored) {
    localStorage.setItem(RESIDENTS_KEY, JSON.stringify(INITIAL_RESIDENTS));
    return INITIAL_RESIDENTS;
  }
  return JSON.parse(stored);
};

export const saveResident = (resident: Resident) => {
  const residents = getStoredResidents();
  const existingIndex = residents.findIndex((r) => r.id === resident.id);

  if (existingIndex >= 0) {
    residents[existingIndex] = resident;
  } else {
    residents.push(resident);
  }

  localStorage.setItem(RESIDENTS_KEY, JSON.stringify(residents));
};

export const deleteResident = (id: string) => {
  let residents = getStoredResidents();
  residents = residents.filter(r => r.id !== id);
  localStorage.setItem(RESIDENTS_KEY, JSON.stringify(residents));
}
