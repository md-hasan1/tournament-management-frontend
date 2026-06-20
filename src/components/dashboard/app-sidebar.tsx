"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar";
import Cookies from "js-cookie";
import {
  CalendarDays,
  ConciergeBell,
  CreditCard,
  Crown,
  Dumbbell,
  LayoutGrid,
  LogOut,
  LucideTrophy,
  NotepadText,
  Settings,
  Trophy,
  UserRoundCheck,
  UsersRound,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type * as React from "react";
import { NavMain } from "./nav-main";
// import { TeamSwitcher } from "./team-switcher";
import Logo from "@/assets/dashboardlogo.png";
import { useGetMeQuery } from "@/redux/apiHooks/auth/authApi";
import { logout } from "@/redux/features/auth/authSlice";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { NavUser } from "./nav-user";

type Role = "coach" | "player" | "admin";

const navByRole = {
  player: [
    {
      title: "Dashboard",
      url: "/dashboard/player",
      icon: LayoutGrid,
    },
    {
      title: "Schedule",
      url: "/dashboard/player/schedule",
      icon: CalendarDays,
    },
    {
      title: "Waiver Center",
      url: "/dashboard/player/waiver-center",
      icon: NotepadText,
    },
    {
      title: "Settings",
      url: "/dashboard/player/setting",
      icon: Settings,
    },
  ],

  admin: [
    {
      title: "Dashboard",
      url: "/dashboard/admin",
      icon: LayoutGrid,
    },
    {
      title: "Tournaments",
      url: "/dashboard/admin/tournament",
      icon: Trophy,
    },
    {
      title: "Verification Center",
      url: "/dashboard/admin/verification-center",
      icon: UserRoundCheck,
    },
    {
      title: "Standings",
      url: "/dashboard/admin/standings",
      icon: Crown,
    },
    {
      title: "Referee",
      url: "/dashboard/admin/referee",
      icon: ConciergeBell,
    },
    {
      title: "Payments",
      url: "/dashboard/admin/payments",
      icon: CreditCard,
    },
    {
      title: "Proving Camp",
      url: "/dashboard/admin/proving-camp",
      icon: Dumbbell,
      items: [
        {
          title: "Overview",
          url: "/dashboard/admin/proving-camp",
        },
        {
          title: "Coaches",
          url: "/dashboard/admin/proving-camp/coaches",
        },
        {
          title: "Schedules",
          url: "/dashboard/admin/proving-camp/schedules",
        },
        {
          title: "Waitlist",
          url: "/dashboard/admin/proving-camp/waitlist",
        },
      ],
    },
    {
      title: "Settings",
      url: "/dashboard/admin/setting",
      icon: Settings,
    },
  ],

  coach: [
    {
      title: "Dashboard",
      url: "/dashboard/coach",
      icon: LayoutGrid,
    },
    {
      title: "All Players",
      url: "/dashboard/coach/team",
      icon: UsersRound,
    },
    {
      title: "Tournaments",
      url: "/dashboard/coach/tournament",
      icon: LucideTrophy,
    },
    {
      title: "Payments",
      url: "/dashboard/coach/payment",
      icon: CreditCard,
    },
    {
      title: "Settings",
      url: "/dashboard/coach/setting",
      icon: Settings,
    },
  ],
};

export function AppSidebar({
  role,
  ...props
}: React.ComponentProps<typeof Sidebar> & { role: Role }) {
  const pathname = usePathname();

  const { data: getMe } = useGetMeQuery(undefined);

  const userData = getMe?.data;

  const user = {
    name: userData?.fullName,
    email: userData?.email,
    avatar: userData?.profileImage,
  };

  const navItems = navByRole[role].map((item) => ({
    ...item,
    isActive:
      pathname === item.url || (item.url === "/dashboard" && pathname === "/"),
  }));

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

  return (
    <Sidebar
      collapsible="offcanvas"
      {...props}
      className="bg-[#0A0A0A] h-screen"
    >
      <SidebarContent className={`px-4 bg-[#0A0A0A] py-3 flex flex-col flex-1`}>
        {/* Logo */}
        <div className="mb-4 pb-4 border-b border-gray-800 flex justify-center">
          <Link href="/">
            <Image
              src={Logo}
              alt="Crown & Pitch"
              width={100}
              height={100}
              priority
            />
          </Link>
        </div>

        {/* Navigation Items */}
        <NavMain role={role} items={navItems} />

        {/* Spacer to push team switcher to bottom */}
        <div className="flex-1" />
      </SidebarContent>

      {/* Footer with Team Switcher and Logout */}
      <SidebarFooter className="bg-[#0A0A0A] border-t border-gray-800 px-4 py-3 space-y-3">
        {/* <TeamSwitcher teams={[{ name: "Main", logo: () => null }]} /> */}
        {role === "coach" && <NavUser user={user} />}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 text-[#35BACB] hover:text-[#35BACB]/80 font-semibold py-2.5 px-3 rounded-lg hover:bg-gray-900 transition-colors text-sm"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
