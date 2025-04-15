import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InboxIcon, BellIcon, CheckIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useApp } from "@/contexts/AppContext";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

const Notifications = () => {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useApp();
  const navigate = useNavigate();

  const unreadNotifications = notifications.filter(n => !n.isRead);
  const readNotifications = notifications.filter(n => n.isRead);

  const handleNotificationClick = (id: string, ticketId?: string) => {
    markNotificationAsRead(id);
    if (ticketId) {
      navigate(`/tickets/${ticketId}`);
    }
  };

  useEffect(() => {
    // Mark all as read when leaving the page
    return () => {
      markAllNotificationsAsRead();
    };
  }, [markAllNotificationsAsRead]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Thông báo</h1>
          <p className="text-muted-foreground">
            Quản lý tất cả thông báo và cập nhật từ hệ thống
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={markAllNotificationsAsRead} 
          disabled={unreadNotifications.length === 0}
        >
          <CheckIcon className="mr-2 h-4 w-4" />
          Đánh dấu tất cả đã đọc
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BellIcon className="mr-2 h-5 w-5" />
            Thông báo chưa đọc
            {unreadNotifications.length > 0 && (
              <span className="ml-2 bg-app-purple text-white text-xs rounded-full h-5 px-2 flex items-center justify-center">
                {unreadNotifications.length}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {unreadNotifications.length > 0 ? (
            <div className="space-y-2">
              {unreadNotifications.map((notification) => (
                <div 
                  key={notification.id}
                  className="p-3 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors"
                  onClick={() => handleNotificationClick(notification.id, notification.ticketId)}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-medium">{notification.title || "Thông báo mới"}</h4>
                      <p className="text-sm text-gray-600">{notification.message}</p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true, locale: vi })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <InboxIcon className="mx-auto h-10 w-10 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Không có thông báo mới</h3>
              <p className="mt-1 text-sm text-gray-500">
                Bạn đã đọc tất cả các thông báo.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {readNotifications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Thông báo đã đọc</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {readNotifications.map((notification) => (
                <div 
                  key={notification.id}
                  className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => notification.ticketId && navigate(`/tickets/${notification.ticketId}`)}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">{notification.title || "Thông báo"}</h4>
                      <p className="text-sm text-gray-500">{notification.message}</p>
                    </div>
                    <span className="text-xs text-gray-400">
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true, locale: vi })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Notifications;
