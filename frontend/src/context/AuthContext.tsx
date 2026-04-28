import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
  useState,
} from 'react';
import { AxiosError } from 'axios';
import {
  loginRequest,
  meRequest,
  signupRequest,
  type LoginPayload,
  type SignupPayload,
} from '../api/auth.api';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  signup: (payload: SignupPayload) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getApiErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    return (error.response?.data as { message?: string } | undefined)?.message ??
      'Request failed';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Something went wrong';
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = useCallback(async (payload: LoginPayload): Promise<void> => {
    const data = await loginRequest(payload);
    localStorage.setItem('token', data.token);
    setUser(data.user);
  }, []);

  const signup = useCallback(async (payload: SignupPayload): Promise<void> => {
    const data = await signupRequest(payload);
    localStorage.setItem('token', data.token);
    setUser(data.user);
  }, []);

  const logout = useCallback((): void => {
    localStorage.removeItem('token');
    setUser(null);
  }, []);

  useEffect(() => {
    const bootstrapAuth = async (): Promise<void> => {
      const token = localStorage.getItem('token');

      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const data = await meRequest();
        setUser(data.user);
      } catch {
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    void bootstrapAuth();
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      isLoading,
      login: async (payload) => {
        try {
          await login(payload);
        } catch (error) {
          throw new Error(getApiErrorMessage(error));
        }
      },
      signup: async (payload) => {
        try {
          await signup(payload);
        } catch (error) {
          throw new Error(getApiErrorMessage(error));
        }
      },
      logout,
    }),
    [isLoading, login, logout, signup, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
};
