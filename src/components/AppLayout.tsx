
import React, { ReactNode } from "react";
import Sidebar from "./Sidebar";
import { useApp } from "@/contexts/AppContext";
import { Navigate } from "react-router-dom";

interface AppLayoutProps {
  children: ReactNode;
  requireAuth?: boolean;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, requireAuth = true }) => {
  const { isAuthenticated } = useApp();
  
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-auto bg-gray-50 p-6">
        {children}
      </main>
    </div>
  );
};

export default AppLayout;
