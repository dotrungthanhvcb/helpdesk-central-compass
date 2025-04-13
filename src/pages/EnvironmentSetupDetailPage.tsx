
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { 
  Card,
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import StatusBadge from "@/components/StatusBadge";
import {
  Laptop,
  Monitor,
  Server,
  Smartphone,
  MapPin,
  Globe,
  Clock,
  User,
  ChevronLeft,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowUpRight,
  FileText
} from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { EnvironmentSetup, DeviceType, SetupLocation, SetupItemStatus } from '@/types';

const EnvironmentSetupDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { environmentSetups, updateEnvironmentSetup, user } = useApp();
  const [feedbackText, setFeedbackText] = useState('');
  
  // Find the setup by id
  const setup = environmentSetups.find(setup => setup.id === id);
  
  if (!setup) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardHeader>
            <CardTitle>Không tìm thấy</CardTitle>
            <CardDescription>
              Không tìm thấy yêu cầu thiết lập với ID {id}
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => navigate('/environment-setup')}>
              <ChevronLeft className="h-4 w-4 mr-1" /> Quay lại
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const isAdmin = user?.role === 'admin';
  const isSupervisor = user?.role === 'supervisor';
  const isAgent = user?.role === 'agent';
  const canEdit = isAdmin || isSupervisor || isAgent;
  
  // Helper function to render the device type icon
  const getDeviceIcon = (type: DeviceType) => {
    switch (type) {
      case 'laptop':
        return <Laptop className="h-5 w-5" />;
      case 'pc':
        return <Monitor className="h-5 w-5" />;
      case 'vm':
        return <Server className="h-5 w-5" />;
      case 'byod':
        return <Smartphone className="h-5 w-5" />;
      default:
        return <Laptop className="h-5 w-5" />;
    }
  };
  
  // Helper function to render the location icon
  const getLocationIcon = (location: SetupLocation) => {
    switch (location) {
      case 'onsite':
        return <MapPin className="h-5 w-5" />;
      case 'remote':
        return <Globe className="h-5 w-5" />;
      default:
        return <MapPin className="h-5 w-5" />;
    }
  };
  
  // Helper function to calculate completion percentage
  const calculateProgress = (setup: EnvironmentSetup) => {
    if (!setup.items || setup.items.length === 0) return 0;
    
    const completedItems = setup.items.filter(item => item.status === 'done').length;
    return Math.round((completedItems / setup.items.length) * 100);
  };
  
  // Update an item's status
  const updateItemStatus = (itemId: string, status: SetupItemStatus) => {
    if (!canEdit) return;
    
    const updatedSetup = { 
      ...setup,
      items: setup.items.map(item => 
        item.id === itemId 
          ? { ...item, status, updatedAt: new Date().toISOString() }
          : item
      ),
      updatedAt: new Date().toISOString()
    };
    
    // Check if all items are done
    const allDone = updatedSetup.items.every(item => item.status === 'done');
    if (allDone) {
      updatedSetup.status = 'resolved';
      updatedSetup.completionDate = new Date().toISOString();
    }
    
    updateEnvironmentSetup(updatedSetup);
    toast({
      title: "Đã cập nhật",
      description: `Trạng thái của mục đã được cập nhật thành ${
        status === 'pending' ? 'Chờ xử lý' :
        status === 'in_progress' ? 'Đang xử lý' :
        status === 'done' ? 'Hoàn thành' : 'Bị chặn'
      }`,
    });
  };
  
  // Mark all items as completed
  const markAllCompleted = () => {
    if (!canEdit) return;
    
    const updatedSetup = { 
      ...setup,
      items: setup.items.map(item => ({ 
        ...item, 
        status: 'done', 
        updatedAt: new Date().toISOString(),
        completedAt: new Date().toISOString()
      })),
      status: 'resolved',
      completionDate: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    updateEnvironmentSetup(updatedSetup);
    toast({
      title: "Hoàn thành",
      description: "Tất cả các mục đã được đánh dấu là hoàn thành",
    });
  };
  
  // Verify the setup
  const verifySetup = () => {
    if (!isSupervisor && !isAdmin) return;
    
    const updatedSetup = { 
      ...setup,
      status: 'approved',
      verifiedById: user?.id,
      verifiedByName: user?.name,
      verificationNotes: feedbackText,
      updatedAt: new Date().toISOString()
    };
    
    updateEnvironmentSetup(updatedSetup);
    toast({
      title: "Đã xác minh",
      description: "Yêu cầu thiết lập đã được xác minh thành công",
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={() => navigate('/environment-setup')}>
          <ChevronLeft className="h-4 w-4 mr-1" /> Quay lại
        </Button>
        {canEdit && setup.status !== 'approved' && setup.status !== 'resolved' && (
          <Button onClick={markAllCompleted}>
            <CheckCircle2 className="h-4 w-4 mr-1" /> Đánh dấu tất cả đã hoàn thành
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{setup.employeeName}</CardTitle>
                  <CardDescription>Yêu cầu thiết lập môi trường</CardDescription>
                </div>
                <StatusBadge status={setup.status} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="flex items-center gap-2">
                  {getDeviceIcon(setup.deviceType)}
                  <div>
                    <p className="text-sm text-muted-foreground">Loại thiết bị</p>
                    <p className="font-medium">
                      {setup.deviceType === 'laptop' ? 'Laptop' : 
                       setup.deviceType === 'pc' ? 'PC' : 
                       setup.deviceType === 'vm' ? 'VM' : 'BYOD'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {getLocationIcon(setup.setupLocation)}
                  <div>
                    <p className="text-sm text-muted-foreground">Địa điểm thiết lập</p>
                    <p className="font-medium">
                      {setup.setupLocation === 'onsite' ? 'Tại văn phòng' : 'Từ xa'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Ngày yêu cầu</p>
                    <p className="font-medium">{setup.requestDate}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Người phụ trách</p>
                    <p className="font-medium">
                      {setup.responsibleName || "Chưa được phân công"}
                    </p>
                  </div>
                </div>
              </div>
              
              {setup.notes && (
                <div className="mb-6">
                  <p className="text-sm text-muted-foreground mb-1">Ghi chú</p>
                  <div className="p-3 bg-muted rounded-md">
                    <p>{setup.notes}</p>
                  </div>
                </div>
              )}
              
              <div className="mb-6">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Tiến độ thiết lập</span>
                  <span className="text-sm font-medium">{calculateProgress(setup)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-purple-600 h-2.5 rounded-full" 
                    style={{ width: `${calculateProgress(setup)}%` }}
                  ></div>
                </div>
              </div>
              
              {setup.verifiedByName && (
                <div className="p-4 bg-green-50 rounded-md mb-6">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-green-800">Đã xác minh bởi {setup.verifiedByName}</p>
                      {setup.verificationNotes && (
                        <p className="text-green-700 mt-1">{setup.verificationNotes}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Danh sách thiết lập</CardTitle>
              <CardDescription>
                Các mục cần thiết lập cho môi trường làm việc
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {setup.items.map((item) => (
                  <div key={item.id} className="p-4 border rounded-md">
                    <div className="flex flex-col sm:flex-row justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium mb-1 flex items-center gap-2">
                          {item.title}
                          <Badge 
                            variant={
                              item.status === 'done' ? 'default' : 
                              item.status === 'blocked' ? 'destructive' : 
                              item.status === 'in_progress' ? 'secondary' : 'outline'
                            }
                          >
                            {item.status === 'pending' ? 'Chờ xử lý' :
                             item.status === 'in_progress' ? 'Đang xử lý' :
                             item.status === 'done' ? 'Hoàn thành' : 'Bị chặn'}
                          </Badge>
                        </h4>
                        {item.description && (
                          <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                        )}
                        {item.notes && (
                          <div className="text-sm p-2 bg-muted rounded mb-2">
                            <p>{item.notes}</p>
                          </div>
                        )}
                      </div>
                      
                      {canEdit && setup.status !== 'approved' && (
                        <div className="mt-2 sm:mt-0 sm:ml-4 flex items-center gap-2">
                          <Select
                            defaultValue={item.status}
                            onValueChange={(value) => updateItemStatus(item.id, value as SetupItemStatus)}
                          >
                            <SelectTrigger className="w-[160px]">
                              <SelectValue placeholder="Chọn trạng thái" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Chờ xử lý</SelectItem>
                              <SelectItem value="in_progress">Đang xử lý</SelectItem>
                              <SelectItem value="done">Hoàn thành</SelectItem>
                              <SelectItem value="blocked">Bị chặn</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {(isSupervisor || isAdmin) && setup.status === 'resolved' && !setup.verifiedById && (
            <Card>
              <CardHeader>
                <CardTitle>Xác minh thiết lập</CardTitle>
                <CardDescription>
                  Xác nhận rằng môi trường làm việc đã được thiết lập đầy đủ
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Nhập phản hồi hoặc ghi chú xác minh (không bắt buộc)"
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  className="mb-4"
                />
                <Button onClick={verifySetup}>
                  <CheckCircle2 className="h-4 w-4 mr-1" /> Xác minh thiết lập
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Ngày tạo</p>
                <p>{new Date(setup.createdAt).toLocaleDateString('vi-VN')}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Cập nhật lần cuối</p>
                <p>{new Date(setup.updatedAt).toLocaleDateString('vi-VN')}</p>
              </div>
              
              {setup.completionDate && (
                <div>
                  <p className="text-sm text-muted-foreground">Ngày hoàn thành</p>
                  <p>{new Date(setup.completionDate).toLocaleDateString('vi-VN')}</p>
                </div>
              )}
              
              <Separator />
              
              <div>
                <h4 className="font-medium mb-2">Tài liệu liên quan</h4>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href="#" target="_blank" rel="noreferrer">
                      <FileText className="h-4 w-4 mr-2" />
                      Hướng dẫn thiết lập môi trường
                      <ArrowUpRight className="h-3 w-3 ml-auto" />
                    </a>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href="#" target="_blank" rel="noreferrer">
                      <FileText className="h-4 w-4 mr-2" />
                      Danh sách phần mềm chuẩn
                      <ArrowUpRight className="h-3 w-3 ml-auto" />
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Hướng dẫn</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                <p className="text-sm">Mỗi mục thiết lập cần được kiểm tra kỹ lưỡng trước khi đánh dấu hoàn thành.</p>
              </div>
              
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
                <p className="text-sm">Nếu gặp vấn đề không thể giải quyết, cập nhật trạng thái mục thành "Bị chặn" và ghi rõ lý do trong ghi chú.</p>
              </div>
              
              <div className="flex items-start gap-2">
                <XCircle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
                <p className="text-sm">Chỉ quản lý và admin mới có thể xác minh rằng thiết lập đã hoàn thành.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EnvironmentSetupDetailPage;
