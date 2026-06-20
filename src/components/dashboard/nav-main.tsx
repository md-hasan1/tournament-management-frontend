/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "../ui/sidebar";

type NavSubItem = {
  title: string;
  url: string;
};

type NavItem = {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  onClick?: () => void;
  badge?: string;
  items?: NavSubItem[];
};

export function NavMain({ items }: { items: NavItem[]; role: any }) {
  const pathname = usePathname();
  const router = useRouter();

  const defaultOpenMenus = useMemo(() => {
    return items.reduce<Record<string, boolean>>((acc, item) => {
      if (item.items?.length) {
        const shouldOpen = item.items.some(
          (subItem) =>
            pathname === subItem.url || pathname.startsWith(subItem.url + "/"),
        );
        acc[item.title] = shouldOpen;
      }
      return acc;
    }, {});
  }, [items, pathname]);

  const [openMenus, setOpenMenus] =
    useState<Record<string, boolean>>(defaultOpenMenus);

  return (
    <SidebarGroup className="py-0">
      <SidebarMenu className="space-y-1">
        {items.map((item) => {
          const isMainMatch =
            pathname === item.url || pathname.startsWith(item.url + "/");

          const hasChildren = !!item.items?.length;
          const hasActiveChild =
            hasChildren &&
            item.items!.some(
              (subItem) =>
                pathname === subItem.url ||
                pathname.startsWith(subItem.url + "/"),
            );

          // Check if there's a more specific menu item that also matches
          const hasMoreSpecificMatch =
            isMainMatch &&
            items.some(
              (other) =>
                other.url.length > item.url.length &&
                (pathname === other.url ||
                  pathname.startsWith(other.url + "/")),
            );

          const active =
            (isMainMatch && !hasMoreSpecificMatch) ||
            hasActiveChild ||
            item.isActive;

          const isExpanded = openMenus[item.title] || hasActiveChild;

          return (
            <SidebarMenuItem key={item.title}>
              {hasChildren ? (
                <>
                  <SidebarMenuButton
                    tooltip={item.title}
                    onClick={() => {
                      setOpenMenus((prev) => ({
                        ...prev,
                        [item.title]: true,
                      }));
                      router.push(item.url);
                    }}
                    className={cn(
                      "group relative w-full rounded-sm px-3 py-5",
                      "transition-all duration-300 ease-out",
                      "text-[#B3B3B3]",
                      active
                        ? "bg-[#35BACB] text-black"
                        : "hover:bg-[#35BACB] hover:text-black hover:-translate-y-px hover:shadow-md active:scale-[0.98]",
                    )}
                  >
                    {item.icon && <item.icon className="h-5 w-5 shrink-0" />}
                    <span className="font-medium">{item.title}</span>
                    <ChevronDown
                      className={cn(
                        "ml-auto h-4 w-4 shrink-0 transition-transform duration-200",
                        isExpanded && "rotate-180",
                      )}
                    />
                  </SidebarMenuButton>

                  {isExpanded && (
                    <SidebarMenuSub className="border-l-0 px-0 py-1 mx-0 mt-0.5 space-y-1">
                      {item.items?.map((subItem) => {
                        const isOverviewSubItem = subItem.url === item.url;
                        const isSubActive = isOverviewSubItem
                          ? pathname === item.url ||
                            pathname.startsWith(item.url + "/")
                          : pathname === subItem.url ||
                            pathname.startsWith(subItem.url + "/");

                        return (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={isSubActive}
                              className={cn(
                                "ml-6 rounded-sm px-3 py-2.5 text-sm",
                                isSubActive
                                  ? "bg-[#35BACB] text-black"
                                  : "text-[#B3B3B3] hover:bg-[#35BACB] hover:text-black",
                              )}
                            >
                              <Link href={subItem.url}>
                                <span className="leading-none">
                                  {subItem.title}
                                </span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        );
                      })}
                    </SidebarMenuSub>
                  )}
                </>
              ) : (
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  onClick={item.onClick}
                  className={cn(
                    "group relative w-full rounded-sm px-3 py-5",
                    "transition-all duration-300 ease-out",
                    "text-[#B3B3B3]",
                    active
                      ? "bg-[#35BACB] text-black"
                      : "hover:bg-[#35BACB] hover:text-black hover:-translate-y-px hover:shadow-md active:scale-[0.98]",
                  )}
                >
                  <Link href={item.url} className="flex items-center gap-3">
                    {item.icon && <item.icon className="h-5 w-5 shrink-0" />}
                    <span className="font-medium">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              )}

              {item.badge && (
                <SidebarMenuBadge className="right-4 bg-red-600 text-white rounded-full px-1.5 min-w-6 h-6 top-1/2 -translate-y-1/2">
                  {item.badge}
                </SidebarMenuBadge>
              )}
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
