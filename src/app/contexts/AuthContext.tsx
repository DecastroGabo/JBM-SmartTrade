import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  accountType: 'individual' | 'business';
  company?: string;
  isAdmin: boolean;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: any) => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start as true to handle initial check

  const mapUser = (apiUser: any): User => {
    return {
      id: apiUser.id.toString(),
      email: apiUser.email,
      name: apiUser.name,
      accountType: apiUser.role === 'business' ? 'business' : 'individual', 
      company: apiUser.company || '',
      isAdmin: apiUser.role === 'admin', 
      role: apiUser.role
    };
  };

  // --- NEW: SESSION HANDSHAKE ON REFRESH ---
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('http://localhost/JBMTRADING/api/check-auth.php', {
          credentials: 'include', // Tells the browser to send the session cookie
        });
        const data = await response.json();
        
        if (data.success) {
          setUser(mapUser(data.user));
        } else {
          setUser(null);
          localStorage.removeItem('jbm_user');
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost/JBMTRADING/api/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        const safeUser = mapUser(data.user);
        setUser(safeUser);
        localStorage.setItem('jbm_user', JSON.stringify(safeUser));
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (error: any) {
      console.error("Login Error:", error);
      throw new Error(error.message || 'Network error');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await fetch('http://localhost/JBMTRADING/api/logout.php', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error("Logout warning:", error);
    } finally {
      setUser(null);
      localStorage.removeItem('jbm_user');
      setIsLoading(false);
    }
  };

  const register = async (userData: any) => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost/JBMTRADING/api/register.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Registration failed');
      }
    } catch (error: any) {
      console.error("Register Error:", error);
      throw new Error(error.message || 'Network error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        login, 
        logout, 
        register, 
        isAuthenticated: !!user,
        isAdmin: user?.isAdmin || false,
        isLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}