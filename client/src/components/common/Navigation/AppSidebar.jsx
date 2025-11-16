"use client";
import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/common/Navigation/sidebar";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Menu items.
const menuItems = {
  student: [
    { title: "Overview", url: "/student/dashboard/overview", icon: Home },
    {
      title: "Apply for hostel",
      url: "/student/dashboard/apply",
      icon: Search,
    },
    {
      title: "Application Status",
      url: "/student/dashboard/applications",
      icon: Inbox,
    },
    {
      title: "Complaints",
      url: "/student/dashboard/complaints",
      icon: Settings,
    },
  ],

  admin: [
    {
      title: "Overview",
      value: "overview",
      url: "/admin/dashboard/overview",
      icon: Home,
    },
    {
      title: "Hostels",
      value: "hostels",
      url: "/admin/dashboard/hostels",
      icon: Inbox,
    },
    {
      title: "Rooms",
      value: "rooms",
      url: "/admin/dashboard/rooms",
      icon: Calendar,
    },
    // {
    //   title: "Students",
    //   value: "students",
    //   url: "/admin/dashboard/students",
    //   icon: Search,
    // },
    {
      title: "Applications",
      value: "applications",
      url: "/admin/dashboard/applications",
      icon: Settings,
    },
    {
      title: "Complaints",
      value: "complaints",
      url: "/admin/dashboard/complaints",
      icon: Settings,
    },
  ],
};

export function AppSidebar({ type = "student" }) {
  const pathName = usePathname();
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroupContent>
          <SidebarMenu>
            {menuItems[type].map((item) => {
              const isActive = pathName === item.url;
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    // className="hover:bg-accent hover:text-accent-foreground"
                    isActive={isActive}
                  >
                    <Link
                      href={item.url}
                      className={cn(
                        "h-10 text-[16px] flex gap-2 items-center",
                        item.value
                      )}
                    >
                      <item.icon />
                      <span className="cursor-default">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarContent>
    </Sidebar>
  );
}
