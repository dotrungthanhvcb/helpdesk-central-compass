
import React, { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { Bell, Globe, Moon, Sun } from "lucide-react";

const Settings = () => {
  const { user } = useApp();
  const [preferences, setPreferences] = useState({
    language: "vi",
    timezone: "Asia/Ho_Chi_Minh",
    theme: "light",
    notifications: {
      email: true,
      browser: true,
      ticketUpdates: true,
      systemAnnouncements: true,
      mentions: true,
    },
  });

  if (!user) {
    return <div>Loading...</div>;
  }

  const handleSaveSettings = () => {
    // In a real app, this would update the user preferences in the database
    toast({
      title: "Cài đặt đã lưu",
      description: "Các tùy chọn của bạn đã được cập nhật.",
    });
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Cài Đặt</h1>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="profile">Tùy Chọn Hồ Sơ</TabsTrigger>
          <TabsTrigger value="notifications">Thông Báo</TabsTrigger>
          <TabsTrigger value="system">Hệ Thống</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Tùy Chọn Hồ Sơ</CardTitle>
              <CardDescription>
                Cài đặt các tùy chọn cá nhân cho tài khoản của bạn.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-1">
                <Label htmlFor="goto-profile">Đến Trang Hồ Sơ</Label>
                <p className="text-sm text-muted-foreground">
                  Xem và chỉnh sửa thông tin cá nhân của bạn.
                </p>
                <Button id="goto-profile" variant="outline" className="mt-2" asChild>
                  <a href="/profile">Đến Trang Hồ Sơ</a>
                </Button>
              </div>

              <Separator />

              <div className="space-y-1">
                <Label htmlFor="password-change">Thay Đổi Mật Khẩu</Label>
                <p className="text-sm text-muted-foreground">
                  Cập nhật mật khẩu cho tài khoản của bạn.
                </p>
                <Button id="password-change" variant="outline" className="mt-2" asChild>
                  <a href="/profile?tab=password">Thay Đổi Mật Khẩu</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Thiết Lập Thông Báo</CardTitle>
              <CardDescription>
                Cấu hình cách bạn nhận thông báo từ hệ thống.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">Thông báo qua Email</Label>
                    <p className="text-sm text-muted-foreground">
                      Nhận thông báo qua địa chỉ email của bạn.
                    </p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={preferences.notifications.email}
                    onCheckedChange={(checked) =>
                      setPreferences({
                        ...preferences,
                        notifications: {
                          ...preferences.notifications,
                          email: checked,
                        },
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="browser-notifications">Thông báo trên trình duyệt</Label>
                    <p className="text-sm text-muted-foreground">
                      Hiển thị thông báo trên trình duyệt của bạn.
                    </p>
                  </div>
                  <Switch
                    id="browser-notifications"
                    checked={preferences.notifications.browser}
                    onCheckedChange={(checked) =>
                      setPreferences({
                        ...preferences,
                        notifications: {
                          ...preferences.notifications,
                          browser: checked,
                        },
                      })
                    }
                  />
                </div>

                <Separator />

                <h3 className="text-sm font-medium">Loại Thông Báo</h3>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="ticket-updates">Cập nhật ticket</Label>
                    <p className="text-sm text-muted-foreground">
                      Khi có cập nhật về ticket của bạn.
                    </p>
                  </div>
                  <Switch
                    id="ticket-updates"
                    checked={preferences.notifications.ticketUpdates}
                    onCheckedChange={(checked) =>
                      setPreferences({
                        ...preferences,
                        notifications: {
                          ...preferences.notifications,
                          ticketUpdates: checked,
                        },
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="system-announcements">Thông báo hệ thống</Label>
                    <p className="text-sm text-muted-foreground">
                      Các thông báo chung và bảo trì hệ thống.
                    </p>
                  </div>
                  <Switch
                    id="system-announcements"
                    checked={preferences.notifications.systemAnnouncements}
                    onCheckedChange={(checked) =>
                      setPreferences({
                        ...preferences,
                        notifications: {
                          ...preferences.notifications,
                          systemAnnouncements: checked,
                        },
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="mentions">Được nhắc đến (@mentions)</Label>
                    <p className="text-sm text-muted-foreground">
                      Khi bạn được nhắc đến trong bình luận.
                    </p>
                  </div>
                  <Switch
                    id="mentions"
                    checked={preferences.notifications.mentions}
                    onCheckedChange={(checked) =>
                      setPreferences({
                        ...preferences,
                        notifications: {
                          ...preferences.notifications,
                          mentions: checked,
                        },
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle>Tùy Chọn Hệ Thống</CardTitle>
              <CardDescription>
                Cấu hình giao diện và các tùy chọn hệ thống.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <Label htmlFor="language">Ngôn Ngữ</Label>
                </div>
                <Select
                  value={preferences.language}
                  onValueChange={(value) =>
                    setPreferences({ ...preferences, language: value })
                  }
                >
                  <SelectTrigger id="language" className="w-full">
                    <SelectValue placeholder="Chọn ngôn ngữ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vi">Tiếng Việt</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  <Label htmlFor="timezone">Múi Giờ</Label>
                </div>
                <Select
                  value={preferences.timezone}
                  onValueChange={(value) =>
                    setPreferences({ ...preferences, timezone: value })
                  }
                >
                  <SelectTrigger id="timezone" className="w-full">
                    <SelectValue placeholder="Chọn múi giờ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Asia/Ho_Chi_Minh">
                      (GMT+7) Hà Nội, Bangkok
                    </SelectItem>
                    <SelectItem value="Asia/Singapore">
                      (GMT+8) Singapore, Manila
                    </SelectItem>
                    <SelectItem value="Asia/Tokyo">
                      (GMT+9) Tokyo, Seoul
                    </SelectItem>
                    <SelectItem value="America/New_York">
                      (GMT-5) New York
                    </SelectItem>
                    <SelectItem value="Europe/London">
                      (GMT+0) London
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {preferences.theme === "light" ? (
                    <Sun className="h-4 w-4" />
                  ) : (
                    <Moon className="h-4 w-4" />
                  )}
                  <Label htmlFor="theme">Giao Diện</Label>
                </div>
                <Select
                  value={preferences.theme}
                  onValueChange={(value) =>
                    setPreferences({ ...preferences, theme: value })
                  }
                >
                  <SelectTrigger id="theme" className="w-full">
                    <SelectValue placeholder="Chọn giao diện" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Sáng</SelectItem>
                    <SelectItem value="dark">Tối</SelectItem>
                    <SelectItem value="system">Theo hệ thống</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end mt-6">
        <Button onClick={handleSaveSettings}>Lưu Cài Đặt</Button>
      </div>
    </div>
  );
};

export default Settings;
