import { create } from 'zustand';
import { UserProfile } from '@/types/auth';

interface AppState {
  // UI state
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  
  // Theme state
  themeMode: 'auto' | 'light' | 'dark';
  setThemeMode: (mode: 'auto' | 'light' | 'dark') => void;
  // Legacy support
  darkMode: boolean;
  toggleDarkMode: () => void;
  
  // User management state (for admin)
  users: UserProfile[];
  setUsers: (users: UserProfile[]) => void;
  addUser: (user: UserProfile) => void;
  updateUser: (id: string, userData: Partial<UserProfile>) => void;
  deleteUser: (id: string) => void;
}

export const useStore = create<AppState>((set) => ({
  // UI state
  sidebarOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  
  // Theme state
  themeMode: 'auto',
  setThemeMode: (mode) => set({ themeMode: mode }),
  // Legacy support - computed based on themeMode
  darkMode: false,
  toggleDarkMode: () => set((state) => ({ 
    themeMode: state.themeMode === 'dark' ? 'light' : 'dark',
    darkMode: state.themeMode !== 'dark'
  })),
  
  // User management state
  users: [],
  setUsers: (users) => set({ users }),
  addUser: (user) => set((state) => ({ users: [...state.users, user] })),
  updateUser: (id, userData) => set((state) => ({
    users: state.users.map((user) => 
      user.id === id ? { ...user, ...userData } : user
    ),
  })),
  deleteUser: (id) => set((state) => ({
    users: state.users.filter((user) => user.id !== id),
  })),
}));