
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3Icon, PieChartIcon, LineChartIcon, Calendar, ArrowUpIcon, ArrowDownIcon, TicketIcon } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TicketCategory, TicketStatus, Ticket } from "@/types";
import { getCategoryLabel, getStatusLabel } from "@/data/mockData";

const Analytics = () => {
  const { tickets } = useApp();

  // Calculate counts by category
  const categoryData = Object.values(
    tickets.reduce<Record<string, { name: string; value: number }>>(
      (acc, ticket) => {
        const category = ticket.category;
        const label = getCategoryLabel(category);
        
        if (!acc[category]) {
          acc[category] = {
            name: label,
            value: 0,
          };
        }
        
        acc[category].value += 1;
        return acc;
      },
      {}
    )
  );

  // Calculate counts by status
  const statusData = Object.values(
    tickets.reduce<Record<string, { name: string; value: number }>>(
      (acc, ticket) => {
        const status = ticket.status;
        const label = getStatusLabel(status);
        
        if (!acc[status]) {
          acc[status] = {
            name: label,
            value: 0,
          };
        }
        
        acc[status].value += 1;
        return acc;
      },
      {}
    )
  );

  // Count tickets created per day for the last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  }).reverse();

  const ticketsByDay = tickets.reduce<Record<string, number>>((acc, ticket) => {
    const date = new Date(ticket.createdAt).toISOString().split('T')[0];
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const activityData = last7Days.map(date => ({
    date: date,
    count: ticketsByDay[date] || 0,
  }));

  // Category colors
  const CATEGORY_COLORS = ["#8B5CF6", "#0EA5E9", "#F97316", "#10B981"];
  
  // Status colors
  const STATUS_COLORS = ["#FEC6A1", "#0EA5E9", "#10B981", "#EF4444"];

  // Metrics
  const totalTickets = tickets.length;
  const resolvedTickets = tickets.filter(t => t.status === "resolved" || t.status === "approved").length;
  const pendingTickets = tickets.filter(t => t.status === "pending").length;
  const highPriorityTickets = tickets.filter(t => t.priority === "high").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Phân tích dữ liệu</h1>
        <p className="text-muted-foreground">
          Theo dõi hiệu suất xử lý yêu cầu hỗ trợ qua thời gian
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tổng yêu cầu</CardTitle>
            <TicketIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTickets}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <ArrowUpIcon className="h-3 w-3 text-green-500 mr-1" />
              <span>12% so với tháng trước</span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Đã giải quyết</CardTitle>
            <TicketIcon className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resolvedTickets}</div>
            <p className="text-xs text-muted-foreground">
              {totalTickets > 0 
                ? `${Math.round((resolvedTickets / totalTickets) * 100)}% tổng số yêu cầu`
                : 'Chưa có dữ liệu'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Đang chờ xử lý</CardTitle>
            <TicketIcon className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingTickets}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <ArrowDownIcon className="h-3 w-3 text-green-500 mr-1" />
              <span>5% so với tuần trước</span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Ưu tiên cao</CardTitle>
            <TicketIcon className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{highPriorityTickets}</div>
            <p className="text-xs text-muted-foreground">
              {totalTickets > 0 
                ? `${Math.round((highPriorityTickets / totalTickets) * 100)}% tổng số yêu cầu`
                : 'Chưa có dữ liệu'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Phân loại yêu cầu</CardTitle>
                <CardDescription>Phân bổ yêu cầu hỗ trợ theo phân loại</CardDescription>
              </div>
              <PieChartIcon className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart width={400} height={300}>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, 'Số lượng']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Trạng thái yêu cầu</CardTitle>
                <CardDescription>Phân bổ yêu cầu hỗ trợ theo trạng thái</CardDescription>
              </div>
              <BarChart3Icon className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  width={500}
                  height={300}
                  data={statusData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [value, 'Số lượng']} />
                  <Legend />
                  <Bar dataKey="value" name="Số lượng" fill="#8B5CF6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Hoạt động trong 7 ngày qua</CardTitle>
              <CardDescription>Số lượng yêu cầu tạo mới theo ngày</CardDescription>
            </div>
            <LineChartIcon className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                width={500}
                height={300}
                data={activityData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip
                  formatter={(value) => [value, 'Yêu cầu']}
                  labelFormatter={(label) => `Ngày: ${label}`}
                />
                <Legend />
                <Bar dataKey="count" name="Số yêu cầu" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
