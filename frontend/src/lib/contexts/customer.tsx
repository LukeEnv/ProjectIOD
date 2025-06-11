import useSWR from "swr";
import { useAuthAxios } from "../axios";

export interface Customer {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: number;
  address: string;
  createdAt?: string;
  updatedAt?: string;
}

export function useAllCustomers() {
  const authAxios = useAuthAxios();
  return useSWR("/customers", async (url) => {
    const res = await authAxios.get(url);
    return res.data.data as Customer[];
  });
}
