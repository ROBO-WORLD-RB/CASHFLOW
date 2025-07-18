import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useFinancialStore } from '@/store/useFinancialStore';

interface AuthUser {
  id: string;
  email: string;
  name: string;
}

interface AuthSession {
  user: AuthUser;
  token: string;
  expiresAt: string;
  isActive: boolean;
}

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { setUser: setStoreUser, clearUser } = useFinancialStore();

  const checkAuthStatus = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Add timeout to prevent infinite loading
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Authentication check timeout')), 5000);
      });

      const authCheckPromise = new Promise<void>((resolve) => {
        try {
          const sessionData = localStorage.getItem('authSession');
          
          if (sessionData) {
            const session: AuthSession = JSON.parse(sessionData);
            
            // Check if session is expired
            if (new Date(session.expiresAt) > new Date() && session.isActive) {
              setUser(session.user);
              setStoreUser(session.user);
              setIsAuthenticated(true);
            } else {
              // Clear expired session
              localStorage.removeItem('authSession');
              setUser(null);
              setIsAuthenticated(false);
            }
          } else {
            setUser(null);
            setIsAuthenticated(false);
          }
          resolve();
        } catch (error) {
          console.error('Error parsing auth session:', error);
          localStorage.removeItem('authSession');
          setUser(null);
          setIsAuthenticated(false);
          resolve();
        }
      });

      await Promise.race([authCheckPromise, timeoutPromise]);
    } catch (error) {
      console.error('Error checking auth status:', error);
      setError('Authentication check failed');
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, [setStoreUser]);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const createSession = (user: AuthUser): AuthSession => {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry
    
    return {
      user,
      token: `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      expiresAt: expiresAt.toISOString(),
      isActive: true
    };
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Add timeout for login process
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Login timeout')), 10000);
      });

      const loginPromise = new Promise<{ success: boolean; error?: string }>((resolve) => {
        setTimeout(() => {
          // Basic validation
          if (!email || !password) {
            resolve({ success: false, error: 'Email and password are required' });
            return;
          }

          if (password.length < 6) {
            resolve({ success: false, error: 'Password must be at least 6 characters' });
            return;
          }

          // Check if user exists (for login)
          const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
          const existingUser = existingUsers.find((u: any) => u.email === email);

          if (!existingUser) {
            resolve({ success: false, error: 'User not found. Please sign up first.' });
            return;
          }

          // Create auth user
          const authUser: AuthUser = {
            id: existingUser.id,
            email: existingUser.email,
            name: existingUser.name
          };

          // Create and store session
          const session = createSession(authUser);
          localStorage.setItem('authSession', JSON.stringify(session));

          // Update state
          setUser(authUser);
          setStoreUser(authUser);
          setIsAuthenticated(true);

          resolve({ success: true });
        }, 1000); // Simulate API delay
      });

      const result = await Promise.race([loginPromise, timeoutPromise]) as { success: boolean; error?: string };
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Add timeout for signup process
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Signup timeout')), 10000);
      });

      const signupPromise = new Promise<{ success: boolean; error?: string }>((resolve) => {
        setTimeout(() => {
          // Basic validation
          if (!email || !password || !name) {
            resolve({ success: false, error: 'All fields are required' });
            return;
          }

          if (password.length < 6) {
            resolve({ success: false, error: 'Password must be at least 6 characters' });
            return;
          }

          if (name.length < 2) {
            resolve({ success: false, error: 'Name must be at least 2 characters' });
            return;
          }

          // Check if user already exists
          const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
          if (existingUsers.some((u: any) => u.email === email)) {
            resolve({ success: false, error: 'User already exists. Please login instead.' });
            return;
          }

          // Create new user
          const authUser: AuthUser = {
            id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            email,
            name
          };

          // Store user in registered users list
          existingUsers.push(authUser);
          localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));

          // Create and store session
          const session = createSession(authUser);
          localStorage.setItem('authSession', JSON.stringify(session));

          // Update state
          setUser(authUser);
          setStoreUser(authUser);
          setIsAuthenticated(true);

          resolve({ success: true });
        }, 1000); // Simulate API delay
      });

      const result = await Promise.race([signupPromise, timeoutPromise]) as { success: boolean; error?: string };
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Signup failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    try {
      // Clear session
      localStorage.removeItem('authSession');

      // Clear state
      setUser(null);
      clearUser();
      setIsAuthenticated(false);
      setError(null);

      // Redirect to auth page
      router.push('/auth');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const requireAuth = () => {
    if (!isAuthenticated && !isLoading) {
      router.push('/auth');
      return false;
    }
    return true;
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    signup,
    logout,
    requireAuth,
    checkAuthStatus
  };
}