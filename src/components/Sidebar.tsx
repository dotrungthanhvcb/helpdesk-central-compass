
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
  StarIcon,
  HardDriveIcon,
  FileTextIcon,
  Users
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
    { name: "Trang chủ", href: "/", icon: LayoutDashboardIcon },
    { name: "Danh sách yêu cầu", href: "/tickets", icon: TicketIcon },
    { name: "Tạo yêu cầu mới", href: "/tickets/new", icon: PlusCircleIcon },
    { name: "Thông báo", href: "/notifications", icon: InboxIcon, badge: unreadNotificationsCount },
    { name: "Thống kê", href: "/analytics", icon: BarChart3Icon },
    { name: "Quản lý thời gian", href: "/timesheets", icon: ClockIcon },
    { name: "Cài đặt môi trường", href: "/environment-setup", icon: HardDriveIcon },
  ];

  const isManager = user && (user.role === 'supervisor' || user.role === 'admin');
  
  if (isManager) {
    navigation.push(
      { name: "Đánh giá outsource", href: "/reviews", icon: StarIcon },
      { name: "Hợp đồng", href: "/contracts", icon: FileTextIcon },
      { name: "Phân bổ nhân sự", href: "/squad-allocation", icon: Users }
    );
  }

  const adminNavigation = [
    { name: "Quản lý người dùng", href: "/users", icon: UsersIcon },
  ];

  const userNavigation = [
    { name: "Thông tin cá nhân", href: "/profile", icon: UserIcon },
    { name: "Cài đặt", href: "/settings", icon: SettingsIcon },
  ];

  return (
    <div className="bg-vcb-primary border-r border-vcb-dark h-screen w-64 flex flex-col text-white">
      <div className="p-6">
        <h1 className="text-xl font-bold text-white flex items-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white"/>
            <path d="M2 17L12 22L22 17V7L12 12L2 7V17Z" fill="white" fillOpacity="0.6"/>
          </svg>
          <span className="text-sm leading-tight">Ứng dụng quản lý<br/>outsource</span>
        </h1>
        <div className="text-xs text-white/60 mt-1">Trung tâm Ngân hàng Số</div>
      </div>
      
      <div className="flex-1 px-3 py-2 overflow-y-auto">
        <div className="space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                location.pathname === item.href
                  ? "bg-vcb-dark text-white"
                  : "text-white/80 hover:bg-vcb-dark/50 hover:text-white"
              )}
            >
              <item.icon className="mr-3 h-5 w-5" />
              <span>{item.name}</span>
              {item.badge ? (
                <span className="ml-auto bg-vcb-secondary text-white text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center">
                  {item.badge}
                </span>
              ) : null}
            </Link>
          ))}
        </div>
        
        {user && user.role === 'admin' && (
          <>
            <Separator className="my-2 bg-white/10" />
            <div className="px-3 py-2">
              <h2 className="mb-2 px-2 text-xs font-semibold tracking-tight text-white/70">
                Quản trị viên
              </h2>
              {adminNavigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    location.pathname === item.href
                      ? "bg-vcb-dark text-white"
                      : "text-white/80 hover:bg-vcb-dark/50 hover:text-white"
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          </>
        )}
        
        <Separator className="my-2 bg-white/10" />
        <div className="px-3 py-2">
          <h2 className="mb-2 px-2 text-xs font-semibold tracking-tight text-white/70">
            Người dùng
          </h2>
          {userNavigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                location.pathname === item.href
                  ? "bg-vcb-dark text-white"
                  : "text-white/80 hover:bg-vcb-dark/50 hover:text-white"
              )}
            >
              <item.icon className="mr-3 h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
      
      <Separator className="my-2 bg-white/10" />
      
      {user && (
        <div className="p-4 flex flex-col">
          <div className="flex items-center mb-4">
            <Avatar className="h-10 w-10 border-2 border-white/20">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-vcb-secondary text-white">{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">{user.name}</p>
              <p className="text-xs text-white/70 flex items-center">
                {user.role === 'admin' && <ShieldIcon className="h-3 w-3 mr-1 text-vcb-secondary" />}
                {user.role === 'admin' ? 'Quản trị viên' : 
                 user.role === 'supervisor' ? 'Quản lý' :
                 user.role === 'agent' ? 'Nhân viên hỗ trợ' :
                 user.role === 'approver' ? 'Người phê duyệt' : 'Người yêu cầu'}
              </p>
            </div>
          </div>
          <Button variant="outline" className="w-full bg-transparent border border-white/20 text-white hover:bg-white/10" onClick={logout}>
            <LogOutIcon className="mr-2 h-4 w-4" />
            Đăng xuất
          </Button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
