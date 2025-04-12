
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TicketIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  ClockIcon,
  BarChart3Icon,
  FilterIcon,
  UsersIcon,
  InboxIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApp } from "@/contexts/AppContext";
import TicketCard from "@/components/TicketCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TicketCategory, TicketStatus } from "@/types";

const Dashboard = () => {
  const { user, tickets } = useApp();
  const [categoryFilter, setCategoryFilter] = useState<TicketCategory | "all">("all");
  const navigate = useNavigate();

  const pendingTickets = tickets.filter((ticket) => ticket.status === "pending");
  const inProgressTickets = tickets.filter((ticket) => ticket.status === "in_progress");
  const resolvedTickets = tickets.filter((ticket) => ticket.status === "resolved" || ticket.status === "approved");
  
  const filteredTickets = categoryFilter === "all" 
    ? tickets 
    : tickets.filter((ticket) => ticket.category === categoryFilter);

  const myTickets = tickets.filter(ticket => 
    ticket.requester.id === user?.id || ticket.assignedTo?.id === user?.id
  );

  const statusCounts = {
    pending: pendingTickets.length,
    inProgress: inProgressTickets.length,
    resolved: resolvedTickets.length,
    total: tickets.length
  };

  const handleCreateTicket = () => {
    navigate("/tickets/new");
  };

  const handleTicketClick = (id: string) => {
    navigate(`/tickets/${id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Bảng điều khiển</h1>
          <p className="text-muted-foreground">
            Xin chào, {user?.name}. Đây là tổng quan các yêu cầu hỗ trợ của bạn.
          </p>
        </div>
        <Button onClick={handleCreateTicket} className="bg-app-purple hover:bg-app-purple-dark">
          <TicketIcon className="mr-2 h-4 w-4" />
          Tạo yêu cầu
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tổng yêu cầu</CardTitle>
            <TicketIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.total}</div>
            <p className="text-xs text-muted-foreground">
              {tickets.length > 0 ? '+12.5% từ tháng trước' : 'Chưa có dữ liệu'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Đang chờ xử lý</CardTitle>
            <ClockIcon className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.pending}</div>
            <p className="text-xs text-muted-foreground">
              {pendingTickets.length > 0 ? `${Math.round((pendingTickets.length / tickets.length) * 100)}% of total` : 'Chưa có dữ liệu'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Đang xử lý</CardTitle>
            <InboxIcon className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.inProgress}</div>
            <p className="text-xs text-muted-foreground">
              {inProgressTickets.length > 0 ? `${Math.round((inProgressTickets.length / tickets.length) * 100)}% of total` : 'Chưa có dữ liệu'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Đã giải quyết</CardTitle>
            <CheckCircleIcon className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.resolved}</div>
            <p className="text-xs text-muted-foreground">
              {resolvedTickets.length > 0 ? `${Math.round((resolvedTickets.length / tickets.length) * 100)}% of total` : 'Chưa có dữ liệu'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Yêu cầu hỗ trợ</h2>
          <div className="flex items-center gap-2">
            <Select 
              defaultValue="all" 
              onValueChange={(value) => setCategoryFilter(value as TicketCategory | "all")}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Lọc theo phân loại" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả phân loại</SelectItem>
                <SelectItem value="tech_setup">Technical Setup</SelectItem>
                <SelectItem value="dev_issues">Development Issues</SelectItem>
                <SelectItem value="mentoring">Mentoring</SelectItem>
                <SelectItem value="hr_matters">HR Matters</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <FilterIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">Tất cả</TabsTrigger>
            <TabsTrigger value="my-tickets">Yêu cầu của tôi</TabsTrigger>
            <TabsTrigger value="pending">Chờ xử lý</TabsTrigger>
            <TabsTrigger value="in-progress">Đang xử lý</TabsTrigger>
            <TabsTrigger value="resolved">Đã giải quyết</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            {filteredTickets.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {filteredTickets.map((ticket) => (
                  <TicketCard
                    key={ticket.id}
                    ticket={ticket}
                    onClick={() => handleTicketClick(ticket.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <TicketIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-semibold text-gray-900">Không tìm thấy yêu cầu</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Không có yêu cầu nào phù hợp với tiêu chí tìm kiếm
                </p>
                <div className="mt-6">
                  <Button onClick={handleCreateTicket}>
                    Tạo yêu cầu mới
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="my-tickets" className="space-y-4">
            {myTickets.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {myTickets.map((ticket) => (
                  <TicketCard
                    key={ticket.id}
                    ticket={ticket}
                    onClick={() => handleTicketClick(ticket.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <TicketIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-semibold text-gray-900">Không có yêu cầu nào của bạn</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Bắt đầu bằng cách tạo yêu cầu hỗ trợ mới
                </p>
                <div className="mt-6">
                  <Button onClick={handleCreateTicket}>
                    Tạo yêu cầu mới
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            {pendingTickets.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {pendingTickets.map((ticket) => (
                  <TicketCard
                    key={ticket.id}
                    ticket={ticket}
                    onClick={() => handleTicketClick(ticket.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <ClockIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-semibold text-gray-900">Không có yêu cầu đang chờ xử lý</h3>
              </div>
            )}
          </TabsContent>

          <TabsContent value="in-progress" className="space-y-4">
            {inProgressTickets.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {inProgressTickets.map((ticket) => (
                  <TicketCard
                    key={ticket.id}
                    ticket={ticket}
                    onClick={() => handleTicketClick(ticket.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <InboxIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-semibold text-gray-900">Không có yêu cầu đang xử lý</h3>
              </div>
            )}
          </TabsContent>

          <TabsContent value="resolved" className="space-y-4">
            {resolvedTickets.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {resolvedTickets.map((ticket) => (
                  <TicketCard
                    key={ticket.id}
                    ticket={ticket}
                    onClick={() => handleTicketClick(ticket.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <CheckCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-semibold text-gray-900">Không có yêu cầu đã giải quyết</h3>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
