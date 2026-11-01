import api from "./api";

export const login = async (identity, password) => {
  const { data } = await api.post("/auth/login", { identity, password });
  localStorage.setItem("token", data.token);
  return data.user;
};

export const getCurrentUser = async () => (await api.get("/auth/me")).data.user;

export const restoreSession = async () => {
  if (!localStorage.getItem("token")) return null;
  try {
    return await getCurrentUser();
  } catch {
    localStorage.removeItem("token");
    return null;
  }
};

export const logout = () => localStorage.removeItem("token");
