
export const USERS_KEY = "ej_users";
export const LOGIN_KEY = "ej_logged_in_user";

export const getCurrentUser = () => {
  try {
    return JSON.parse(localStorage.getItem(LOGIN_KEY) || "null");
  } catch {
    return null;
  }
};

export const loginUser = (user: any) => {
  localStorage.setItem(LOGIN_KEY, JSON.stringify(user));
};

export const logoutUser = () => {
  localStorage.removeItem(LOGIN_KEY);
};

export const getAllUsers = () => {
  return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
};

export const saveAllUsers = (users: any[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const isAdminUser = (user: any) => {
  return user?.role === "ADMIN";
};
