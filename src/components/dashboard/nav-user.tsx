"use client";

import { Avatar, AvatarImage } from "../ui/avatar";
import { SidebarMenu, SidebarMenuItem } from "../ui/sidebar";

export function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="flex items-center gap-2 px-2 py-2 border bg-[#0A0A0A] rounded-md">
          <Avatar className="h-8 w-8 rounded-full">
            <AvatarImage src={user.avatar} alt={`${user.name} avatar`} />
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight text-white">
            <span className="truncate font-medium">{user.name}</span>
            <span className="truncate text-xs text-gray-400">{user.email}</span>
          </div>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
