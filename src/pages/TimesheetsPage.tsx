
import React from "react";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { OvertimeRequest } from "@/types";
import { format } from "date-fns";
import { ClockIcon, PlusIcon } from "lucide-react";
import { Link } from "react-router-dom";

const TimesheetsPage = () => {
  const { overtimeRequests, user } = useApp();
  
  // Filter overtime requests relevant to the user
  const myOvertimeRequests = overtimeRequests.filter(request => request.userId === user?.id);
  
  // For supervisors/admins - requests that need approval
  const pendingApprovalRequests = user?.role === "supervisor" || user?.role === "admin" 
    ? overtimeRequests.filter(request => request.status === "pending") 
    : [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500">Đã phê duyệt</Badge>;
      case "rejected":
        return <Badge variant="destructive">Từ chối</Badge>;
      case "in_progress":
        return <Badge className="bg-blue-500">Đang xử lý</Badge>;
      default:
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">Chờ phê duyệt</Badge>;
    }
  };

  const formatDuration = (request: OvertimeRequest) => {
    return `${request.startTime} - ${request.endTime} (${request.totalHours} giờ)`;
  };

  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý thời gian</h1>
          <p className="text-muted-foreground">Xem và quản lý thời gian làm việc và yêu cầu làm thêm giờ</p>
        </div>
        <Link to="/timesheets/overtime">
          <Button>
            <PlusIcon className="mr-2 h-4 w-4" />
            Tạo yêu cầu OT mới
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="my-requests" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="my-requests">Yêu cầu của tôi</TabsTrigger>
          {(user?.role === "supervisor" || user?.role === "admin") && (
            <TabsTrigger value="pending-approval">Chờ phê duyệt {pendingApprovalRequests.length > 0 && `(${pendingApprovalRequests.length})`}</TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="my-requests">
          {myOvertimeRequests.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {myOvertimeRequests.map((request) => (
                <Card key={request.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl">{format(new Date(request.date), "dd/MM/yyyy")}</CardTitle>
                      {getStatusBadge(request.status)}
                    </div>
                    <CardDescription>{formatDuration(request)}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div>
                        <p className="font-medium">Lý do:</p>
                        <p className="text-sm text-muted-foreground">{request.reason}</p>
                      </div>
                      {request.reviewerFeedback && (
                        <div>
                          <p className="font-medium">Phản hồi:</p>
                          <p className="text-sm text-muted-foreground">{request.reviewerFeedback}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <ClockIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Chưa có yêu cầu OT nào</h3>
              <p className="text-muted-foreground mt-2">
                Tạo yêu cầu làm thêm giờ mới để bắt đầu theo dõi thời gian của bạn
              </p>
              <Link to="/timesheets/overtime" className="mt-4 inline-block">
                <Button>
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Tạo yêu cầu OT mới
                </Button>
              </Link>
            </div>
          )}
        </TabsContent>
        
        {(user?.role === "supervisor" || user?.role === "admin") && (
          <TabsContent value="pending-approval">
            {pendingApprovalRequests.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {pendingApprovalRequests.map((request) => (
                  <Card key={request.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-xl">{format(new Date(request.date), "dd/MM/yyyy")}</CardTitle>
                        {getStatusBadge(request.status)}
                      </div>
                      <CardDescription>
                        <div className="flex flex-col gap-1">
                          <span>Người yêu cầu: {request.userName}</span>
                          <span>{formatDuration(request)}</span>
                        </div>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <p className="font-medium">Lý do:</p>
                          <p className="text-sm text-muted-foreground">{request.reason}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            className="flex-1"
                            onClick={() => {
                              // Logic to handle approval via updateOvertimeRequest
                            }}
                          >
                            Từ chối
                          </Button>
                          <Button 
                            className="flex-1"
                            onClick={() => {
                              // Logic to handle rejection via updateOvertimeRequest
                            }}
                          >
                            Phê duyệt
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <ClockIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">Không có yêu cầu chờ phê duyệt</h3>
                <p className="text-muted-foreground mt-2">
                  Tất cả các yêu cầu làm thêm giờ đã được xử lý
                </p>
              </div>
            )}
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default TimesheetsPage;
