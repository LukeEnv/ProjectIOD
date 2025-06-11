"use client";

import { createContext, useContext } from "react";
import { useAuthAxios } from "../axios";
import { User } from "@/types/user";
import { Customer } from "@/types/customer";
import useSWR from "swr";
import { toast } from "sonner";
import { useTokenContext } from "@/lib/contexts/token";

interface UserContextType {
  refetchUser: () => Promise<void>;
  updateUser: (updatedUser: {
    name?: string;
    username?: string;
    password?: string;
  }) => Promise<void>;
  user: User | null;
  createCustomer: (customer: Partial<Customer>) => Promise<unknown>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const api = useAuthAxios();
  const { initialized, accessToken } = useTokenContext();

  const fetcher = async (url: string) => {
    const res = await api.get(url);
    return res.data;
  };

  // Only fetch when initialized and accessToken are ready
  const shouldFetch = initialized && !!accessToken;
  const { data: user, mutate: refetchUser } = useSWR(
    shouldFetch ? `/users/me` : null,
    shouldFetch ? fetcher : null,
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
      const response = await api.put(`/users/me`, updatedUser);
      refetchUser();
      toast.success("User updated successfully!");
      return response.data;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  };

  const createCustomer = async (customer: Partial<Customer>) => {
    try {
      const response = await api.post("/customers", customer);
      toast.success("Customer created successfully!");
      return response.data;
    } catch (error) {
      toast.error("Failed to create customer");
      throw error;
    }
  };

  return (
    <UserContext.Provider
      value={{
        refetchUser,
        updateUser,
        user,
        createCustomer,
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

export function useAllUsers() {
  const authAxios = useAuthAxios();
  return useSWR("/users", async (url) => {
    const res = await authAxios.get(url);
    return res.data.data;
  });
}

export function useAllCustomers() {
  const authAxios = useAuthAxios();
  return useSWR("/customers", async (url) => {
    const res = await authAxios.get(url);
    return res.data.data;
  });
}
