
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  TicketIcon,
  LayoutDashboardIcon,
  InboxIcon,
  SettingsIcon,
  PlusCircleIcon,
  LogOutIcon,
  UsersIcon,
  BarChart3Icon,
  UserIcon,
  ShieldIcon,
  ClockIcon,
  StarIcon
} from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const Sidebar = () => {
  const location = useLocation();
  const { user, unreadNotificationsCount, logout } = useApp();

  const navigation = [
    { name: "Dashboard", href: "/", icon: LayoutDashboardIcon },
    { name: "Tickets", href: "/tickets", icon: TicketIcon },
    { name: "Create Ticket", href: "/tickets/new", icon: PlusCircleIcon },
    { name: "Notifications", href: "/notifications", icon: InboxIcon, badge: unreadNotificationsCount },
    { name: "Analytics", href: "/analytics", icon: BarChart3Icon },
    // Add new modules
    { name: "Timesheets", href: "/timesheets", icon: ClockIcon },
  ];

  // Only show Outsource Review for supervisors or admins
  const isManager = user && (user.role === 'supervisor' || user.role === 'admin');
  
  if (isManager) {
    navigation.push({ name: "Outsource Review", href: "/reviews", icon: StarIcon });
  }

  // Admin-only navigation items
  const adminNavigation = [
    { name: "Users & Teams", href: "/users", icon: UsersIcon },
  ];

  // User profile and settings
  const userNavigation = [
    { name: "My Profile", href: "/profile", icon: UserIcon },
    { name: "Settings", href: "/settings", icon: SettingsIcon },
  ];

  return (
    <div className="bg-sidebar border-r border-sidebar-border h-screen w-64 flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-sidebar-foreground flex items-center">
          <TicketIcon className="mr-2 text-app-purple" />
          <span>Helpdesk</span>
        </h1>
      </div>
      
      <div className="flex-1 px-3 py-2 space-y-1">
        {navigation.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className={cn(
              "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
              location.pathname === item.href
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
            )}
          >
            <item.icon className="mr-3 h-5 w-5" />
            <span>{item.name}</span>
            {item.badge ? (
              <span className="ml-auto bg-app-purple text-white text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center">
                {item.badge}
              </span>
            ) : null}
          </Link>
        ))}
        
        {user && user.role === 'admin' && (
          <>
            <Separator className="my-2" />
            <div className="px-3 py-2">
              <h2 className="mb-2 px-2 text-xs font-semibold tracking-tight text-sidebar-foreground/70">
                Administration
              </h2>
              {adminNavigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    location.pathname === item.href
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  <span>{item.name}</span>
                  {item.badge ? (
                    <span className="ml-auto bg-app-purple text-white text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center">
                      {item.badge}
                    </span>
                  ) : null}
                </Link>
              ))}
            </div>
          </>
        )}
        
        <Separator className="my-2" />
        <div className="px-3 py-2">
          <h2 className="mb-2 px-2 text-xs font-semibold tracking-tight text-sidebar-foreground/70">
            User
          </h2>
          {userNavigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                location.pathname === item.href
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className="mr-3 h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
      
      <Separator className="my-2" />
      
      {user && (
        <div className="p-4 flex flex-col">
          <div className="flex items-center mb-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="ml-3">
              <p className="text-sm font-medium text-sidebar-foreground">{user.name}</p>
              <p className="text-xs text-sidebar-foreground/70 flex items-center">
                {user.role === 'admin' && <ShieldIcon className="h-3 w-3 mr-1 text-app-purple" />}
                {user.role === 'admin' ? 'Quản trị viên' : 
                 user.role === 'supervisor' ? 'Quản lý' :
                 user.role === 'agent' ? 'Nhân viên hỗ trợ' :
                 user.role === 'approver' ? 'Người phê duyệt' : 'Người yêu cầu'}
              </p>
            </div>
          </div>
          <Button variant="outline" className="w-full" onClick={logout}>
            <LogOutIcon className="mr-2 h-4 w-4" />
            Đăng xuất
          </Button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
