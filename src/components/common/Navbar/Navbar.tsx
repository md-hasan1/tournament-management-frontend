"use client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Cookies from "js-cookie";
import { ChevronDown, LayoutDashboard, LogOut, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation"; // Correct hook for App Router

import logo from "@/assets/logo (2).png";
import { logout } from "@/redux/features/auth/authSlice";
import { useAppSelector } from "@/redux/hooks";
import { useCallback, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
// import { toast } from "sonner";

const navigationLinks = [
  { name: "Home", href: "/" },
  { name: "Tournaments", href: "/tournaments" },
  { name: "Proving Camp", href: "/proving-camp" },
  { name: "How it Works", href: "/how-it-works" },
  { name: "Standings", href: "/standings" },
  // { name: "Rules", href: "/rules" },
  { name: "About", href: "/about" },
  { name: "FAQ", href: "/faq" },
  { name: "Policies", href: "/legal" },
];

export const Navbar = () => {
  const reduxUser = useAppSelector((state) => state.auth.user);
  const isLoggedIn = !!reduxUser; // ✅ real login state
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const dispatch = useDispatch();

  const handleLogout = useCallback(() => {
    dispatch(logout());
    Cookies.remove("token");
    Cookies.remove("role");
    // toast.success("Logged out successfully!");
    setTimeout(() => {
      // router.push("/");
      router.refresh(); // Optional: refresh to clear any cached data
    }, 300);
  }, [dispatch, router]);

  const roleSlug = useMemo(() => {
    switch (reduxUser?.role) {
      case "ADMIN":
        return "admin";
      case "PLAYER":
        return "player";
      case "COACH":
      case "MANAGER":
        return "coach";
      default:
        return "coach"; // fallback
    }
  }, [reduxUser?.role]);

  const dashboardHref = `/dashboard/${roleSlug}`;

  const userDisplayName = useMemo(() => {
    return (
      reduxUser?.fullName ||
      [reduxUser?.firstName, reduxUser?.lastName].filter(Boolean).join(" ") ||
      reduxUser?.email ||
      "User"
    );
  }, [reduxUser]);

  const profileInitials = useMemo(() => {
    const base = String(userDisplayName).trim();
    const parts = base.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return base.slice(0, 2).toUpperCase();
  }, [userDisplayName]);

  const roleLabel = reduxUser?.role ?? "COACH";

  const isActiveLink = useCallback(
    (href: string) => {
      if (href === "/") return pathname === "/";
      return pathname === href || pathname.startsWith(`${href}/`);
    },
    [pathname],
  );

  const desktopProfileMenu = isLoggedIn ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="hidden md:inline-flex items-center gap-2 rounded-full border border-[#35BACB]/60 bg-[#101010] px-2 py-1 text-[#35BACB] hover:bg-[#181818] transition"
        >
          <Avatar size="sm" className="ring-1 ring-[#35BACB]/60">
            <AvatarFallback className="bg-[#35BACB] text-black font-semibold">
              {profileInitials}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-semibold max-w-24 truncate">
            {userDisplayName}
          </span>
          <ChevronDown className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 bg-[#0f0f0f] border-[#2e2e2e] text-white"
      >
        <DropdownMenuLabel>
          <p className="font-semibold truncate">{userDisplayName}</p>
          <p className="text-xs text-gray-400">{roleLabel}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-[#2e2e2e]" />
        <DropdownMenuItem asChild>
          <Link href={dashboardHref} className="cursor-pointer">
            <LayoutDashboard className="h-4 w-4 text-[#35BACB]" />
            Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer text-red-400 focus:text-red-300"
        >
          <LogOut className="h-4 w-4" />
          Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : null;

  const mobileAuthActions = isLoggedIn ? (
    <div className="mt-4 flex flex-col gap-3">
      <Link
        href={dashboardHref}
        onClick={() => setIsOpen(false)}
        className="w-full rounded bg-[#35BACB] px-4 py-2.5 text-center font-semibold text-black transition hover:bg-[#A232D6]"
      >
        Dashboard
      </Link>
      <button
        onClick={() => {
          setIsOpen(false);
          handleLogout();
        }}
        className="w-full rounded border border-[#35BACB] px-4 py-2.5 font-semibold text-[#35BACB] transition hover:bg-[#35BACB] hover:text-black"
      >
        Log Out
      </button>
    </div>
  ) : (
    <div className="mt-4 flex flex-col gap-3">
      <Link href="/auth/signup" onClick={() => setIsOpen(false)}>
        <Button className="w-full bg-[#35BACB] text-black font-semibold border-[#35BACB] hover:bg-[#A232D6] focus:ring-[#35BACB] px-6 py-2 rounded transition-all duration-150">
          Get Started
        </Button>
      </Link>
      <Link href="/auth/signin" onClick={() => setIsOpen(false)}>
        <Button
          className="w-full bg-transparent text-[#35BACB] border border-[#35BACB] hover:bg-[#35BACB] hover:text-black focus:ring-[#35BACB] px-6 py-2 rounded transition-all duration-150"
          variant="outline"
        >
          Log In
        </Button>
      </Link>
    </div>
  );

  const isHeroPage = pathname === "/" || pathname === "/proving-camp";

  return (
    <header
      className={`z-50 flex w-full flex-col items-start gap-1 px-3 py-2 sm:px-6 md:py-3 lg:px-8 xl:px-12 ${
        isHeroPage
          ? "fixed top-0 left-0 border-b border-[#6B6B6B] bg-black/35 backdrop-blur-[2px]"
          : "sticky top-0 border-b border-[#6B6B6B] bg-black/95 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto flex w-full flex-nowrap items-center justify-between gap-3">
        {/* Logo */}
        <div className="flex items-center gap-2 font-['Oswald'] text-base md:text-lg xl:text-xl text-[#35BACB] shrink-0">
          <Link href="/" className="flex items-center gap-1 select-none">
            <Image
              src={logo}
              alt="Crown & Pitch"
              width={300}
              height={150}
              priority
              className="w-50 h-10"
            />
          </Link>
          {/* <p className="uppercase font-semibold">
            <span className="text-white">Crown</span>{" "}
            <span className="text-gray-400">&</span>{" "}
            <span className="text-[#35BACB]">Pitch</span>
          </p> */}
        </div>
        {/* Desktop Nav */}
        <nav className="hidden xl:flex flex-1 justify-center items-center gap-2 2xl:gap-6 min-w-0">
          {navigationLinks.map((link) => {
            const isActive = isActiveLink(link.href);
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center px-2 py-1 text-sm 2xl:text-[1rem] font-medium transition-colors gap-2 rounded whitespace-nowrap hover:text-[#35BACB] focus:text-[#35BACB]    ${
                  isActive
                    ? "hover:text-[#35BACB] text-[#35BACB] outline-none  "
                    : "" // Apply active styles when link is active
                }`}
              >
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2 md:gap-3 font-['Oswald'] shrink-0">
          {isLoggedIn ? (
            desktopProfileMenu
          ) : (
            <>
              <Link href="/auth/signup">
                <Button
                  className="hidden md:inline-flex bg-[#35BACB] text-black font-semibold border-2 border-[#35BACB] hover:bg-[#A232D6] focus:ring-[#35BACB] px-4 xl:px-6 py-2 rounded transition-all duration-150 shadow-md"
                  size="sm"
                >
                  Get Started
                </Button>
              </Link>
              <Link
                href="/auth/signin"
                className="hidden md:inline-flex bg-transparent text-[#35BACB] border border-[#35BACB] hover:bg-[#35BACB] hover:text-black focus:ring-[#35BACB] px-4 xl:px-6 py-1 rounded transition-all duration-150 shadow-md"
              >
                Log In
              </Link>
            </>
          )}

          {/* Mobile Hamburger */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="xl:hidden">
              <Button variant="ghost" size="icon" className="text-[#35BACB]">
                <Menu className="h-7 w-7" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[80vw] max-w-xs p-0 h-svh overflow-hidden"
            >
              <SheetTitle className="sr-only">Mobile navigation</SheetTitle>
              <div className="flex h-full min-h-0 flex-col bg-[#050505]">
                <div className="flex items-center justify-between px-4 py-4 border-b">
                  <Link
                    href="/"
                    className="flex items-center gap-1 select-none"
                    onClick={() => setIsOpen(false)}
                  >
                    <Image
                      src="/images/logo.png"
                      alt="Crown & Pitch"
                      width={70}
                      height={32}
                      priority
                    />
                  </Link>
                  {/* <button
                    onClick={() => setIsOpen(false)}
                    className="text-xl font-bold text-[#35BACB]"
                  >
                    ×
                  </button> */}
                </div>
                <nav className="flex-1 overflow-y-auto px-4 py-6">
                  <div className="flex flex-col gap-2">
                    {navigationLinks.map((link) => (
                      <Link
                        key={link.name}
                        href={link.href}
                        className="flex items-center px-2 py-3 text-lg font-medium rounded hover:bg-[#35BACB]/10 transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        {link.name}
                      </Link>
                    ))}
                    {mobileAuthActions}
                  </div>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
        {/* Action Buttons */}
      </div>
    </header>
  );
};
