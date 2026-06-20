"use client";
import Logo from "@/assets/dashboardlogo.png";
import { logout } from "@/redux/features/auth/authSlice";
import Cookies from "js-cookie";
import { CircleQuestionMark, LogOut } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { AlertDialogHeader } from "../ui/alert-dialog";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../ui/dialog";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";

export function TeamSwitcher({
  teams,
}: {
  teams: { name: string; logo: React.ElementType }[];
}) {
  const [activeTeam] = React.useState(teams[0]);
  const [open, setOpen] = React.useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout());
    Cookies.remove("token");
    Cookies.remove("role");
    toast.success("Logged out successfully!");
    setTimeout(() => {
      router.push("/");
      router.refresh(); // Optional: refresh to clear any cached data
    }, 300);
  };

  if (!activeTeam) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Sidebar top logo */}
      <SidebarMenu>
        <SidebarMenuItem>
          <div className="flex justify-center items-center p-4 ">
            <Image
              src={Logo}
              alt="logo"
              width={150}
              height={50}
              className=" p-4 shadow-2xl rounded-2xl bg-[#EFEFEF]/10"
            />
          </div>
        </SidebarMenuItem>
      </SidebarMenu>

      {/* Logout button fixed at bottom */}
      <div className="absolute bottom-4 left-4 right-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => setOpen(true)}
              className="text-[#B3B3B3] border rounded-sm py-6 w-full text-base sm:text-lg font-medium cursor-pointer flex items-center justify-center gap-2 transition-all duration-300 ease-out hover:bg-[#35BACB] hover:text-black hover:shadow-md hover:-translate-y-px active:translate-y-0 active:scale-[0.98]"
            >
              <LogOut className="w-5 h-5 transition-transform duration-300 group-hover:-rotate-6" />
              <span>Log out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </div>

      {/* Logout confirmation modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className=" sm:max-w-sm bg-gray-900 text-center text-[#35BACB] flex flex-col justify-center items-center mx-auto">
          <AlertDialogHeader className="w-full mx-auto justify-center items-center">
            <div className="flex justify-center mb-2">
              <CircleQuestionMark className="w-30 h-30 text-[#35BACB]" />
            </div>
            <DialogTitle className="text-xl font-semibold">
              Are You Sure?
            </DialogTitle>
            <DialogDescription className="text-white">
              Do you want to log out?
            </DialogDescription>
          </AlertDialogHeader>
          <div className="w-full flex justify-center gap-4 mt-4">
            <Button
              onClick={handleLogout}
              className="flex-1 rounded-lg py-3 bg-red-600 text-white hover:bg-red-700 focus-visible:ring-2 focus-visible:ring-red-500 transition-colors cursor-pointer"
            >
              Log Out
            </Button>
            <Button
              variant="secondary"
              onClick={() => setOpen(false)}
              className="flex-1 rounded-lg py-3 border-gray-300 text-gray-700 hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-gray-400 transition-colors cursor-pointer"
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
