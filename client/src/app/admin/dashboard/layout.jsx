import { AppSidebar } from "@/components/common/Navigation/AppSidebar";
import { SidebarProvider } from "@/components/common/Navigation/sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div>
      <SidebarProvider>
        <AppSidebar type="admin" />
        <div className="px-10 py-12 flex-1">{children}</div>
      </SidebarProvider>
    </div>
  );
}
