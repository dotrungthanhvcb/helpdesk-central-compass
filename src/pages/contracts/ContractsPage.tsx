
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import ContractCard from "@/components/contracts/ContractCard";
import { PlusCircle, Search, FileText, Calendar, Filter } from "lucide-react";
import { Contract, ContractStatus } from "@/types/contracts";

const ContractsPage = () => {
  const { contracts, user } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [filteredContracts, setFilteredContracts] = useState<Contract[]>(contracts);
  const [view, setView] = useState<"grid" | "list">("grid");

  // Check if user is admin or supervisor
  const canManageContracts = user && (user.role === 'admin' || user.role === 'supervisor');

  useEffect(() => {
    let filtered = [...contracts];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        contract =>
          contract.staffName.toLowerCase().includes(query) ||
          (contract.company && contract.company.toLowerCase().includes(query))
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(contract => contract.status === statusFilter);
    }

    // Apply type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter(contract => contract.contractType === typeFilter);
    }

    // Apply date filter
    const now = new Date();
    if (dateFilter === "active") {
      filtered = filtered.filter(
        contract =>
          new Date(contract.effectiveDate) <= now &&
          new Date(contract.expiryDate) >= now
      );
    } else if (dateFilter === "expired") {
      filtered = filtered.filter(contract => new Date(contract.expiryDate) < now);
    } else if (dateFilter === "expiring-soon") {
      const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(
        contract =>
          new Date(contract.expiryDate) > now &&
          new Date(contract.expiryDate) <= thirtyDaysFromNow
      );
    }

    // Sort by created date (newest first)
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    setFilteredContracts(filtered);
  }, [contracts, searchQuery, statusFilter, typeFilter, dateFilter]);

  // If user doesn't have rights to view this page
  if (!canManageContracts) {
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
          <h1 className="text-3xl font-bold">Quản lý hợp đồng</h1>
          <p className="text-muted-foreground mt-1">
            Quản lý hợp đồng và tài liệu của nhân sự outsource
          </p>
        </div>
        <Button asChild>
          <Link to="/contracts/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Tạo hợp đồng mới
          </Link>
        </Button>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Tìm kiếm theo tên hoặc công ty..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 w-full"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-2 md:w-auto">
                  <div className="flex gap-2">
                    <div className="w-full sm:w-[180px]">
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-full">
                          <Filter className="h-4 w-4 mr-2" />
                          <SelectValue placeholder="Trạng thái" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tất cả trạng thái</SelectItem>
                          <SelectItem value="active">Đang hoạt động</SelectItem>
                          <SelectItem value="pending">Chờ xử lý</SelectItem>
                          <SelectItem value="expired">Hết hạn</SelectItem>
                          <SelectItem value="terminated">Đã chấm dứt</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="w-full sm:w-[180px]">
                      <Select value={typeFilter} onValueChange={setTypeFilter}>
                        <SelectTrigger className="w-full">
                          <FileText className="h-4 w-4 mr-2" />
                          <SelectValue placeholder="Loại hợp đồng" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tất cả loại</SelectItem>
                          <SelectItem value="main">Hợp đồng chính</SelectItem>
                          <SelectItem value="nda">NDA</SelectItem>
                          <SelectItem value="compliance">Tuân thủ</SelectItem>
                          <SelectItem value="other">Khác</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="w-full sm:w-[180px]">
                    <Select value={dateFilter} onValueChange={setDateFilter}>
                      <SelectTrigger className="w-full">
                        <Calendar className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Thời hạn" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả thời hạn</SelectItem>
                        <SelectItem value="active">Đang có hiệu lực</SelectItem>
                        <SelectItem value="expired">Đã hết hạn</SelectItem>
                        <SelectItem value="expiring-soon">Sắp hết hạn</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Tabs defaultValue="grid" className="w-full" onValueChange={(value) => setView(value as "grid" | "list")}>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Hiển thị {filteredContracts.length} hợp đồng
                  </div>
                  <TabsList>
                    <TabsTrigger value="grid">Lưới</TabsTrigger>
                    <TabsTrigger value="list">Danh sách</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="grid" className="mt-6">
                  {filteredContracts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredContracts.map((contract) => (
                        <ContractCard key={contract.id} contract={contract} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 text-muted-foreground">
                      Không tìm thấy hợp đồng nào phù hợp với bộ lọc
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="list" className="mt-6">
                  {filteredContracts.length > 0 ? (
                    <div className="rounded-md border">
                      <table className="w-full caption-bottom text-sm">
                        <thead className="border-b">
                          <tr className="border-b transition-colors hover:bg-muted/10">
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                              Tên nhân viên
                            </th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                              Loại hợp đồng
                            </th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                              Công ty
                            </th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                              Thời hạn
                            </th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                              Trạng thái
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredContracts.map((contract) => (
                            <tr
                              key={contract.id}
                              className="border-b transition-colors hover:bg-muted/30 cursor-pointer"
                              onClick={() => window.location.href = `/contracts/${contract.id}`}
                            >
                              <td className="p-4 align-middle font-medium">
                                {contract.staffName}
                              </td>
                              <td className="p-4 align-middle">
                                {contract.contractType === "main"
                                  ? "Hợp đồng chính"
                                  : contract.contractType === "nda"
                                  ? "NDA"
                                  : contract.contractType === "compliance"
                                  ? "Tuân thủ"
                                  : "Khác"}
                              </td>
                              <td className="p-4 align-middle">
                                {contract.company || "—"}
                              </td>
                              <td className="p-4 align-middle">
                                {new Date(contract.effectiveDate).toLocaleDateString("vi-VN")} -{" "}
                                {new Date(contract.expiryDate).toLocaleDateString("vi-VN")}
                              </td>
                              <td className="p-4 align-middle">
                                <div className="flex items-center">
                                  <div
                                    className={`h-2 w-2 rounded-full mr-2 ${
                                      contract.status === "active"
                                        ? "bg-green-500"
                                        : contract.status === "pending"
                                        ? "bg-yellow-500"
                                        : contract.status === "expired"
                                        ? "bg-gray-500"
                                        : "bg-red-500"
                                    }`}
                                  />
                                  {contract.status === "active"
                                    ? "Đang hoạt động"
                                    : contract.status === "pending"
                                    ? "Chờ xử lý"
                                    : contract.status === "expired"
                                    ? "Hết hạn"
                                    : "Đã chấm dứt"}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-10 text-muted-foreground">
                      Không tìm thấy hợp đồng nào phù hợp với bộ lọc
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContractsPage;
