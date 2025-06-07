"use client";

import { createContext, useContext, useEffect } from "react";
import axios from "axios";
import { User } from "@/types/user";
import useSWR from "swr";
import { toast } from "sonner";
import { useTokenContext } from "./token";
interface UserContextType {
  refetchUser: () => Promise<void>;
  updateUser: (updatedUser: {
    name?: string;
    username?: string;
    password?: string;
  }) => Promise<void>;
  user: User | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { accessToken } = useTokenContext();

  const { data: user, mutate: refetchUser } = useSWR(
    `/api/me`,
    async (url: string) => {
      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return res.data;
    },
    {
      revalidateOnFocus: false,
      shouldRetryOnError: true,
      refreshInterval: 0, // Disable automatic revalidation
    }
  );

  const updateUser = async (updatedUser: {
    name?: string;
    username?: string;
    password?: string;
  }) => {
    try {
      const response = await axios.put(`/api/me`, updatedUser, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      refetchUser();
      toast.success("User updated successfully!");
      return response.data;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  };

  // Call refetchUser only when a valid token is present
  useEffect(() => {
    if (accessToken) {
      refetchUser();
    }
  }, [accessToken]);

  return (
    <UserContext.Provider
      value={{
        refetchUser,
        updateUser,
        user,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
