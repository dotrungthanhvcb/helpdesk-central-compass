import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, Ticket, NotificationMessage, OvertimeRequest, OutsourceReview, EnvironmentSetup, WorkLogEntry, LeaveRequest, TimesheetSummary } from "@/types";
import { currentUser, users as mockUsers, tickets as mockTickets, notifications as mockNotifications } from "@/data/mockData";
import { toast } from "@/hooks/use-toast";

interface AppContextType {
  user: User | null;
  users: User[];
  tickets: Ticket[];
  notifications: NotificationMessage[];
  overtimeRequests: OvertimeRequest[];
  workLogs: WorkLogEntry[];
  leaveRequests: LeaveRequest[];
  timesheetSummaries: TimesheetSummary[];
  reviews: OutsourceReview[];
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
  createOvertimeRequest: (request: Omit<OvertimeRequest, "id" | "createdAt" | "updatedAt" | "status" | "userId" | "userName">) => void;
  updateOvertimeRequest: (id: string, updates: Partial<OvertimeRequest>) => void;
  deleteOvertimeRequest: (id: string) => void;
  createWorkLog: (workLog: Omit<WorkLogEntry, "id" | "createdAt" | "updatedAt" | "userId">) => void;
  updateWorkLog: (id: string, updates: Partial<WorkLogEntry>) => void;
  deleteWorkLog: (id: string) => void;
  createLeaveRequest: (request: Omit<LeaveRequest, "id" | "createdAt" | "updatedAt" | "status" | "userId" | "userName">) => void;
  updateLeaveRequest: (id: string, updates: Partial<LeaveRequest>) => void;
  deleteLeaveRequest: (id: string) => void;
  getTimesheetSummary: (userId: string, period: string, startDate: string, endDate: string) => TimesheetSummary | null;
  createReview: (review: Omit<OutsourceReview, "id" | "createdAt" | "updatedAt" | "reviewerId" | "reviewerName">) => void;
  updateReview: (id: string, updates: Partial<OutsourceReview>) => void;
  deleteReview: (id: string) => void;
  environmentSetups: EnvironmentSetup[];
  createEnvironmentSetup: (setup: Omit<EnvironmentSetup, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateEnvironmentSetup: (setup: EnvironmentSetup) => void;
  deleteEnvironmentSetup: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [notifications, setNotifications] = useState<NotificationMessage[]>([]);
  const [overtimeRequests, setOvertimeRequests] = useState<OvertimeRequest[]>([]);
  const [workLogs, setWorkLogs] = useState<WorkLogEntry[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [timesheetSummaries, setTimesheetSummaries] = useState<TimesheetSummary[]>([]);
  const [reviews, setReviews] = useState<OutsourceReview[]>([]);
  const [environmentSetups, setEnvironmentSetups] = useState<EnvironmentSetup[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Auto-login for demo purposes
    const autoLogin = async () => {
      setUser(currentUser);
      setUsers(mockUsers);
      setTickets(mockTickets);
      setNotifications(mockNotifications.filter(n => n.userId === currentUser.id));
      setOvertimeRequests([]);
      setWorkLogs([]);
      setLeaveRequests([]);
      setTimesheetSummaries([]);
      setReviews([]);
      setEnvironmentSetups([]);
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
        setEnvironmentSetups([]);
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
    
    if (user && user.id === id) {
      setUser({ ...user, ...updates });
    }
    
    toast({
      title: "Thông tin người dùng đã cập nhật",
      description: "Thông tin người dùng đã được cập nhật thành công",
    });
  };

  const deleteUser = (id: string) => {
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

  const createOvertimeRequest = (requestData: Omit<OvertimeRequest, "id" | "createdAt" | "updatedAt" | "status" | "userId" | "userName">) => {
    if (!user) return;
    
    const newRequest: OvertimeRequest = {
      ...requestData,
      id: `ot-${Date.now()}`,
      userId: user.id,
      userName: user.name,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setOvertimeRequests([newRequest, ...overtimeRequests]);
    
    toast({
      title: "Yêu cầu OT đã được tạo",
      description: `Yêu cầu làm thêm giờ đã được gửi và đang chờ phê duyệt`,
    });
  };

  const updateOvertimeRequest = (id: string, updates: Partial<OvertimeRequest>) => {
    setOvertimeRequests(
      overtimeRequests.map(request => 
        request.id === id 
          ? { ...request, ...updates, updatedAt: new Date().toISOString() } 
          : request
      )
    );
    
    toast({
      title: "Yêu cầu OT đã cập nhật",
      description: `Yêu cầu làm thêm giờ đã được cập nhật thành công`,
    });
  };

  const deleteOvertimeRequest = (id: string) => {
    setOvertimeRequests(overtimeRequests.filter(request => request.id !== id));
    
    toast({
      title: "Yêu cầu OT đã xóa",
      description: `Yêu cầu làm thêm giờ đã được xóa thành công`,
    });
  };

  const createWorkLog = (workLogData: Omit<WorkLogEntry, "id" | "createdAt" | "updatedAt" | "userId">) => {
    if (!user) return;
    
    const newWorkLog: WorkLogEntry = {
      ...workLogData,
      id: `wl-${Date.now()}`,
      userId: user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setWorkLogs([newWorkLog, ...workLogs]);
    
    toast({
      title: "Đã ghi nhận thời gian làm việc",
      description: `Thời gian làm việc đã được ghi nhận thành công`,
    });
  };

  const updateWorkLog = (id: string, updates: Partial<WorkLogEntry>) => {
    setWorkLogs(
      workLogs.map(log => 
        log.id === id 
          ? { ...log, ...updates, updatedAt: new Date().toISOString() } 
          : log
      )
    );
    
    toast({
      title: "Đã cập nhật thời gian làm việc",
      description: `Thông tin thời gian làm việc đã được cập nhật thành công`,
    });
  };

  const deleteWorkLog = (id: string) => {
    setWorkLogs(workLogs.filter(log => log.id !== id));
    
    toast({
      title: "Đã xóa thời gian làm việc",
      description: `Thông tin thời gian làm việc đã được xóa thành công`,
    });
  };

  const createLeaveRequest = (requestData: Omit<LeaveRequest, "id" | "createdAt" | "updatedAt" | "status" | "userId" | "userName">) => {
    if (!user) return;
    
    const newRequest: LeaveRequest = {
      ...requestData,
      id: `leave-${Date.now()}`,
      userId: user.id,
      userName: user.name,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setLeaveRequests([newRequest, ...leaveRequests]);
    
    toast({
      title: "Yêu cầu nghỉ phép đã được tạo",
      description: `Yêu cầu nghỉ phép đã được gửi và đang chờ phê duyệt`,
    });
  };

  const updateLeaveRequest = (id: string, updates: Partial<LeaveRequest>) => {
    setLeaveRequests(
      leaveRequests.map(request => 
        request.id === id 
          ? { ...request, ...updates, updatedAt: new Date().toISOString() } 
          : request
      )
    );
    
    toast({
      title: "Yêu cầu nghỉ phép đã cập nhật",
      description: `Yêu cầu nghỉ phép đã được cập nhật thành công`,
    });
  };

  const deleteLeaveRequest = (id: string) => {
    setLeaveRequests(leaveRequests.filter(request => request.id !== id));
    
    toast({
      title: "Yêu cầu nghỉ phép đã xóa",
      description: `Yêu cầu nghỉ phép đã được xóa thành công`,
    });
  };

  const getTimesheetSummary = (userId: string, period: string, startDate: string, endDate: string): TimesheetSummary | null => {
    // First check if we already have a summary for this period
    const existingSummary = timesheetSummaries.find(
      s => s.userId === userId && s.period === period && s.startDate === startDate && s.endDate === endDate
    );
    
    if (existingSummary) {
      return existingSummary;
    }
    
    // Calculate summary from work logs and leave requests
    const userWorkLogs = workLogs.filter(
      log => log.userId === userId && log.date >= startDate && log.date <= endDate
    );
    
    const userOvertimeRequests = overtimeRequests.filter(
      req => req.userId === userId && req.date >= startDate && req.date <= endDate && req.status === 'approved'
    );
    
    const userLeaveRequests = leaveRequests.filter(
      req => req.userId === userId && 
             ((req.startDate >= startDate && req.startDate <= endDate) || 
              (req.endDate >= startDate && req.endDate <= endDate)) &&
             req.status === 'approved'
    );
    
    // Basic calculations
    const regularHours = userWorkLogs.reduce((sum, log) => sum + log.hours, 0);
    const overtimeHours = userOvertimeRequests.reduce((sum, req) => sum + req.totalHours, 0);
    
    // Weekend overtime (simple calculation - in real app would check if date is weekend)
    const weekendOvertimeHours = 0; // This would need actual date checking logic
    
    // Count leave days (simplified)
    const leaveCount = userLeaveRequests.reduce((sum, req) => sum + req.totalDays, 0);
    
    // Calculate completion rate (simplified)
    const daysInPeriod = 30; // Simplified - should calculate actual days in period
    const daysLogged = new Set(userWorkLogs.map(log => log.date)).size;
    const daysOnLeave = leaveCount;
    const completionRate = ((daysLogged + daysOnLeave) / daysInPeriod) * 100;
    
    const newSummary: TimesheetSummary = {
      userId,
      period,
      startDate,
      endDate,
      regularHours,
      overtimeHours,
      weekendOvertimeHours,
      leaveCount,
      completionRate: Math.min(completionRate, 100) // Cap at 100%
    };
    
    // Save this summary for future reference
    setTimesheetSummaries([...timesheetSummaries, newSummary]);
    
    return newSummary;
  };

  const createReview = (reviewData: Omit<OutsourceReview, "id" | "createdAt" | "updatedAt" | "reviewerId" | "reviewerName">) => {
    if (!user) return;
    
    const newReview: OutsourceReview = {
      ...reviewData,
      id: `review-${Date.now()}`,
      reviewerId: user.id,
      reviewerName: user.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setReviews([newReview, ...reviews]);
    
    toast({
      title: "Đánh giá đã được tạo",
      description: `Đánh giá cho ${newReview.revieweeName} đã được tạo thành công`,
    });
  };

  const updateReview = (id: string, updates: Partial<OutsourceReview>) => {
    setReviews(
      reviews.map(review => 
        review.id === id 
          ? { ...review, ...updates, updatedAt: new Date().toISOString() } 
          : review
      )
    );
    
    toast({
      title: "Đánh giá đã cập nhật",
      description: `Đánh giá đã được cập nhật thành công`,
    });
  };

  const deleteReview = (id: string) => {
    setReviews(reviews.filter(review => review.id !== id));
    
    toast({
      title: "Đánh giá đã xóa",
      description: `Đánh giá đã được xóa thành công`,
    });
  };

  const createEnvironmentSetup = async (setupData: Omit<EnvironmentSetup, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newSetup: EnvironmentSetup = {
      ...setupData,
      id: `env-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setEnvironmentSetups((prev) => [...prev, newSetup]);
    return Promise.resolve();
  };

  const updateEnvironmentSetup = (updatedSetup: EnvironmentSetup) => {
    setEnvironmentSetups((prev) => 
      prev.map((setup) => (setup.id === updatedSetup.id ? updatedSetup : setup))
    );
  };

  const deleteEnvironmentSetup = (id: string) => {
    setEnvironmentSetups(environmentSetups.filter(setup => setup.id !== id));
    
    toast({
      title: "Thiết lập đã xóa",
      description: `Thiết lập môi trường đã được xóa thành công`,
    });
  };

  const value: AppContextType = {
    user,
    users,
    tickets,
    notifications,
    overtimeRequests,
    workLogs,
    leaveRequests,
    timesheetSummaries,
    reviews,
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
    createOvertimeRequest,
    updateOvertimeRequest,
    deleteOvertimeRequest,
    createWorkLog,
    updateWorkLog,
    deleteWorkLog,
    createLeaveRequest,
    updateLeaveRequest,
    deleteLeaveRequest,
    getTimesheetSummary,
    createReview,
    updateReview,
    deleteReview,
    environmentSetups,
    createEnvironmentSetup,
    updateEnvironmentSetup,
    deleteEnvironmentSetup,
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
