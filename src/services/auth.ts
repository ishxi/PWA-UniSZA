import { User } from '../../types';
const LOGIN_KEY = 'ej_logged_in_user';
export const getCurrentUser = (): User | null => {
  try { return JSON.parse(localStorage.getItem(LOGIN_KEY) || 'null'); } catch { return null; }
};
export const loginUser = (u: User) => { try { localStorage.setItem(LOGIN_KEY, JSON.stringify(u)); } catch {} };
export const logoutUser = () => { try { localStorage.removeItem(LOGIN_KEY); } catch {} };
export const isAdminUser = (u: User|null) => { return u?.role === 'ADMIN' || u?.role === 'OWNER'; };
