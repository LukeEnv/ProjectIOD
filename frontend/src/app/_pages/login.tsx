"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTokenContext } from "@/lib/contexts/token";

export default function Login() {
  const form = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const router = useRouter();
  const { refreshAccessToken } = useTokenContext();

  const onSubmit = async ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) => {
    try {
      const response = await axios.post("/api/auth/login", {
        username,
        password,
      });
      console.log("Login successful:", response.data);
      // After login, refresh the access token (which should get it from the cookie)
      await refreshAccessToken();
      // Redirect to the dashboard
      router.push("/dashboard");
      toast.success("Successfully signed in");
    } catch (error) {
      const errorMessage =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Login failed";
      toast.error(errorMessage);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <Input {...field} placeholder="Username" type="text" />
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <Input {...field} placeholder="Password" type="password" />
            )}
          />
          <Button>Login</Button>
        </div>
      </form>
    </Form>
  );
}
