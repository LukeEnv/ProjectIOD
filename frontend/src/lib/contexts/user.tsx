"use client";

import { createContext, useContext } from "react";
import { api, fetcher } from "../axios";
import { User } from "@/types/user";
import useSWR from "swr";
import { toast } from "sonner";
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
  const { data: user, mutate: refetchUser } = useSWR(`/api/me`, fetcher, {
    revalidateOnFocus: false,
    shouldRetryOnError: true,
    refreshInterval: 0, // Disable automatic revalidation
  });

  const updateUser = async (updatedUser: {
    name?: string;
    username?: string;
    password?: string;
  }) => {
    try {
      const response = await api.put(`/api/me`, updatedUser);
      refetchUser();
      toast.success("User updated successfully!");
      return response.data;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  };

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
