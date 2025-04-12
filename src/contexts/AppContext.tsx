
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, Ticket, NotificationMessage } from "@/types";
import { currentUser, tickets as mockTickets, notifications as mockNotifications } from "@/data/mockData";
import { toast } from "@/hooks/use-toast";

interface AppContextType {
  user: User | null;
  tickets: Ticket[];
  notifications: NotificationMessage[];
  unreadNotificationsCount: number;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  createTicket: (ticket: Omit<Ticket, "id" | "createdAt" | "updatedAt" | "requester">) => void;
  updateTicket: (id: string, updates: Partial<Ticket>) => void;
  deleteTicket: (id: string) => void;
  addComment: (ticketId: string, content: string) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [notifications, setNotifications] = useState<NotificationMessage[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Auto-login for demo purposes
    const autoLogin = async () => {
      setUser(currentUser);
      setTickets(mockTickets);
      setNotifications(mockNotifications.filter(n => n.userId === currentUser.id));
      setIsAuthenticated(true);
    };
    autoLogin();
  }, []);

  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Mock login - in a real app, this would be an API call
      if (email && password) {
        setUser(currentUser);
        setTickets(mockTickets);
        setNotifications(mockNotifications.filter(n => n.userId === currentUser.id));
        setIsAuthenticated(true);
        toast({
          title: "Đăng nhập thành công",
          description: `Chào mừng, ${currentUser.name}!`,
        });
        return true;
      }
      return false;
    } catch (error) {
      toast({
        title: "Đăng nhập thất bại",
        description: "Email hoặc mật khẩu không đúng",
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    toast({
      title: "Đăng xuất thành công",
      description: "Hẹn gặp lại!",
    });
  };

  const createTicket = (ticketData: Omit<Ticket, "id" | "createdAt" | "updatedAt" | "requester">) => {
    if (!user) return;
    
    const newTicket: Ticket = {
      ...ticketData,
      id: `ticket-${Date.now()}`,
      requester: user,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setTickets([newTicket, ...tickets]);
    
    toast({
      title: "Ticket đã được tạo",
      description: `Ticket ${newTicket.title} đã được tạo thành công`,
    });
  };

  const updateTicket = (id: string, updates: Partial<Ticket>) => {
    setTickets(
      tickets.map(ticket => 
        ticket.id === id 
          ? { ...ticket, ...updates, updatedAt: new Date().toISOString() } 
          : ticket
      )
    );
    
    toast({
      title: "Ticket đã cập nhật",
      description: `Ticket đã được cập nhật thành công`,
    });
  };

  const deleteTicket = (id: string) => {
    setTickets(tickets.filter(ticket => ticket.id !== id));
    
    toast({
      title: "Ticket đã xóa",
      description: `Ticket đã được xóa thành công`,
    });
  };

  const addComment = (ticketId: string, content: string) => {
    if (!user) return;
    
    const newComment = {
      id: `comment-${Date.now()}`,
      ticketId,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      content,
      createdAt: new Date().toISOString(),
    };
    
    setTickets(
      tickets.map(ticket => 
        ticket.id === ticketId 
          ? {
              ...ticket,
              comments: [...(ticket.comments || []), newComment],
              updatedAt: new Date().toISOString(),
            }
          : ticket
      )
    );
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(
      notifications.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true } 
          : notification
      )
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(
      notifications.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const value = {
    user,
    tickets,
    notifications,
    unreadNotificationsCount,
    isAuthenticated,
    login,
    logout,
    createTicket,
    updateTicket,
    deleteTicket,
    addComment,
    markNotificationAsRead,
    markAllNotificationsAsRead,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
