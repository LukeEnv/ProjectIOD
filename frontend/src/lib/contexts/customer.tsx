import useSWR from "swr";
import { useAuthAxios } from "../axios";

export interface Customer {
  _id: string;
  name: string;
  // Add other fields as needed
}

export function useAllCustomers() {
  const authAxios = useAuthAxios();
  return useSWR("/customers", async (url) => {
    const res = await authAxios.get(url);
    return res.data.data as Customer[];
  });
}
