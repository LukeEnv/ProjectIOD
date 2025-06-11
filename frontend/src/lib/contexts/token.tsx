"use client";

import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";

interface TokenContextType {
  isAuthenticated: boolean;
  accessToken: string | null;
  accessTokenExpiry: number | null;
  refreshAccessToken: () => Promise<void>;
  signout: () => Promise<void>;
  loading: boolean;
  initialized: boolean;
}

const TokenContext = createContext<TokenContextType | undefined>(undefined);

export const TokenProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [accessTokenExpiry, setAccessTokenExpiry] = useState<number | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [initialized, setInitialized] = useState(false);

  // Derive isAuthenticated from accessToken
  const isAuthenticated = !!accessToken;

  const refreshAccessToken = async () => {
    setLoading(true);
    try {
      const response = await axios.post("/api/auth/refresh-token");
      if (response.status !== 200) {
        setAccessToken(null);
        setAccessTokenExpiry(null);
        return;
      }
      const { accessToken, accessTokenExpiry } = response.data;
      setAccessToken(accessToken);
      setAccessTokenExpiry(accessTokenExpiry);
    } catch {
      setAccessToken(null);
      setAccessTokenExpiry(null);
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  };

  const signout = async () => {
    setLoading(true);
    try {
      await axios.post("/api/auth/refresh-token/logout");
      setAccessToken(null);
      setAccessTokenExpiry(null);
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setLoading(false);
      toast.success("Successfully signed out");
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (accessTokenExpiry && Date.now() >= accessTokenExpiry) {
        refreshAccessToken();
      }
    }, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [accessTokenExpiry]);

  useEffect(() => {
    // Initial token refresh with a brief delay to allow cookie initialization in the browser
    const timer = setTimeout(() => {
      refreshAccessToken();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <TokenContext.Provider
      value={{
        isAuthenticated,
        accessToken,
        accessTokenExpiry,
        refreshAccessToken,
        signout,
        loading,
        initialized,
      }}
    >
      {children}
    </TokenContext.Provider>
  );
};

export const useTokenContext = (): TokenContextType => {
  const context = useContext(TokenContext);
  if (context === undefined) {
    throw new Error("useTokenContext must be used within a TokenProvider");
  }
  return context;
};
