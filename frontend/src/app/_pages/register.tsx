import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField } from "@/components/ui/form";

import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "sonner";

export default function Register() {
  const form = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      username: "",
      password: "",
    },
  });

  const onSubmit = ({
    firstName,
    lastName,
    email,
    username,
    password,
  }: {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    password: string;
  }) => {
    axios
      .post("/api/users", {
        firstName,
        lastName,
        email,
        username,
        password,
      })
      .then((response) => {
        toast.success("Signup successful!");
        console.log("Signup successful:", response.data);
      })
      .catch((error) => {
        toast.error("Signup failed!");
        console.error("Signup failed:", error);
      });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <Input {...field} placeholder="First Name" type="text" />
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <Input {...field} placeholder="Last Name" type="text" />
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <Input {...field} placeholder="Email" type="email" />
            )}
          />
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
          <Button>Signup</Button>
        </div>
      </form>
    </Form>
  );
}
