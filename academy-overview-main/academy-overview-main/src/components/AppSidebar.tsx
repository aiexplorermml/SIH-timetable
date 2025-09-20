import { useState } from "react";
import { LayoutDashboard, Users, GraduationCap, Newspaper, BookOpen, ChevronDown, Building, Settings, Book, HardDrive, Home, School, Clock, Calendar } from "lucide-react";
import { NavLink, useLocation, useParams } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { departments, departmentSections, publicSections, adminSections } from "../../data/departments";
import { rolePermissions } from "../../data/auth";

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const params = useParams();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";
  const [openDepartments, setOpenDepartments] = useState<Record<string, boolean>>({});

  // Get user info from localStorage
  const userInfo = JSON.parse(localStorage.getItem('user') || '{"username": "Admin", "userType": "admin"}');
  const userType = userInfo.userType;

  const currentDepartment = params.department;
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isPublicOpen, setIsPublicOpen] = useState(false);
  const [openCurriculumDepts, setOpenCurriculumDepts] = useState<Record<string, boolean>>({});
  const [openAdminSections, setOpenAdminSections] = useState<Record<string, boolean>>({});

  // Role-based visibility checks
  const canViewAdmin = rolePermissions.canViewAdmin.includes(userType);
  const canViewDepartments = rolePermissions.canViewDepartments.includes(userType);
  const canViewPublic = rolePermissions.canViewPublic;

  const toggleDepartment = (deptId: string) => {
    setOpenDepartments(prev => ({
      ...prev,
      [deptId]: !prev[deptId]
    }));
  };

  const toggleCurriculumDept = (deptId: string) => {
    setOpenCurriculumDepts(prev => ({
      ...prev,
      [deptId]: !prev[deptId]
    }));
  };

  const toggleAdmin = () => {
    setIsAdminOpen(!isAdminOpen);
  };

  const togglePublic = () => {
    setIsPublicOpen(!isPublicOpen);
  };

  const toggleAdminSection = (sectionTitle: string) => {
    setOpenAdminSections(prev => ({
      ...prev,
      [sectionTitle]: !prev[sectionTitle]
    }));
  };

  const isActivePath = (deptId: string, sectionPath: string) => {
    const fullPath = sectionPath ? `/department/${deptId}/${sectionPath}` : `/department/${deptId}`;
    return currentPath === fullPath;
  };

  const isAdminActivePath = (sectionPath: string) => {
    return currentPath === `/admin/${sectionPath}`;
  };

  const isPublicActivePath = (sectionPath: string) => {
    return currentPath === `/${sectionPath}`;
  };

  const getNavCls = (isActive: boolean) =>
    isActive 
      ? "bg-sidebar-accent text-sidebar-primary-foreground font-medium border-r-2 border-sidebar-primary" 
      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground";

  return (
    <Sidebar className={collapsed ? "w-16" : "w-64"} collapsible="icon">
      <SidebarContent className="bg-sidebar border-r border-sidebar-border">
        <div className="p-6 border-b border-sidebar-border">
          <h2 className={`font-bold text-sidebar-foreground ${collapsed ? "text-center text-sm" : "text-lg"}`}>
            {collapsed ? "CAP" : "College Admin Portal"}
          </h2>
        </div>
        
        {/* Departments Section - Only for admin, hod, hod-support, faculty */}
        {canViewDepartments && (
          <SidebarGroup className="px-4 py-6">
            <SidebarGroupLabel className="text-sidebar-foreground/70 mb-4">
              {!collapsed && "Departments"}
            </SidebarGroupLabel>
            
            <SidebarGroupContent>
              <SidebarMenu className="space-y-2">
                {departments.map((dept) => {
                  const isOpen = openDepartments[dept.id] || currentDepartment === dept.id;
                  
                  return (
                    <SidebarMenuItem key={dept.id}>
                      <Collapsible open={isOpen} onOpenChange={() => toggleDepartment(dept.id)}>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton className="w-full justify-between">
                            <div className="flex items-center">
                              <Building className={`h-5 w-5 ${!collapsed ? "mr-3" : ""}`} />
                              {!collapsed && <span>{dept.name}</span>}
                            </div>
                            {!collapsed && (
                              <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                            )}
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        
                        {!collapsed && (
                          <CollapsibleContent>
                            <SidebarMenuSub className="ml-4 mt-2 space-y-1">
                              {departmentSections.map((section) => (
                                <SidebarMenuSubItem key={section.title}>
                                  {section.subSections ? (
                                    <Collapsible 
                                      open={openCurriculumDepts[dept.id]} 
                                      onOpenChange={() => toggleCurriculumDept(dept.id)}
                                    >
                                      <CollapsibleTrigger asChild>
                                        <SidebarMenuSubButton className="w-full justify-between">
                                          <div className="flex items-center">
                                            <section.icon className="h-4 w-4 mr-2" />
                                            <span className="text-sm">{section.title}</span>
                                          </div>
                                          <ChevronDown className={`h-3 w-3 transition-transform ${openCurriculumDepts[dept.id] ? "rotate-180" : ""}`} />
                                        </SidebarMenuSubButton>
                                      </CollapsibleTrigger>
                                      <CollapsibleContent>
                                        <div className="ml-4 mt-1 space-y-1">
                                          {section.subSections.map((subSection) => (
                                            <SidebarMenuSubButton key={subSection.title} asChild>
                                              <NavLink 
                                                to={`/department/${dept.id}/${subSection.path}`}
                                                className={`flex items-center rounded-lg px-3 py-1 transition-all duration-200 text-xs ${
                                                  getNavCls(isActivePath(dept.id, subSection.path))
                                                }`}
                                              >
                                                <span>{subSection.title}</span>
                                              </NavLink>
                                            </SidebarMenuSubButton>
                                          ))}
                                        </div>
                                      </CollapsibleContent>
                                    </Collapsible>
                                  ) : (
                                    <SidebarMenuSubButton asChild>
                                      <NavLink 
                                        to={`/department/${dept.id}${section.path ? `/${section.path}` : ''}`}
                                        className={`flex items-center rounded-lg px-3 py-2 transition-all duration-200 ${
                                          getNavCls(isActivePath(dept.id, section.path))
                                        }`}
                                      >
                                        <section.icon className="h-4 w-4 mr-2" />
                                        <span className="text-sm">{section.title}</span>
                                      </NavLink>
                                    </SidebarMenuSubButton>
                                  )}
                                </SidebarMenuSubItem>
                              ))}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        )}
                      </Collapsible>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Public Section - Visible to all users */}
        {canViewPublic && (
          <SidebarGroup className={`px-4 py-6 ${canViewDepartments ? 'border-t border-sidebar-border' : ''}`}>
            <SidebarGroupLabel className="text-sidebar-foreground/70 mb-4">
              {!collapsed && "Public"}
            </SidebarGroupLabel>
            
            <SidebarGroupContent>
              <SidebarMenu className="space-y-2">
                <SidebarMenuItem>
                  <Collapsible open={isPublicOpen} onOpenChange={togglePublic}>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton className="w-full justify-between">
                        <div className="flex items-center">
                          <Home className={`h-5 w-5 ${!collapsed ? "mr-3" : ""}`} />
                          {!collapsed && <span>Public</span>}
                        </div>
                        {!collapsed && (
                          <ChevronDown className={`h-4 w-4 transition-transform ${isPublicOpen ? "rotate-180" : ""}`} />
                        )}
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    
                    {!collapsed && (
                      <CollapsibleContent>
                        <SidebarMenuSub className="ml-4 mt-2 space-y-1">
                          {publicSections.map((section) => (
                            <SidebarMenuSubItem key={section.title}>
                              <SidebarMenuSubButton asChild>
                                <NavLink 
                                  to={`/${section.path}`}
                                  className={`flex items-center rounded-lg px-3 py-2 transition-all duration-200 ${
                                    getNavCls(isPublicActivePath(section.path))
                                  }`}
                                >
                                  <section.icon className="h-4 w-4 mr-2" />
                                  <span className="text-sm">{section.title}</span>
                                </NavLink>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    )}
                  </Collapsible>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Admin Section - Only for admin and hod */}
        {canViewAdmin && (
          <SidebarGroup className="px-4 py-6 border-t border-sidebar-border">
            <SidebarGroupLabel className="text-sidebar-foreground/70 mb-4">
              {!collapsed && "Administration"}
            </SidebarGroupLabel>
            
            <SidebarGroupContent>
              <SidebarMenu className="space-y-2">
                <SidebarMenuItem>
                  <Collapsible open={isAdminOpen} onOpenChange={toggleAdmin}>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton className="w-full justify-between">
                        <div className="flex items-center">
                          <Settings className={`h-5 w-5 ${!collapsed ? "mr-3" : ""}`} />
                          {!collapsed && <span>Admin</span>}
                        </div>
                        {!collapsed && (
                          <ChevronDown className={`h-4 w-4 transition-transform ${isAdminOpen ? "rotate-180" : ""}`} />
                        )}
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    
                    {!collapsed && (
                      <CollapsibleContent>
                        <SidebarMenuSub className="ml-4 mt-2 space-y-1">
                          {adminSections.map((section) => (
                            <SidebarMenuSubItem key={section.title}>
                              {section.subSections ? (
                                <Collapsible 
                                  open={openAdminSections[section.title]} 
                                  onOpenChange={() => toggleAdminSection(section.title)}
                                >
                                  <CollapsibleTrigger asChild>
                                    <SidebarMenuSubButton className="w-full justify-between">
                                      <div className="flex items-center">
                                        <section.icon className="h-4 w-4 mr-2" />
                                        <span className="text-sm">{section.title}</span>
                                      </div>
                                      <ChevronDown className={`h-3 w-3 transition-transform ${openAdminSections[section.title] ? "rotate-180" : ""}`} />
                                    </SidebarMenuSubButton>
                                  </CollapsibleTrigger>
                                  <CollapsibleContent>
                                    <div className="ml-4 mt-1 space-y-1">
                                      {section.subSections.map((subSection) => (
                                        <SidebarMenuSubButton key={subSection.title} asChild>
                                          <NavLink 
                                            to={`/admin/${subSection.path}`}
                                            className={`flex items-center rounded-lg px-3 py-1 transition-all duration-200 text-xs ${
                                              getNavCls(isAdminActivePath(subSection.path))
                                            }`}
                                          >
                                            <span>{subSection.title}</span>
                                          </NavLink>
                                        </SidebarMenuSubButton>
                                      ))}
                                    </div>
                                  </CollapsibleContent>
                                </Collapsible>
                              ) : (
                                <SidebarMenuSubButton asChild>
                                  <NavLink 
                                    to={`/admin/${section.path}`}
                                    className={`flex items-center rounded-lg px-3 py-2 transition-all duration-200 ${
                                      getNavCls(isAdminActivePath(section.path))
                                    }`}
                                  >
                                    <section.icon className="h-4 w-4 mr-2" />
                                    <span className="text-sm">{section.title}</span>
                                  </NavLink>
                                </SidebarMenuSubButton>
                              )}
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    )}
                  </Collapsible>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}