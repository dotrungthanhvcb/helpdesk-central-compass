
import React, { ReactNode, useEffect } from "react";
import Sidebar from "./Sidebar";
import { useApp } from "@/contexts/AppContext";
import { Navigate } from "react-router-dom";

interface AppLayoutProps {
  children: ReactNode;
  requireAuth?: boolean;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, requireAuth = true }) => {
  const { isAuthenticated } = useApp();
  
  useEffect(() => {
    // Update document title
    document.title = "Ứng dụng quản lý outsource – Trung tâm Ngân hàng Số";
  }, []);
  
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-auto bg-vcb-background p-6">
        {children}
      </main>
    </div>
  );
};

export default AppLayout;
