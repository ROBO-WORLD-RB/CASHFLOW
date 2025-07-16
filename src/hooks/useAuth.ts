import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFinancialStore } from '@/store/useFinancialStore';

interface AuthUser {
  id: string;
  email: string;
  name: string;
}

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<AuthUser | null>(null);
  const router = useRouter();
  const { setUser: setStoreUser, clearUser } = useFinancialStore();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    try {
      const authStatus = localStorage.getItem('isAuthenticated');
      const userEmail = localStorage.getItem('userEmail');
      const userName = localStorage.getItem('userName');

      if (authStatus === 'true' && userEmail) {
        const authUser: AuthUser = {
          id: `user_${userEmail}`, // Generate consistent ID from email
          email: userEmail,
          name: userName || userEmail.split('@')[0]
        };
        
        setUser(authUser);
        setStoreUser(authUser);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string, name?: string) => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would validate credentials with a backend
      if (email && password.length >= 6) {
        const authUser: AuthUser = {
          id: `user_${email}`,
          email,
          name: name || email.split('@')[0]
        };

        // Store in localStorage
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userName', authUser.name);

        // Update state
        setUser(authUser);
        setStoreUser(authUser);
        setIsAuthenticated(true);

        return { success: true };
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Login failed' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would create a new user account
      if (email && password.length >= 6 && name.length >= 2) {
        const authUser: AuthUser = {
          id: `user_${email}`,
          email,
          name
        };

        // Store in localStorage
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userName', name);

        // Update state
        setUser(authUser);
        setStoreUser(authUser);
        setIsAuthenticated(true);

        return { success: true };
      } else {
        throw new Error('Invalid user data');
      }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Signup failed' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Clear localStorage
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');

    // Clear state
    setUser(null);
    clearUser();
    setIsAuthenticated(false);

    // Redirect to auth page
    router.push('/auth');
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