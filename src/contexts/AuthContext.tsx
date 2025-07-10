import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User } from "../types";
import { apiClient } from "../utils/api";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    name: string,
    email: string,
    password: string,
    phone: string
  ) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already logged in on app start
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("authToken");

      if (token) {
        try {
          apiClient.setToken(token);
          const response = await apiClient.getProfile();

          if (response.success && response.data) {
            const userData = response.data.user;
            setUser({
              ...userData,
              isAdmin: userData.role === "admin", // Set isAdmin based on role
            });
          }
        } catch (error) {
          console.error("Failed to restore user session:", error);
          // Clear invalid token
          localStorage.removeItem("authToken");
          localStorage.removeItem("refreshToken");
        }
      }

      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setError(null);
      setLoading(true);

      const response = await apiClient.login(email, password);

      if (response.success && response.data) {
        const { user: userData, token, refreshToken } = response.data;

        // Store tokens
        apiClient.setToken(token);
        localStorage.setItem("refreshToken", refreshToken);

        // Set user with isAdmin flag
        setUser({
          ...userData,
          isAdmin: userData.role === "admin", // Set isAdmin based on role
        });
        
        console.log("user:", userData);

        return true;
      }

      return false;
    } catch (error: any) {
      setError(error.message || "Login failed");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    phone: string
  ): Promise<boolean> => {
    try {
      setError(null);
      setLoading(true);

      // Format phone number to match backend validation (254XXXXXXXXX)
      const formattedPhone = phone.startsWith("254")
        ? phone
        : phone.startsWith("0")
        ? `254${phone.slice(1)}`
        : `254${phone}`;

      const response = await apiClient.register(
        name,
        email,
        password,
        formattedPhone
      );

      if (response.success && response.data) {
        const { user: userData, token, refreshToken } = response.data;

        // Store tokens
        apiClient.setToken(token);
        localStorage.setItem("refreshToken", refreshToken);

        // Set user with isAdmin flag
        setUser({
          ...userData,
          isAdmin: userData.role === "admin",
        });

        return true;
      }

      return false;
    } catch (error: any) {
      setError(error.message || "Registration failed");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiClient.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear local state regardless of API call success
      setUser(null);
      apiClient.removeToken();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        loading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
