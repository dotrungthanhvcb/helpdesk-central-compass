
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EnvironmentSetupList } from "@/components/environment-setup/EnvironmentSetupList";
import { CreateEnvironmentSetupForm } from "@/components/environment-setup/CreateEnvironmentSetupForm";
import { useApp } from "@/contexts/AppContext";
import { UserRole } from "@/types";

const EnvironmentSetupPage = () => {
  const { user } = useApp();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all");

  // Check if user has access to this module
  const hasAccess = user && ['admin', 'supervisor', 'agent'].includes(user.role as UserRole);
  
  if (!hasAccess) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardHeader>
            <CardTitle>Không có quyền truy cập</CardTitle>
            <CardDescription>
              Bạn không có quyền truy cập module thiết lập môi trường làm việc.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Thiết lập môi trường</h1>
          <p className="text-muted-foreground">
            Quản lý và theo dõi thiết lập môi trường làm việc cho nhân viên
          </p>
        </div>
        {(user?.role === 'admin' || user?.role === 'supervisor') && (
          <Button onClick={() => setActiveTab("new")}>
            Tạo yêu cầu thiết lập mới
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-3 md:flex">
          <TabsTrigger value="all">Tất cả yêu cầu</TabsTrigger>
          <TabsTrigger value="pending">Đang xử lý</TabsTrigger>
          <TabsTrigger value="new">Yêu cầu mới</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Danh sách yêu cầu thiết lập</CardTitle>
              <CardDescription>
                Tất cả yêu cầu thiết lập môi trường làm việc
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EnvironmentSetupList filter="all" />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pending" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Yêu cầu đang xử lý</CardTitle>
              <CardDescription>
                Các yêu cầu thiết lập môi trường đang trong quá trình xử lý
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EnvironmentSetupList filter="pending" />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="new" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Tạo yêu cầu thiết lập mới</CardTitle>
              <CardDescription>
                Tạo yêu cầu thiết lập môi trường làm việc cho nhân viên mới
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CreateEnvironmentSetupForm 
                onSuccess={() => {
                  toast({
                    title: "Đã tạo yêu cầu",
                    description: "Yêu cầu thiết lập môi trường làm việc đã được tạo thành công",
                  });
                  setActiveTab("all");
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnvironmentSetupPage;
