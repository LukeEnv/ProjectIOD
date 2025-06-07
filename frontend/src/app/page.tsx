"use client";

import { Tabs, TabsTrigger, TabsList, TabsContent } from "@/components/ui/tabs";
import Login from "./_pages/login";
import Register from "./_pages/register";

export default function AuthPage() {
  return (
    <div className="flex flex-col gap-4 max-w-sm justify-center items-center mx-auto my-auto">
      <h1 className="text-2xl font-bold">Welcome to the Auth Page</h1>
      <Tabs defaultValue="login" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Signup</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Login />
        </TabsContent>
        <TabsContent value="register">
          <Register />
        </TabsContent>
      </Tabs>
    </div>
  );
}
