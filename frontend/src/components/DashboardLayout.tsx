import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { UserDropdown } from "@/components/UserDropdown";
import { NotificationCenter } from "@/components/NotificationCenter";
import { SearchBar } from "@/components/SearchBar";
import { useDepartment } from "@/hooks/useDepartment";
import { Menu } from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  // Get user info from localStorage
  const userInfo = JSON.parse(localStorage.getItem('user') || '{"username": "Admin", "userType": "admin"}');
  const { currentDepartment, isDepartmentView } = useDepartment();
  
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-subtle">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <header className="bg-card/95 backdrop-blur-sm border-b border-border shadow-elegant sticky top-0 z-50">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </SidebarTrigger>
                <div className="flex flex-col">
                  <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                    College Admin Portal
                  </h1>
                  {isDepartmentView && currentDepartment && (
                    <span className="text-sm text-muted-foreground">
                      {currentDepartment.fullName || currentDepartment.name} Department
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <SearchBar 
                  placeholder="Search students, faculty, courses..."
                  className="hidden md:block w-80"
                />
                <NotificationCenter />
                <UserDropdown 
                  username={userInfo.username} 
                  userType={userInfo.userType} 
                />
              </div>
            </div>
          </header>
          
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}