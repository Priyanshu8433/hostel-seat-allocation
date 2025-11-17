"use client";
import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";
import { LogOut, User as UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";

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
      title: "Hostel Application",
      url: "/student/dashboard/apply",
      icon: Search,
    },
    // {
    //   title: "Application Status",
    //   url: "/student/dashboard/applications",
    //   icon: Inbox,
    // },
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

export function AppSidebar({ type = "student", user }) {
  const pathName = usePathname();
  const router = useRouter();

  // Get user full name from prop or localStorage (fallback)
  let fullName = user?.full_name;
  if (!fullName && typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        fullName = JSON.parse(stored).full_name;
      }
    } catch {}
  }

  const handleLogout = () => {
    localStorage.clear();
    router.push("/auth");
  };

  return (
    <Sidebar>
      {/* Sidebar Header */}
      <div className="px-4 py-5 border-b flex items-center gap-2 bg-muted/50">
        {/* You can replace this with a logo image if desired */}
        <span className="text-xl font-extrabold tracking-tight text-primary">
          HostelSA
        </span>
      </div>
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
      {/* Sidebar Footer */}
      <div className="mt-auto px-4 py-8 border-t flex items-center gap-3 bg-muted/50">
        <UserIcon className="h-5 w-5 text-muted-foreground" />
        <span className="flex-1 truncate font-medium text-sm" title={fullName}>
          {fullName || "User"}
        </span>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1 text-destructive hover:underline text-sm font-medium"
          title="Logout"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </Sidebar>
  );
}
