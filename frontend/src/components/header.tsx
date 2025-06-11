import React from "react";
import { useUserContext } from "@/lib/contexts/user";
import {
  Activity,
  House,
  LogOut,
  Moon,
  Settings,
  Sun,
  User,
} from "lucide-react";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useDarkMode } from "@/lib/contexts/darkmode";
import {
  Tooltip,
  TooltipTrigger,
  TooltipProvider,
  TooltipContent,
} from "./ui/tooltip";
import { useTokenContext } from "@/lib/contexts/token";

export default function Header() {
  const { user } = useUserContext();
  const { signout } = useTokenContext();
  const pathname = usePathname();
  const { toggleDarkMode, isDarkMode } = useDarkMode();

  return (
    <>
      <div className="w-full text-white">
        <div className="flex w-full px-6 py-4 gap-8 items-center">
          <div className="flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/dashboard">
                    <Button
                      size={"icon"}
                      variant={pathname === "/dashboard" ? "default" : "ghost"}
                      className="cursor-pointer"
                    >
                      <House />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>Dashboard</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/dashboard/settings">
                    <Button
                      size={"icon"}
                      variant={
                        pathname === "/dashboard/settings" ? "default" : "ghost"
                      }
                      className="cursor-pointer"
                    >
                      <Settings />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>Settings</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex-1 flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size={"icon"}>
                  <User className="text-black" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="font-poppins font-semibold font-sm w-52">
                <div className="flex flex-col gap-2 px-4 py-2">
                  <p className="text-sm text-gray-500">Signed in as</p>
                  <p className="text-lg">{user?.firstName}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={toggleDarkMode}>
                  {isDarkMode ? <Sun /> : <Moon />}
                  {isDarkMode ? "Light mode" : "Dark mode"}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onClick={signout}>
                  <LogOut />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <Separator />
      </div>
    </>
  );
}
