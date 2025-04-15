
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  FileText, 
  Building, 
  Calendar, 
  ClipboardList,
  User,
  Clock,
  Pencil,
  AlertTriangle,
  Trash2
} from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import DocumentList from '@/components/contracts/DocumentList';
import DocumentUploader from '@/components/contracts/DocumentUploader';

const ContractDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { contracts, deleteContract, user } = useApp();
  const [contract, setContract] = useState(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [refresh, setRefresh] = useState(0);

  // Check if user is admin or supervisor
  const canManageContracts = user && (user.role === 'admin' || user.role === 'supervisor');

  useEffect(() => {
    // Find the contract with the matching ID
    const foundContract = contracts.find((c) => c.id === id);
    setContract(foundContract);
  }, [id, contracts, refresh]);

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

  // If contract not found
  if (!contract) {
    return (
      <div className="container py-10">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Không tìm thấy hợp đồng</CardTitle>
            <CardDescription>
              Hợp đồng bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link to="/contracts">Quay lại danh sách hợp đồng</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleDelete = () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa hợp đồng này không? Hành động này không thể hoàn tác.")) {
      deleteContract(contract.id);
      toast({
        title: "Xóa thành công",
        description: "Hợp đồng đã được xóa thành công",
      });
      navigate("/contracts");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-400";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-400";
      case "expired":
        return "bg-gray-100 text-gray-800 border-gray-400";
      case "terminated":
        return "bg-red-100 text-red-800 border-red-400";
      default:
        return "bg-gray-100 text-gray-800 border-gray-400";
    }
  };

  const getContractTypeLabel = (type) => {
    switch (type) {
      case "main":
        return "Hợp đồng chính";
      case "nda":
        return "NDA";
      case "compliance":
        return "Tuân thủ";
      case "other":
        return "Khác";
      default:
        return type;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "active":
        return "Đang hoạt động";
      case "pending":
        return "Chờ xử lý";
      case "expired":
        return "Hết hạn";
      case "terminated":
        return "Đã chấm dứt";
      default:
        return status;
    }
  };

  const isExpired = new Date(contract.expiryDate) < new Date();
  const isExpiringInThirtyDays =
    !isExpired &&
    new Date(contract.expiryDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  return (
    <div className="container py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button variant="outline" size="sm" asChild>
            <Link to="/contracts">
              <ArrowLeft className="h-4 w-4 mr-1" /> Quay lại
            </Link>
          </Button>
          <h1 className="text-3xl font-bold ml-4">Chi tiết hợp đồng</h1>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" asChild>
            <Link to="/contracts">
              <Pencil className="h-4 w-4 mr-1" /> Chỉnh sửa
            </Link>
          </Button>
          <Button variant="destructive" size="sm" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-1" /> Xóa
          </Button>
        </div>
      </div>

      {isExpired && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4 flex items-start">
          <AlertTriangle className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
          <div>
            <h3 className="font-medium text-red-800">Hợp đồng đã hết hạn</h3>
            <p className="text-red-700 text-sm mt-1">
              Hợp đồng này đã hết hạn vào ngày{" "}
              {format(new Date(contract.expiryDate), "dd/MM/yyyy", { locale: vi })}.
              Vui lòng cập nhật hoặc gia hạn hợp đồng nếu cần thiết.
            </p>
          </div>
        </div>
      )}

      {isExpiringInThirtyDays && (
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-md p-4 flex items-start">
          <AlertTriangle className="h-5 w-5 text-amber-500 mr-3 mt-0.5" />
          <div>
            <h3 className="font-medium text-amber-800">Hợp đồng sắp hết hạn</h3>
            <p className="text-amber-700 text-sm mt-1">
              Hợp đồng này sẽ hết hạn vào ngày{" "}
              {format(new Date(contract.expiryDate), "dd/MM/yyyy", { locale: vi })}.
              Vui lòng xem xét gia hạn hoặc cập nhật hợp đồng.
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin hợp đồng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Nhân viên</p>
                <p className="text-lg font-semibold">{contract.staffName}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Loại hợp đồng</p>
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                  <p>{getContractTypeLabel(contract.contractType)}</p>
                </div>
              </div>

              {contract.company && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Công ty</p>
                  <div className="flex items-center">
                    <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                    <p>{contract.company}</p>
                  </div>
                </div>
              )}

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Thời hạn</p>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <p>
                    {format(new Date(contract.effectiveDate), "dd/MM/yyyy", { locale: vi })} -{" "}
                    {format(new Date(contract.expiryDate), "dd/MM/yyyy", { locale: vi })}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Trạng thái</p>
                <Badge className={`${getStatusColor(contract.status)}`}>
                  {getStatusLabel(contract.status)}
                </Badge>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Người ký</p>
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-muted-foreground" />
                  <p>{contract.signedBy}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Ngày tạo</p>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  <p>{format(new Date(contract.createdAt), "dd/MM/yyyy", { locale: vi })}</p>
                </div>
              </div>

              {contract.notes && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Ghi chú</p>
                    <div className="flex">
                      <ClipboardList className="h-4 w-4 mr-2 text-muted-foreground flex-shrink-0 mt-1" />
                      <p className="text-sm">{contract.notes}</p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Tài liệu</CardTitle>
              <CardDescription>
                Quản lý các tài liệu đính kèm cho hợp đồng này
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs defaultValue="documents" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="documents">Danh sách tài liệu</TabsTrigger>
                  <TabsTrigger value="upload">Tải lên tài liệu</TabsTrigger>
                </TabsList>

                <TabsContent value="documents">
                  <DocumentList 
                    documents={contract.documents} 
                    onDelete={() => setRefresh(prev => prev + 1)}
                  />
                </TabsContent>

                <TabsContent value="upload">
                  <DocumentUploader 
                    contractId={contract.id} 
                    onUploadComplete={() => setRefresh(prev => prev + 1)}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ContractDetailPage;
