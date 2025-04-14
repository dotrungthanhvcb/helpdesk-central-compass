
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CheckCircle2,
  AlertCircle,
  Clock,
  XCircle,
  FileText,
  Link as LinkIcon
} from "lucide-react";
import { EnvironmentSetup, SetupItem, SetupItemStatus, User, TicketStatus } from '@/types';
import { useApp } from "@/contexts/AppContext";

interface SetupChecklistViewProps {
  setup: EnvironmentSetup;
  canEdit: boolean;
}

const SetupChecklistView: React.FC<SetupChecklistViewProps> = ({ setup, canEdit }) => {
  const { toast } = useToast();
  const { updateEnvironmentSetup, tickets, user } = useApp();
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('software');
  const [newItemDescription, setNewItemDescription] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');
  
  // Group items by category
  const deviceItems = setup.items.filter(item => item.category === 'device');
  const mdmItems = setup.items.filter(item => item.category === 'mdm');
  const osItems = setup.items.filter(item => item.category === 'os');
  const softwareItems = setup.items.filter(item => item.category === 'software');
  const accountItems = setup.items.filter(item => item.category === 'account');
  
  // Filter items based on status for tab view
  const pendingItems = setup.items.filter(item => item.status === 'pending');
  const inProgressItems = setup.items.filter(item => item.status === 'in_progress');
  const completedItems = setup.items.filter(item => item.status === 'done');
  const blockedItems = setup.items.filter(item => item.status === 'blocked');
  
  // Update an item status
  const updateItemStatus = (itemId: string, status: SetupItemStatus) => {
    if (!canEdit) return;
    
    const updatedItems = setup.items.map(item => 
      item.id === itemId 
        ? { ...item, status, updatedAt: new Date().toISOString() }
        : item
    );
    
    // Check if all items are done
    const allDone = updatedItems.every(item => item.status === 'done');
    
    const updatedSetup: EnvironmentSetup = { 
      ...setup,
      items: updatedItems,
      status: allDone ? 'resolved' as TicketStatus : setup.status,
      completionDate: allDone ? new Date().toISOString() : setup.completionDate,
      updatedAt: new Date().toISOString()
    };
    
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
  
  // Add new checklist item
  const addNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newItemTitle.trim()) {
      toast({
        title: "Không thể thêm mục",
        description: "Vui lòng nhập tiêu đề cho mục checklist",
        variant: "destructive"
      });
      return;
    }
    
    const newItem: SetupItem = {
      id: `item-${Date.now()}`,
      title: newItemTitle,
      description: newItemDescription || undefined,
      category: newItemCategory as 'device' | 'mdm' | 'os' | 'software' | 'account',
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const updatedSetup: EnvironmentSetup = {
      ...setup,
      items: [...setup.items, newItem],
      updatedAt: new Date().toISOString()
    };
    
    updateEnvironmentSetup(updatedSetup);
    
    // Reset form
    setNewItemTitle('');
    setNewItemDescription('');
    
    toast({
      title: "Đã thêm mục mới",
      description: "Mục mới đã được thêm vào danh sách kiểm tra"
    });
  };
  
  // Delete checklist item
  const deleteItem = (itemId: string) => {
    if (!canEdit) return;
    
    const updatedItems = setup.items.filter(item => item.id !== itemId);
    
    const updatedSetup: EnvironmentSetup = {
      ...setup,
      items: updatedItems,
      updatedAt: new Date().toISOString()
    };
    
    updateEnvironmentSetup(updatedSetup);
    
    toast({
      title: "Đã xóa mục",
      description: "Mục đã được xóa khỏi danh sách kiểm tra"
    });
  };
  
  // Update item notes
  const updateItemNotes = (itemId: string, notes: string) => {
    if (!canEdit) return;
    
    const updatedItems = setup.items.map(item => 
      item.id === itemId 
        ? { ...item, notes, updatedAt: new Date().toISOString() }
        : item
    );
    
    const updatedSetup: EnvironmentSetup = {
      ...setup,
      items: updatedItems,
      updatedAt: new Date().toISOString()
    };
    
    updateEnvironmentSetup(updatedSetup);
    
    toast({
      title: "Đã cập nhật ghi chú",
      description: "Ghi chú đã được cập nhật thành công"
    });
  };
  
  const renderStatusIcon = (status: SetupItemStatus) => {
    switch(status) {
      case 'done':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'in_progress':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'blocked':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    }
  };
  
  const renderChecklistItem = (item: SetupItem) => (
    <div key={item.id} className="border rounded-md p-4 mb-4 hover:border-primary/50 transition-colors">
      <div className="flex items-start gap-2">
        <div className="mt-1">
          {renderStatusIcon(item.status)}
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
            <h4 className="font-medium">{item.title}</h4>
            <div className="flex items-center space-x-2">
              {item.ticketId && (
                <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                  <LinkIcon className="h-3 w-3 mr-1" />
                  Ticket #{item.ticketId.substring(0, 8)}
                </Button>
              )}
              <Badge variant={
                item.status === 'done' ? 'default' : 
                item.status === 'blocked' ? 'destructive' : 
                item.status === 'in_progress' ? 'secondary' : 'outline'
              }>
                {item.status === 'pending' ? 'Chờ xử lý' :
                 item.status === 'in_progress' ? 'Đang xử lý' :
                 item.status === 'done' ? 'Hoàn thành' : 'Bị chặn'}
              </Badge>
            </div>
          </div>
          
          {item.description && (
            <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
          )}
          
          {item.notes && (
            <div className="bg-muted p-2 rounded-md text-sm mb-3">
              <p className="font-medium text-xs mb-1">Ghi chú:</p>
              <p>{item.notes}</p>
            </div>
          )}
          
          {canEdit && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {item.status !== 'done' && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-7"
                  onClick={() => updateItemStatus(item.id, 'done')}
                >
                  <CheckCircle2 className="h-3 w-3 mr-1" /> Hoàn thành
                </Button>
              )}
              
              {item.status !== 'in_progress' && item.status !== 'done' && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-7"
                  onClick={() => updateItemStatus(item.id, 'in_progress')}
                >
                  <Clock className="h-3 w-3 mr-1" /> Đang xử lý
                </Button>
              )}
              
              {item.status !== 'blocked' && item.status !== 'done' && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-7 text-red-500"
                  onClick={() => updateItemStatus(item.id, 'blocked')}
                >
                  <XCircle className="h-3 w-3 mr-1" /> Bị chặn
                </Button>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                className="h-7 ml-auto text-red-500"
                onClick={() => deleteItem(item.id)}
              >
                Xóa
              </Button>
            </div>
          )}
          
          {canEdit && (
            <div className="mt-3">
              <Textarea 
                placeholder="Thêm ghi chú cho mục này..." 
                className="text-sm h-20"
                value={item.notes || ''}
                onChange={(e) => updateItemNotes(item.id, e.target.value)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
  
  return (
    <div className="space-y-6">
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">Tất cả ({setup.items.length})</TabsTrigger>
          <TabsTrigger value="pending">Chờ xử lý ({pendingItems.length})</TabsTrigger>
          <TabsTrigger value="in_progress">Đang xử lý ({inProgressItems.length})</TabsTrigger>
          <TabsTrigger value="done">Hoàn thành ({completedItems.length})</TabsTrigger>
          <TabsTrigger value="blocked">Bị chặn ({blockedItems.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          {setup.items.length > 0 ? (
            <>
              {deviceItems.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-3">Thiết bị</h3>
                  {deviceItems.map(renderChecklistItem)}
                </div>
              )}
              
              {mdmItems.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-3">MDM</h3>
                  {mdmItems.map(renderChecklistItem)}
                </div>
              )}
              
              {osItems.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-3">Hệ điều hành & VPN</h3>
                  {osItems.map(renderChecklistItem)}
                </div>
              )}
              
              {softwareItems.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-3">Phần mềm</h3>
                  {softwareItems.map(renderChecklistItem)}
                </div>
              )}
              
              {accountItems.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-3">Tài khoản & quyền truy cập</h3>
                  {accountItems.map(renderChecklistItem)}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Chưa có mục nào trong danh sách</h3>
              <p className="text-muted-foreground mt-2">
                Thêm các mục cần thiết lập cho môi trường làm việc
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="pending">
          {pendingItems.length > 0 ? (
            <div className="space-y-4">
              {pendingItems.map(renderChecklistItem)}
            </div>
          ) : (
            <div className="text-center py-12">
              <CheckCircle2 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Không có mục nào đang chờ xử lý</h3>
              <p className="text-muted-foreground mt-2">
                Tất cả các mục đã được xử lý
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="in_progress">
          {inProgressItems.length > 0 ? (
            <div className="space-y-4">
              {inProgressItems.map(renderChecklistItem)}
            </div>
          ) : (
            <div className="text-center py-12">
              <Clock className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Không có mục nào đang xử lý</h3>
              <p className="text-muted-foreground mt-2">
                Chưa có mục nào được bắt đầu xử lý
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="done">
          {completedItems.length > 0 ? (
            <div className="space-y-4">
              {completedItems.map(renderChecklistItem)}
            </div>
          ) : (
            <div className="text-center py-12">
              <CheckCircle2 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Chưa có mục nào đã hoàn thành</h3>
              <p className="text-muted-foreground mt-2">
                Khi mục nào đó hoàn thành, nó sẽ xuất hiện ở đây
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="blocked">
          {blockedItems.length > 0 ? (
            <div className="space-y-4">
              {blockedItems.map(renderChecklistItem)}
            </div>
          ) : (
            <div className="text-center py-12">
              <XCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Không có mục nào bị chặn</h3>
              <p className="text-muted-foreground mt-2">
                Không có vấn đề đang xảy ra trong quá trình thiết lập
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {canEdit && (
        <Card>
          <CardHeader>
            <CardTitle>Thêm mục mới</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={addNewItem} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-3">
                  <input
                    type="text"
                    placeholder="Tiêu đề mục mới..."
                    className="w-full p-2 border rounded-md"
                    value={newItemTitle}
                    onChange={(e) => setNewItemTitle(e.target.value)}
                    required
                  />
                </div>
                <Select value={newItemCategory} onValueChange={setNewItemCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="device">Thiết bị</SelectItem>
                    <SelectItem value="mdm">MDM</SelectItem>
                    <SelectItem value="os">Hệ điều hành & VPN</SelectItem>
                    <SelectItem value="software">Phần mềm</SelectItem>
                    <SelectItem value="account">Tài khoản & quyền truy cập</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Textarea
                placeholder="Mô tả chi tiết (không bắt buộc)..."
                value={newItemDescription}
                onChange={(e) => setNewItemDescription(e.target.value)}
              />
              <Button type="submit">Thêm mục</Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SetupChecklistView;
