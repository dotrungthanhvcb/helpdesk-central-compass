
import React, { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { OvertimeRequest, LeaveRequest, WorkLogEntry, LeaveType } from "@/types";
import { format, isAfter, parseISO } from "date-fns";
import { 
  ClockIcon, 
  PlusIcon, 
  CalendarIcon, 
  BarChart3Icon, 
  FilterIcon,
  HomeIcon,
  FileTextIcon,
  CalendarCheckIcon,
  ListTodoIcon
} from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const TimesheetsPage = () => {
  const { overtimeRequests, leaveRequests, workLogs, user } = useApp();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("workLogs");
  const [viewMode, setViewMode] = useState("daily"); // daily, weekly, monthly
  
  // Filter requests relevant to the user
  const myOvertimeRequests = overtimeRequests.filter(request => request.userId === user?.id);
  const myLeaveRequests = leaveRequests.filter(request => request.userId === user?.id);
  const myWorkLogs = workLogs.filter(log => log.userId === user?.id);
  
  // For supervisors/admins - requests that need approval
  const pendingApprovalOvertimeRequests = user?.role === "supervisor" || user?.role === "admin" 
    ? overtimeRequests.filter(request => request.status === "pending") 
    : [];

  const pendingApprovalLeaveRequests = user?.role === "supervisor" || user?.role === "admin" 
    ? leaveRequests.filter(request => request.status === "pending") 
    : [];

  const handleApproveOvertimeRequest = (requestId: string) => {
    // Logic to handle approval via updateOvertimeRequest
    toast({
      title: "Yêu cầu đã được phê duyệt",
      description: "Yêu cầu OT đã được phê duyệt thành công"
    });
  };

  const handleRejectOvertimeRequest = (requestId: string) => {
    // Logic to handle rejection via updateOvertimeRequest
    toast({
      title: "Yêu cầu đã bị từ chối",
      description: "Yêu cầu OT đã bị từ chối"
    });
  };

  const handleApproveLeaveRequest = (requestId: string) => {
    // Logic to handle approval via updateLeaveRequest
    toast({
      title: "Yêu cầu nghỉ phép đã được phê duyệt",
      description: "Yêu cầu nghỉ phép đã được phê duyệt thành công"
    });
  };

  const handleRejectLeaveRequest = (requestId: string) => {
    // Logic to handle rejection via updateLeaveRequest
    toast({
      title: "Yêu cầu nghỉ phép đã bị từ chối",
      description: "Yêu cầu nghỉ phép đã bị từ chối"
    });
  };

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

  const getLeaveBadge = (type: LeaveType) => {
    switch (type) {
      case "paid":
        return <Badge className="bg-blue-500">Nghỉ phép có lương</Badge>;
      case "sick":
        return <Badge className="bg-red-500">Nghỉ ốm</Badge>;
      case "unpaid":
        return <Badge variant="outline">Nghỉ không lương</Badge>;
      case "wfh":
        return <Badge className="bg-green-500">Làm việc tại nhà</Badge>;
      default:
        return <Badge variant="secondary">Khác</Badge>;
    }
  };

  const formatDuration = (request: OvertimeRequest) => {
    return `${request.startTime} - ${request.endTime} (${request.totalHours} giờ)`;
  };

  const formatLeaveDuration = (request: LeaveRequest) => {
    return `${format(new Date(request.startDate), "dd/MM/yyyy")} - ${format(new Date(request.endDate), "dd/MM/yyyy")} (${request.totalDays} ngày)`;
  };

  const formatWorkLogDuration = (log: WorkLogEntry) => {
    return `${log.startTime} - ${log.endTime} (${log.hours} giờ)`;
  };

  const isPastDate = (dateString: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const date = parseISO(dateString);
    return isAfter(today, date);
  };

  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý thời gian</h1>
          <p className="text-muted-foreground">Xem và quản lý thời gian làm việc, yêu cầu OT và nghỉ phép</p>
        </div>
        <div className="flex gap-2">
          <Link to="/timesheets/worklog/new">
            <Button variant="outline">
              <ListTodoIcon className="mr-2 h-4 w-4" />
              Ghi nhận công việc
            </Button>
          </Link>
          <Link to="/timesheets/leave/new">
            <Button variant="outline">
              <CalendarCheckIcon className="mr-2 h-4 w-4" />
              Yêu cầu nghỉ phép
            </Button>
          </Link>
          <Link to="/timesheets/overtime/new">
            <Button>
              <PlusIcon className="mr-2 h-4 w-4" />
              Yêu cầu OT mới
            </Button>
          </Link>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Tổng quan thời gian làm việc</CardTitle>
          <CardDescription>
            Báo cáo tổng hợp thời gian làm việc, OT và nghỉ phép
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Card className="flex-1 min-w-[200px]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Số giờ làm việc</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">168 giờ</div>
                <p className="text-xs text-muted-foreground">Tháng này</p>
              </CardContent>
            </Card>
            <Card className="flex-1 min-w-[200px]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Số giờ OT</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12 giờ</div>
                <p className="text-xs text-muted-foreground">6 giờ cuối tuần</p>
              </CardContent>
            </Card>
            <Card className="flex-1 min-w-[200px]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Nghỉ phép</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2 ngày</div>
                <p className="text-xs text-muted-foreground">Còn lại: 10 ngày</p>
              </CardContent>
            </Card>
            <Card className="flex-1 min-w-[200px]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Tỷ lệ hoàn thành</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">92%</div>
                <p className="text-xs text-muted-foreground">Timesheet đầy đủ</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-4">
          <div className="flex justify-between w-full">
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <CalendarIcon className="mr-2 h-4 w-4" />
                Tuần này
              </Button>
              <Button variant="outline" size="sm">
                <CalendarIcon className="mr-2 h-4 w-4" />
                Tháng này
              </Button>
              <Button variant="outline" size="sm">
                <FilterIcon className="mr-2 h-4 w-4" />
                Lọc
              </Button>
            </div>
            <Button variant="outline" size="sm">
              <FileTextIcon className="mr-2 h-4 w-4" />
              Xuất báo cáo
            </Button>
          </div>
        </CardFooter>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="workLogs">Nhật ký làm việc</TabsTrigger>
          <TabsTrigger value="overtime">Yêu cầu OT {myOvertimeRequests.length > 0 && `(${myOvertimeRequests.length})`}</TabsTrigger>
          <TabsTrigger value="leave">Yêu cầu nghỉ phép {myLeaveRequests.length > 0 && `(${myLeaveRequests.length})`}</TabsTrigger>
          {(user?.role === "supervisor" || user?.role === "admin") && (
            <TabsTrigger value="approvals">Chờ phê duyệt {(pendingApprovalOvertimeRequests.length + pendingApprovalLeaveRequests.length) > 0 && `(${pendingApprovalOvertimeRequests.length + pendingApprovalLeaveRequests.length})`}</TabsTrigger>
          )}
        </TabsList>
        
        {/* Work Logs Tab */}
        <TabsContent value="workLogs">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Nhật ký làm việc</CardTitle>
                <CardDescription>
                  Quản lý thời gian làm việc hàng ngày
                </CardDescription>
              </div>
              <Link to="/timesheets/worklog/new">
                <Button>
                  <PlusIcon className="h-4 w-4 mr-1" /> Thêm ghi nhận
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {myWorkLogs.length > 0 ? (
                <div className="space-y-4">
                  {myWorkLogs.map((log) => (
                    <Card key={log.id} className="overflow-hidden">
                      <CardHeader className="pb-2 flex flex-row justify-between">
                        <div>
                          <CardTitle className="text-lg">{format(new Date(log.date), "dd/MM/yyyy")}</CardTitle>
                          <CardDescription>{formatWorkLogDuration(log)}</CardDescription>
                        </div>
                        {log.projectName && (
                          <Badge variant="outline">{log.projectName}</Badge>
                        )}
                      </CardHeader>
                      <CardContent>
                        {log.taskDescription && (
                          <p className="text-sm text-muted-foreground">{log.taskDescription}</p>
                        )}
                      </CardContent>
                      <CardFooter className="bg-muted py-2">
                        <div className="flex justify-between w-full">
                          <span className="text-xs text-muted-foreground">
                            Cập nhật: {format(new Date(log.updatedAt), "dd/MM/yyyy HH:mm")}
                          </span>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">Sửa</Button>
                            <Button variant="ghost" size="sm" className="text-red-500">Xóa</Button>
                          </div>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <ClockIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">Chưa có nhật ký làm việc</h3>
                  <p className="text-muted-foreground mt-2">
                    Thêm ghi nhận thời gian làm việc hàng ngày
                  </p>
                  <Link to="/timesheets/worklog/new" className="mt-4 inline-block">
                    <Button>
                      <PlusIcon className="mr-2 h-4 w-4" />
                      Thêm ghi nhận
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Overtime Requests Tab */}
        <TabsContent value="overtime">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Yêu cầu làm thêm giờ (OT)</CardTitle>
                <CardDescription>
                  Danh sách các yêu cầu OT
                </CardDescription>
              </div>
              <Link to="/timesheets/overtime/new">
                <Button>
                  <PlusIcon className="h-4 w-4 mr-1" /> Tạo yêu cầu OT
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
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
                      {request.status === 'pending' && !isPastDate(request.date) && (
                        <CardFooter className="border-t pt-3">
                          <Button variant="ghost" size="sm" className="text-red-500 mr-2">Hủy yêu cầu</Button>
                          <Button variant="outline" size="sm">Sửa</Button>
                        </CardFooter>
                      )}
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
                  <Link to="/timesheets/overtime/new" className="mt-4 inline-block">
                    <Button>
                      <PlusIcon className="mr-2 h-4 w-4" />
                      Tạo yêu cầu OT mới
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Leave Requests Tab */}
        <TabsContent value="leave">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Yêu cầu nghỉ phép</CardTitle>
                <CardDescription>
                  Danh sách các yêu cầu nghỉ phép
                </CardDescription>
              </div>
              <Link to="/timesheets/leave/new">
                <Button>
                  <PlusIcon className="h-4 w-4 mr-1" /> Tạo yêu cầu nghỉ phép
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {myLeaveRequests.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {myLeaveRequests.map((request) => (
                    <Card key={request.id}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-xl">{getLeaveBadge(request.type)}</CardTitle>
                            <CardDescription className="mt-2">{formatLeaveDuration(request)}</CardDescription>
                          </div>
                          {getStatusBadge(request.status)}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {request.reason && (
                            <div>
                              <p className="font-medium">Lý do:</p>
                              <p className="text-sm text-muted-foreground">{request.reason}</p>
                            </div>
                          )}
                          {request.approverNote && (
                            <div>
                              <p className="font-medium">Phản hồi từ người duyệt:</p>
                              <p className="text-sm text-muted-foreground">{request.approverNote}</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                      {request.status === 'pending' && !isPastDate(request.startDate) && (
                        <CardFooter className="border-t pt-3">
                          <Button variant="ghost" size="sm" className="text-red-500 mr-2">Hủy yêu cầu</Button>
                          <Button variant="outline" size="sm">Sửa</Button>
                        </CardFooter>
                      )}
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">Chưa có yêu cầu nghỉ phép</h3>
                  <p className="text-muted-foreground mt-2">
                    Tạo yêu cầu nghỉ phép mới khi cần thiết
                  </p>
                  <Link to="/timesheets/leave/new" className="mt-4 inline-block">
                    <Button>
                      <PlusIcon className="mr-2 h-4 w-4" />
                      Tạo yêu cầu nghỉ phép
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Admin/Supervisor Approval Tab */}
        {(user?.role === "supervisor" || user?.role === "admin") && (
          <TabsContent value="approvals">
            <Tabs defaultValue="overtimeApprovals">
              <TabsList className="mb-4">
                <TabsTrigger value="overtimeApprovals">Yêu cầu OT {pendingApprovalOvertimeRequests.length > 0 && `(${pendingApprovalOvertimeRequests.length})`}</TabsTrigger>
                <TabsTrigger value="leaveApprovals">Yêu cầu nghỉ phép {pendingApprovalLeaveRequests.length > 0 && `(${pendingApprovalLeaveRequests.length})`}</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overtimeApprovals">
                <Card>
                  <CardHeader>
                    <CardTitle>Yêu cầu OT chờ phê duyệt</CardTitle>
                    <CardDescription>
                      Danh sách các yêu cầu OT đang chờ phê duyệt
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {pendingApprovalOvertimeRequests.length > 0 ? (
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {pendingApprovalOvertimeRequests.map((request) => (
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
                                <Textarea 
                                  placeholder="Nhập ghi chú phản hồi (không bắt buộc)" 
                                  className="mb-3"
                                />
                                <div className="flex gap-2">
                                  <Button 
                                    variant="outline" 
                                    className="flex-1"
                                    onClick={() => handleRejectOvertimeRequest(request.id)}
                                  >
                                    Từ chối
                                  </Button>
                                  <Button 
                                    className="flex-1"
                                    onClick={() => handleApproveOvertimeRequest(request.id)}
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
                        <h3 className="text-lg font-medium">Không có yêu cầu OT chờ phê duyệt</h3>
                        <p className="text-muted-foreground mt-2">
                          Tất cả các yêu cầu làm thêm giờ đã được xử lý
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="leaveApprovals">
                <Card>
                  <CardHeader>
                    <CardTitle>Yêu cầu nghỉ phép chờ phê duyệt</CardTitle>
                    <CardDescription>
                      Danh sách các yêu cầu nghỉ phép đang chờ phê duyệt
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {pendingApprovalLeaveRequests.length > 0 ? (
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {pendingApprovalLeaveRequests.map((request) => (
                          <Card key={request.id}>
                            <CardHeader className="pb-2">
                              <div className="flex justify-between items-start">
                                <div>
                                  <CardTitle className="text-lg">{request.userName}</CardTitle>
                                  <CardDescription className="flex flex-col mt-1">
                                    <span>{getLeaveBadge(request.type)}</span>
                                    <span className="mt-2">{formatLeaveDuration(request)}</span>
                                  </CardDescription>
                                </div>
                                {getStatusBadge(request.status)}
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                {request.reason && (
                                  <div>
                                    <p className="font-medium">Lý do:</p>
                                    <p className="text-sm text-muted-foreground">{request.reason}</p>
                                  </div>
                                )}
                                <Textarea 
                                  placeholder="Nhập ghi chú phản hồi (không bắt buộc)" 
                                  className="mb-3"
                                />
                                <div className="flex gap-2">
                                  <Button 
                                    variant="outline" 
                                    className="flex-1"
                                    onClick={() => handleRejectLeaveRequest(request.id)}
                                  >
                                    Từ chối
                                  </Button>
                                  <Button 
                                    className="flex-1"
                                    onClick={() => handleApproveLeaveRequest(request.id)}
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
                        <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium">Không có yêu cầu nghỉ phép chờ phê duyệt</h3>
                        <p className="text-muted-foreground mt-2">
                          Tất cả các yêu cầu nghỉ phép đã được xử lý
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default TimesheetsPage;
