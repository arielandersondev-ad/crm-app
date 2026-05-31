import { create } from "zustand";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface Tenant {
  id: string;
  name: string;
}

interface Branch {
  id: string;
  name: string;
}

interface AuthState {
  user: User | null;
  tenant: Tenant | null;
  branch: Branch | null;

  setUser: (user: User | null) => void;
  setTenant: (tenant: Tenant | null) => void;
  setBranch: (branch: Branch | null) => void;

  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  tenant: null,
  branch: null,

  setUser: (user) => set({ user }),

  setTenant: (tenant) => set({ tenant }),

  setBranch: (branch) => set({ branch }),


  logout: () => set({
    user: null,
    tenant: null,
    branch: null,
  }),
}));