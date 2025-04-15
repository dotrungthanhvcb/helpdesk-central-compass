
import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useApp } from '@/contexts/AppContext';
import ContractForm from '@/components/contracts/ContractForm';

const CreateContractPage = () => {
  const { user } = useApp();
  
  // Check if user is admin or supervisor
  const canManageContracts = user && (user.role === 'admin' || user.role === 'supervisor');

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
      <div className="flex items-center mb-6">
        <Link to="/contracts">
          <Button variant="outline" size="sm">
            <ChevronLeft className="h-4 w-4 mr-1" /> Quay lại
          </Button>
        </Link>
        <h1 className="text-3xl font-bold ml-4">Tạo hợp đồng mới</h1>
      </div>

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Thông tin hợp đồng</CardTitle>
          <CardDescription>Nhập thông tin chi tiết về hợp đồng mới</CardDescription>
        </CardHeader>
        <CardContent>
          <ContractForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateContractPage;
