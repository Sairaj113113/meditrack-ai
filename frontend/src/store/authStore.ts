import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

interface User {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  emailVerified: boolean;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  setUser: (user: User) => void;

  login: (
    accessToken: string,
    refreshToken: string,
    user: User
  ) => Promise<void>;

  logout: () => Promise<void>;

  checkAuth: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user) =>
    set({
      user,
    }),

  login: async (accessToken, refreshToken, user) => {
    await SecureStore.setItemAsync(
      'accessToken',
      accessToken
    );

    await SecureStore.setItemAsync(
      'refreshToken',
      refreshToken
    );

    set({
      user,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  logout: async () => {
    await SecureStore.deleteItemAsync(
      'accessToken'
    );

    await SecureStore.deleteItemAsync(
      'refreshToken'
    );

    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  checkAuth: async () => {
    const token =
      await SecureStore.getItemAsync(
        'accessToken'
      );

    const authenticated = !!token;

    set({
      isAuthenticated: authenticated,
      isLoading: false,
    });

    return authenticated;
  },
}));