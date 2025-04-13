
import React, { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { User, UserRole } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserPlus, UserCog, Search, RefreshCw } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const UserManagement = () => {
  const { user: currentUser, users, createUser, updateUser, deleteUser } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [newUser, setNewUser] = useState<Partial<User>>({
    name: "",
    email: "",
    role: "requester",
    department: "",
    isActive: true,
  });

  // Only admins can access this page
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Không có quyền truy cập</CardTitle>
            <CardDescription>
              Bạn không có quyền truy cập trang quản lý người dùng.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <a href="/">Quay về trang chủ</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.department?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateUser = () => {
    if (!newUser.name || !newUser.email || !newUser.role) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin người dùng",
        variant: "destructive",
      });
      return;
    }

    createUser(newUser as User);
    setOpen(false);
    setNewUser({
      name: "",
      email: "",
      role: "requester",
      department: "",
      isActive: true,
    });
  };

  const handleToggleUserStatus = (userId: string, isActive: boolean) => {
    updateUser(userId, { isActive: !isActive });
  };

  const formatRoleVietnamese = (role: UserRole) => {
    const roles: Record<UserRole, string> = {
      'requester': 'Người Yêu Cầu',
      'agent': 'Nhân Viên Hỗ Trợ',
      'approver': 'Người Phê Duyệt',
      'supervisor': 'Quản Lý',
      'admin': 'Quản Trị Viên'
    };
    return roles[role] || role;
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Quản Lý Người Dùng</h1>

      <div className="flex justify-between items-center mb-6">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm người dùng..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Thêm Người Dùng
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Thêm Người Dùng Mới</DialogTitle>
              <DialogDescription>
                Điền thông tin để tạo tài khoản người dùng mới.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Họ Tên
                </Label>
                <Input
                  id="name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                  Vai Trò
                </Label>
                <Select 
                  value={newUser.role} 
                  onValueChange={(value: UserRole) => setNewUser({ ...newUser, role: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Chọn vai trò" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="requester">Người Yêu Cầu</SelectItem>
                    <SelectItem value="agent">Nhân Viên Hỗ Trợ</SelectItem>
                    <SelectItem value="approver">Người Phê Duyệt</SelectItem>
                    <SelectItem value="supervisor">Quản Lý</SelectItem>
                    <SelectItem value="admin">Quản Trị Viên</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="department" className="text-right">
                  Phòng Ban
                </Label>
                <Input
                  id="department"
                  value={newUser.department}
                  onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Kích Hoạt
                </Label>
                <div className="flex items-center space-x-2 col-span-3">
                  <Switch 
                    id="status" 
                    checked={newUser.isActive}
                    onCheckedChange={(checked) => setNewUser({ ...newUser, isActive: checked })}
                  />
                  <Label htmlFor="status">
                    {newUser.isActive ? "Hoạt động" : "Vô hiệu hóa"}
                  </Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Hủy
              </Button>
              <Button onClick={handleCreateUser}>Tạo Người Dùng</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Người Dùng</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Vai Trò</TableHead>
                <TableHead>Phòng Ban</TableHead>
                <TableHead>Trạng Thái</TableHead>
                <TableHead className="text-right">Thao Tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {user.name}
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{formatRoleVietnamese(user.role)}</TableCell>
                  <TableCell>{user.department || "—"}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Switch 
                        checked={user.isActive} 
                        onCheckedChange={() => handleToggleUserStatus(user.id, !!user.isActive)}
                        disabled={user.id === currentUser.id}
                      />
                      <span className={user.isActive ? "text-green-600" : "text-red-600"}>
                        {user.isActive ? "Hoạt động" : "Vô hiệu hóa"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        // Handle edit user (in a real app this would open an edit dialog)
                        toast({
                          title: "Chỉnh sửa người dùng",
                          description: `Đang chỉnh sửa thông tin cho ${user.name}`,
                        });
                      }}
                    >
                      <UserCog className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
