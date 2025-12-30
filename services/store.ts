import { User, UserRole, Resident } from '../types';

const USERS_KEY = 'sipadesa_users';
const RESIDENTS_KEY = 'sipadesa_residents';

// Simulate Network Delay (0.5 - 1 second)
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Initial Seed Data
const DEFAULT_ADMIN: User = {
  id: 'admin-1',
  username: 'admin',
  password: 'admin123',
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

// --- USER SERVICES (MOCK API) ---

export const fetchUsers = async (): Promise<User[]> => {
  await delay(800); // Simulate network latency
  const stored = localStorage.getItem(USERS_KEY);
  if (!stored) {
    localStorage.setItem(USERS_KEY, JSON.stringify([DEFAULT_ADMIN]));
    return [DEFAULT_ADMIN];
  }
  return JSON.parse(stored);
};

export const saveUser = async (user: User): Promise<User> => {
  await delay(1000); // Simulate saving delay
  const users = await fetchUsers(); // Re-use fetch to get current state
  // We remove delay from fetchUsers inside here in a real app, but for mock:
  // let's just get direct from storage to avoid double delay in this mock logic, 
  // but logically we treat 'users' as what we got.
  
  // Actually, let's just read LS directly for the mutation to avoid double wait in mock
  const stored = localStorage.getItem(USERS_KEY);
  const currentUsers: User[] = stored ? JSON.parse(stored) : [DEFAULT_ADMIN];
  
  const existingIndex = currentUsers.findIndex((u) => u.id === user.id);
  
  if (existingIndex >= 0) {
    currentUsers[existingIndex] = user;
  } else {
    currentUsers.push(user);
  }
  
  localStorage.setItem(USERS_KEY, JSON.stringify(currentUsers));
  return user;
};

export const deleteUser = async (userId: string): Promise<void> => {
  await delay(800);
  const stored = localStorage.getItem(USERS_KEY);
  let users: User[] = stored ? JSON.parse(stored) : [];
  users = users.filter((u) => u.id !== userId);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

// --- RESIDENT SERVICES (MOCK API) ---

export const fetchResidents = async (): Promise<Resident[]> => {
  await delay(800);
  const stored = localStorage.getItem(RESIDENTS_KEY);
  if (!stored) {
    localStorage.setItem(RESIDENTS_KEY, JSON.stringify(INITIAL_RESIDENTS));
    return INITIAL_RESIDENTS;
  }
  return JSON.parse(stored);
};

export const saveResident = async (resident: Resident): Promise<Resident> => {
  await delay(1000);
  const stored = localStorage.getItem(RESIDENTS_KEY);
  const residents: Resident[] = stored ? JSON.parse(stored) : INITIAL_RESIDENTS;
  
  const existingIndex = residents.findIndex((r) => r.id === resident.id);

  if (existingIndex >= 0) {
    residents[existingIndex] = resident;
  } else {
    residents.push(resident);
  }

  localStorage.setItem(RESIDENTS_KEY, JSON.stringify(residents));
  return resident;
};

export const deleteResident = async (id: string): Promise<void> => {
  await delay(800);
  const stored = localStorage.getItem(RESIDENTS_KEY);
  let residents: Resident[] = stored ? JSON.parse(stored) : [];
  residents = residents.filter(r => r.id !== id);
  localStorage.setItem(RESIDENTS_KEY, JSON.stringify(residents));
}