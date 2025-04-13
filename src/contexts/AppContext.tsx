
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, Ticket, NotificationMessage } from "@/types";
import { currentUser, users as mockUsers, tickets as mockTickets, notifications as mockNotifications } from "@/data/mockData";
import { toast } from "@/hooks/use-toast";

interface AppContextType {
  user: User | null;
  users: User[];
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
  createUser: (userData: User) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [notifications, setNotifications] = useState<NotificationMessage[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Auto-login for demo purposes
    const autoLogin = async () => {
      setUser(currentUser);
      setUsers(mockUsers);
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
        setUsers(mockUsers);
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

  // User management functions
  const createUser = (userData: User) => {
    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}`,
      isActive: userData.isActive !== false,
      createdAt: new Date().toISOString(),
    };
    
    setUsers([...users, newUser]);
    
    toast({
      title: "Người dùng đã được tạo",
      description: `Tài khoản cho ${newUser.name} đã được tạo thành công`,
    });
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers(
      users.map(u => u.id === id ? { ...u, ...updates } : u)
    );
    
    // If updating the current user, also update the user state
    if (user && user.id === id) {
      setUser({ ...user, ...updates });
    }
    
    toast({
      title: "Thông tin người dùng đã cập nhật",
      description: "Thông tin người dùng đã được cập nhật thành công",
    });
  };

  const deleteUser = (id: string) => {
    // Prevent deleting the current user
    if (user && user.id === id) {
      toast({
        title: "Không thể xóa người dùng",
        description: "Không thể xóa tài khoản đang đăng nhập",
        variant: "destructive",
      });
      return;
    }
    
    setUsers(users.filter(u => u.id !== id));
    
    toast({
      title: "Người dùng đã xóa",
      description: "Tài khoản người dùng đã được xóa thành công",
    });
  };

  const value = {
    user,
    users,
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
    createUser,
    updateUser,
    deleteUser,
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
