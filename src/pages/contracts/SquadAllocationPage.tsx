
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { 
  PlusCircle, 
  Search, 
  Filter, 
  Pencil, 
  Trash2, 
  ChevronDown,
  Users,
  UserRound,
  Calendar
} from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import AssignmentForm from '@/components/contracts/AssignmentForm';
import { Assignment, SquadRole } from '@/types/contracts';

const SquadAllocationPage = () => {
  const { assignments, deleteAssignment, squads, projects, user } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [squadFilter, setSquadFilter] = useState("all");
  const [projectFilter, setProjectFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [filteredAssignments, setFilteredAssignments] = useState<Assignment[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'ascending' | 'descending' } | null>(null);

  // Check if user is admin or supervisor
  const canManageAssignments = user && (user.role === 'admin' || user.role === 'supervisor');

  useEffect(() => {
    let filtered = [...assignments];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        assignment =>
          assignment.staffName.toLowerCase().includes(query) ||
          (assignment.squadName && assignment.squadName.toLowerCase().includes(query)) ||
          (assignment.projectName && assignment.projectName.toLowerCase().includes(query))
      );
    }

    // Apply squad filter
    if (squadFilter !== "all") {
      filtered = filtered.filter(assignment => assignment.squadId === squadFilter);
    }

    // Apply project filter
    if (projectFilter !== "all") {
      filtered = filtered.filter(assignment => assignment.projectId === projectFilter);
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(assignment => assignment.status === statusFilter);
    }

    // Apply sorting
    if (sortConfig) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    } else {
      // Default sort by startDate (newest first)
      filtered.sort((a, b) => 
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      );
    }

    setFilteredAssignments(filtered);
  }, [assignments, searchQuery, squadFilter, projectFilter, statusFilter, sortConfig]);

  const handleSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleDeleteAssignment = (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa phân công này không?")) {
      deleteAssignment(id);
    }
  };

  const handleEditAssignment = (id: string) => {
    setEditingAssignment(id);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingAssignment(null);
  };

  const getRoleLabel = (role: SquadRole) => {
    switch (role) {
      case "developer":
        return "Developer";
      case "designer":
        return "Designer";
      case "qa":
        return "QA Engineer";
      case "manager":
        return "Manager";
      case "consultant":
        return "Consultant";
      case "other":
        return "Khác";
      default:
        return role;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 border-green-400">Đang hoạt động</Badge>;
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-400">Hoàn thành</Badge>;
      case "upcoming":
        return <Badge className="bg-amber-100 text-amber-800 border-amber-400">Sắp bắt đầu</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // If user doesn't have rights to view this page
  if (!canManageAssignments) {
    return (
      <div className="container py-10">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Không có quyền truy cập</CardTitle>
            <CardDescription>
              Bạn không có quyền truy cập vào trang này. Vui lòng liên hệ quản trị viên nếu cần trợ giúp.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link to="/">Quay lại trang chủ</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Phân công nhóm/dự án</h1>
          <p className="text-muted-foreground mt-1">
            Quản lý phân công nhân sự cho các nhóm và dự án
          </p>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Thêm phân công mới
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {editingAssignment ? "Chỉnh sửa phân công" : "Tạo phân công mới"}
              </DialogTitle>
              <DialogDescription>
                {editingAssignment
                  ? "Cập nhật thông tin phân công nhân sự"
                  : "Nhập thông tin để phân công nhân sự cho nhóm/dự án"}
              </DialogDescription>
            </DialogHeader>
            <AssignmentForm 
              onSuccess={handleFormClose} 
              editMode={!!editingAssignment}
              assignmentId={editingAssignment || undefined}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative w-full md:w-1/3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm nhân viên, nhóm, dự án..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-full"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-2 md:w-2/3">
                <div className="w-full sm:w-1/3">
                  <Select value={squadFilter} onValueChange={setSquadFilter}>
                    <SelectTrigger className="w-full">
                      <Users className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Nhóm" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả nhóm</SelectItem>
                      {squads.map((squad) => (
                        <SelectItem key={squad.id} value={squad.id}>
                          {squad.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="w-full sm:w-1/3">
                  <Select value={projectFilter} onValueChange={setProjectFilter}>
                    <SelectTrigger className="w-full">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Dự án" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả dự án</SelectItem>
                      {projects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="w-full sm:w-1/3">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full">
                      <Calendar className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả trạng thái</SelectItem>
                      <SelectItem value="active">Đang hoạt động</SelectItem>
                      <SelectItem value="upcoming">Sắp bắt đầu</SelectItem>
                      <SelectItem value="completed">Hoàn thành</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead 
                      className="cursor-pointer"
                      onClick={() => handleSort('staffName')}
                    >
                      <div className="flex items-center">
                        Nhân viên
                        {sortConfig?.key === 'staffName' && (
                          <ChevronDown 
                            className={`ml-1 h-4 w-4 ${sortConfig.direction === 'descending' ? 'rotate-180' : ''}`} 
                          />
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer"
                      onClick={() => handleSort('role')}
                    >
                      <div className="flex items-center">
                        Vai trò
                        {sortConfig?.key === 'role' && (
                          <ChevronDown 
                            className={`ml-1 h-4 w-4 ${sortConfig.direction === 'descending' ? 'rotate-180' : ''}`} 
                          />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>Nhóm</TableHead>
                    <TableHead>Dự án</TableHead>
                    <TableHead 
                      className="cursor-pointer"
                      onClick={() => handleSort('startDate')}
                    >
                      <div className="flex items-center">
                        Thời gian
                        {sortConfig?.key === 'startDate' && (
                          <ChevronDown 
                            className={`ml-1 h-4 w-4 ${sortConfig.direction === 'descending' ? 'rotate-180' : ''}`} 
                          />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>Công suất</TableHead>
                    <TableHead 
                      className="cursor-pointer"
                      onClick={() => handleSort('status')}
                    >
                      <div className="flex items-center">
                        Trạng thái
                        {sortConfig?.key === 'status' && (
                          <ChevronDown 
                            className={`ml-1 h-4 w-4 ${sortConfig.direction === 'descending' ? 'rotate-180' : ''}`} 
                          />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAssignments.length > 0 ? (
                    filteredAssignments.map((assignment) => (
                      <TableRow key={assignment.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <UserRound className="h-4 w-4 mr-2 text-muted-foreground" />
                            {assignment.staffName}
                          </div>
                        </TableCell>
                        <TableCell>{getRoleLabel(assignment.role)}</TableCell>
                        <TableCell>{assignment.squadName || "—"}</TableCell>
                        <TableCell>{assignment.projectName || "—"}</TableCell>
                        <TableCell>
                          {format(new Date(assignment.startDate), "dd/MM/yyyy", { locale: vi })}
                          {assignment.endDate ? (
                            <span>
                              {" → "}
                              {format(new Date(assignment.endDate), "dd/MM/yyyy", { locale: vi })}
                            </span>
                          ) : (
                            " → Hiện tại"
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className={`h-2.5 rounded-full ${
                                assignment.utilization > 75
                                  ? "bg-green-500"
                                  : assignment.utilization > 30
                                  ? "bg-amber-500"
                                  : "bg-red-500"
                              }`}
                              style={{ width: `${assignment.utilization}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {assignment.utilization}%
                          </span>
                        </TableCell>
                        <TableCell>{getStatusBadge(assignment.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditAssignment(assignment.id)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleDeleteAssignment(assignment.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                        Không tìm thấy phân công nào phù hợp với bộ lọc
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SquadAllocationPage;
