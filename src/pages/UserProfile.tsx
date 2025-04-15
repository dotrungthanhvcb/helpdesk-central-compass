import React, { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { Ticket } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StatusBadge from "@/components/StatusBadge";

const UserProfile = () => {
  const { user, tickets, updateUser } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
    department: user?.department || "",
  });
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  if (!user) {
    return <div>Loading...</div>;
  }

  const assignedTickets = tickets.filter(ticket => ticket.assigneeId === user?.id);

  const handleProfileUpdate = () => {
    updateUser(user.id, {
      name: userProfile.name,
      department: userProfile.department,
    });
    setIsEditing(false);
    toast({
      title: "Hồ sơ đã cập nhật",
      description: "Thông tin hồ sơ của bạn đã được cập nhật thành công.",
    });
  };

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Mật khẩu không khớp",
        description: "Mật khẩu mới và xác nhận mật khẩu không khớp.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Mật khẩu đã thay đổi",
      description: "Mật khẩu của bạn đã được thay đổi thành công.",
    });

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Hồ Sơ Người Dùng</h1>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="profile">Thông Tin Cá Nhân</TabsTrigger>
          <TabsTrigger value="password">Thay Đổi Mật Khẩu</TabsTrigger>
          <TabsTrigger value="tickets">Ticket Của Tôi</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Thông Tin Cá Nhân</CardTitle>
              <CardDescription>
                Xem và cập nhật thông tin cá nhân của bạn.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center space-y-4 mb-6 sm:flex-row sm:space-y-0 sm:space-x-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="text-lg">{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-semibold">{user.name}</h2>
                  <p className="text-muted-foreground">{user.email}</p>
                  <p className="text-sm mt-1">
                    Vai trò: {user.role === "requester" ? "Người Yêu Cầu" : 
                              user.role === "agent" ? "Nhân Viên Hỗ Trợ" :
                              user.role === "approver" ? "Người Phê Duyệt" :
                              user.role === "supervisor" ? "Quản Lý" : "Quản Trị Viên"}
                  </p>
                  {user.department && (
                    <p className="text-sm">Phòng ban: {user.department}</p>
                  )}
                </div>
              </div>
              
              <Separator className="my-6" />
              
              {isEditing ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Họ Tên</Label>
                    <Input
                      id="name"
                      value={userProfile.name}
                      onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={userProfile.email} disabled />
                    <p className="text-sm text-muted-foreground">
                      Email không thể thay đổi.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Phòng Ban</Label>
                    <Input
                      id="department"
                      value={userProfile.department}
                      onChange={(e) => setUserProfile({ ...userProfile, department: e.target.value })}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Họ Tên</p>
                      <p className="text-sm">{user.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm">{user.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Phòng Ban</p>
                      <p className="text-sm">{user.department || "—"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Trạng Thái</p>
                      <p className="text-sm text-green-600">Hoạt động</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Hủy
                  </Button>
                  <Button onClick={handleProfileUpdate}>Lưu Thay Đổi</Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)}>Chỉnh Sửa</Button>
              )}
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Thay Đổi Mật Khẩu</CardTitle>
              <CardDescription>
                Cập nhật mật khẩu của bạn để bảo mật tài khoản.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Mật Khẩu Hiện Tại</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">Mật Khẩu Mới</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Xác Nhận Mật Khẩu</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handlePasswordChange} className="ml-auto">
                Đổi Mật Khẩu
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="tickets">
          <Card>
            <CardHeader>
              <CardTitle>Ticket Của Tôi</CardTitle>
              <CardDescription>
                Danh sách các ticket bạn đã yêu cầu hoặc được giao.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {assignedTickets.length > 0 ? (
                <div className="space-y-4">
                  {assignedTickets.map((ticket: Ticket) => (
                    <div key={ticket.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="flex items-center gap-2">
                          <StatusBadge status={ticket.status} />
                          <h3 className="font-medium">{ticket.title}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Tạo ngày {formatDate(ticket.createdAt)}
                        </p>
                      </div>
                      <Button variant="outline" asChild>
                        <a href={`/tickets/${ticket.id}`}>Xem Chi Tiết</a>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">Bạn chưa có ticket nào.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserProfile;
