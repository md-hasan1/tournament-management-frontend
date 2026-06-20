"use client";

import React, { ReactNode, useMemo } from "react";
import AppHeader from "@/components/dashboard/app-header";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
// import { Toaster } from "sonner";
import { useAppSelector } from "@/redux/hooks";

type Role = "admin" | "coach" | "player";
type BackendRole = "ADMIN" | "PLAYER" | "COACH" | "MANAGER";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const reduxRole = useAppSelector(
    (state) => state.auth.user?.role as BackendRole | undefined,
  );

  const role: Role = useMemo(() => {
    switch (reduxRole) {
      case "ADMIN":
        return "admin";
      case "PLAYER":
        return "player";
      case "COACH":
        return "coach";
      case "MANAGER":
        return "coach";
      default:
        return "coach"; // fallback
    }
  }, [reduxRole]);

  return (
    <div className="h-screen flex overflow-hidden">
      <SidebarProvider>
        <AppSidebar role={role} />
        <SidebarInset className="flex flex-col flex-1">
          <AppHeader />
          <div className="flex-1 overflow-y-auto bg-[#0A0A0A] text-white">
            <div className="flex flex-col gap-4 p-4 pt-0">
              {children}
              {/* <Toaster richColors position="top-center" /> */}
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
};

export default DashboardLayout;
