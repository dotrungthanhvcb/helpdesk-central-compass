
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, Ticket, NotificationMessage, OvertimeRequest, OutsourceReview, EnvironmentSetup, WorkLogEntry, LeaveRequest, TimesheetSummary } from "@/types";
import { Contract, Document, Squad, Project, Assignment } from "@/types/contracts";
import { notifications as mockNotifications } from "@/data/mockData";
import { toast } from "@/hooks/use-toast";
import { authService, ticketService, contractService, assignmentService, hrService, setupService, getAuthToken, removeAuthToken } from "@/api";

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
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  createTicket: (ticket: Omit<Ticket, "id" | "createdAt" | "updatedAt" | "requester">) => Promise<void>;
  updateTicket: (id: string, updates: Partial<Ticket>) => Promise<void>;
  deleteTicket: (id: string) => Promise<void>;
  addComment: (ticketId: string, content: string) => Promise<void>;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  createUser: (userData: User) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  createOvertimeRequest: (request: Omit<OvertimeRequest, "id" | "createdAt" | "updatedAt" | "status" | "userId" | "userName">) => Promise<void>;
  updateOvertimeRequest: (id: string, updates: Partial<OvertimeRequest>) => Promise<void>;
  deleteOvertimeRequest: (id: string) => Promise<void>;
  createWorkLog: (workLog: Omit<WorkLogEntry, "id" | "createdAt" | "updatedAt" | "userId">) => Promise<void>;
  updateWorkLog: (id: string, updates: Partial<WorkLogEntry>) => Promise<void>;
  deleteWorkLog: (id: string) => Promise<void>;
  createLeaveRequest: (request: Omit<LeaveRequest, "id" | "createdAt" | "updatedAt" | "status" | "userId" | "userName">) => Promise<void>;
  updateLeaveRequest: (id: string, updates: Partial<LeaveRequest>) => Promise<void>;
  deleteLeaveRequest: (id: string) => Promise<void>;
  getTimesheetSummary: (userId: string, period: string, startDate: string, endDate: string) => TimesheetSummary | null;
  createReview: (review: Omit<OutsourceReview, "id" | "createdAt" | "updatedAt" | "reviewerId" | "reviewerName">) => Promise<void>;
  updateReview: (id: string, updates: Partial<OutsourceReview>) => Promise<void>;
  deleteReview: (id: string) => Promise<void>;
  environmentSetups: EnvironmentSetup[];
  createEnvironmentSetup: (setup: Omit<EnvironmentSetup, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateEnvironmentSetup: (setup: EnvironmentSetup) => Promise<void>;
  deleteEnvironmentSetup: (id: string) => Promise<void>;
  contracts: Contract[];
  documents: Document[];
  squads: Squad[];
  projects: Project[];
  assignments: Assignment[];
  createContract: (contract: Omit<Contract, "id" | "createdAt" | "updatedAt" | "documents">) => Promise<string>;
  updateContract: (id: string, updates: Partial<Contract>) => Promise<void>;
  deleteContract: (id: string) => Promise<void>;
  uploadDocument: (document: Omit<Document, "id" | "uploadedAt" | "uploadedBy" | "uploadedByName">, file: File) => Promise<string>;
  deleteDocument: (id: string) => Promise<void>;
  createSquad: (squad: Omit<Squad, "id" | "createdAt">) => Promise<string>;
  updateSquad: (id: string, updates: Partial<Squad>) => Promise<void>;
  deleteSquad: (id: string) => Promise<void>;
  createProject: (project: Omit<Project, "id" | "createdAt">) => Promise<string>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  createAssignment: (assignment: Omit<Assignment, "id" | "createdAt" | "updatedAt">) => Promise<string>;
  updateAssignment: (id: string, updates: Partial<Assignment>) => Promise<void>;
  deleteAssignment: (id: string) => Promise<void>;
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
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [squads, setSquads] = useState<Squad[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initial load - check if token exists and fetch user data
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      try {
        const token = getAuthToken();
        if (token) {
          const userData = await authService.getCurrentUser();
          if (userData) {
            setUser(userData);
            setIsAuthenticated(true);
            await loadInitialData();
          }
        }
      } catch (error) {
        console.error("Authentication failed:", error);
        removeAuthToken();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Load initial data after successful authentication
  const loadInitialData = async () => {
    try {
      // Load tickets
      const ticketsData = await ticketService.getTickets();
      setTickets(ticketsData);

      // Load contracts and related data
      const [contractsData, squadsData, projectsData, assignmentsData] = await Promise.all([
        contractService.getContracts(),
        assignmentService.getSquads(),
        assignmentService.getProjects(),
        assignmentService.getAssignments(),
      ]);

      setContracts(contractsData);
      setSquads(squadsData);
      setProjects(projectsData);
      setAssignments(assignmentsData);

      // Load HR related data
      const [overtimeData, leaveData, reviewsData] = await Promise.all([
        hrService.getOvertimeRequests(),
        hrService.getLeaveRequests(),
        hrService.getReviews(),
      ]);

      setOvertimeRequests(overtimeData);
      setLeaveRequests(leaveData);
      setReviews(reviewsData);

      // Load environment setups
      const setupsData = await setupService.getEnvironmentSetups();
      setEnvironmentSetups(setupsData);

      // For now, use mock notifications until we have a real notifications API
      setNotifications(mockNotifications.filter(n => n.userId === user?.id));
    } catch (error) {
      console.error("Error loading initial data:", error);
      toast({
        title: "Data Loading Error",
        description: "Failed to load some application data.",
        variant: "destructive",
      });
    }
  };

  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const userData = await authService.login(email, password);
      setUser(userData);
      setIsAuthenticated(true);
      await loadInitialData();
      
      toast({
        title: "Đăng nhập thành công",
        description: `Chào mừng, ${userData.name}!`,
      });
      return true;
    } catch (error) {
      toast({
        title: "Đăng nhập thất bại",
        description: "Email hoặc mật khẩu không đúng",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      removeAuthToken();
      setIsLoading(false);
      
      toast({
        title: "Đăng xuất thành công",
        description: "Hẹn gặp lại!",
      });
    }
  };

  const createTicket = async (ticketData: Omit<Ticket, "id" | "createdAt" | "updatedAt" | "requester">) => {
    try {
      const newTicket = await ticketService.createTicket(ticketData);
      setTickets(prev => [newTicket, ...prev]);
      
      toast({
        title: "Ticket đã được tạo",
        description: `Ticket ${newTicket.title} đã được tạo thành công`,
      });
    } catch (error) {
      console.error("Create ticket error:", error);
    }
  };

  const updateTicket = async (id: string, updates: Partial<Ticket>) => {
    try {
      const updatedTicket = await ticketService.updateTicket(id, updates);
      setTickets(prev => prev.map(ticket => 
        ticket.id === id ? updatedTicket : ticket
      ));
      
      toast({
        title: "Ticket đã cập nhật",
        description: `Ticket đã được cập nhật thành công`,
      });
    } catch (error) {
      console.error("Update ticket error:", error);
    }
  };

  const deleteTicket = async (id: string) => {
    try {
      await ticketService.deleteTicket(id);
      setTickets(prev => prev.filter(ticket => ticket.id !== id));
      
      toast({
        title: "Ticket đã xóa",
        description: `Ticket đã được xóa thành công`,
      });
    } catch (error) {
      console.error("Delete ticket error:", error);
    }
  };

  const addComment = async (ticketId: string, content: string) => {
    try {
      const newComment = await ticketService.addComment(ticketId, content);
      
      setTickets(prev => prev.map(ticket => 
        ticket.id === ticketId 
          ? {
              ...ticket,
              comments: [...(ticket.comments || []), newComment],
            }
          : ticket
      ));
    } catch (error) {
      console.error("Add comment error:", error);
    }
  };

  // Notification methods - will use local state until we have a notifications API
  const markNotificationAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true } 
          : notification
      )
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  // User management - placeholder methods for when we have a users API
  const createUser = (userData: User) => {
    // Placeholder until we have a users API
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
    // Placeholder until we have a users API
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
    // Placeholder until we have a users API
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

  const createOvertimeRequest = async (requestData: Omit<OvertimeRequest, "id" | "createdAt" | "updatedAt" | "status" | "userId" | "userName">) => {
    try {
      const newRequest = await hrService.createOvertimeRequest(requestData);
      setOvertimeRequests(prev => [newRequest, ...prev]);
      
      toast({
        title: "Yêu cầu OT đã được tạo",
        description: `Yêu cầu làm thêm giờ đã được gửi và đang chờ phê duyệt`,
      });
    } catch (error) {
      console.error("Create overtime request error:", error);
    }
  };

  const updateOvertimeRequest = async (id: string, updates: Partial<OvertimeRequest>) => {
    try {
      const updatedRequest = await hrService.updateOvertimeRequest(id, updates);
      setOvertimeRequests(prev => prev.map(request => 
        request.id === id ? updatedRequest : request
      ));
      
      toast({
        title: "Yêu cầu OT đã cập nhật",
        description: `Yêu cầu làm thêm giờ đã được cập nhật thành công`,
      });
    } catch (error) {
      console.error("Update overtime request error:", error);
    }
  };

  const deleteOvertimeRequest = async (id: string) => {
    try {
      await hrService.deleteOvertimeRequest(id);
      setOvertimeRequests(prev => prev.filter(request => request.id !== id));
      
      toast({
        title: "Yêu cầu OT đã xóa",
        description: `Yêu cầu làm thêm giờ đã được xóa thành công`,
      });
    } catch (error) {
      console.error("Delete overtime request error:", error);
    }
  };

  const createWorkLog = async (workLogData: Omit<WorkLogEntry, "id" | "createdAt" | "updatedAt" | "userId">) => {
    // TODO: Replace with real API once available
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

  const updateWorkLog = async (id: string, updates: Partial<WorkLogEntry>) => {
    // TODO: Replace with real API once available
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

  const deleteWorkLog = async (id: string) => {
    // TODO: Replace with real API once available
    setWorkLogs(workLogs.filter(log => log.id !== id));
    
    toast({
      title: "Đã xóa thời gian làm việc",
      description: `Thông tin thời gian làm việc đã được xóa thành công`,
    });
  };

  const createLeaveRequest = async (requestData: Omit<LeaveRequest, "id" | "createdAt" | "updatedAt" | "status" | "userId" | "userName">) => {
    try {
      const newRequest = await hrService.createLeaveRequest(requestData);
      setLeaveRequests(prev => [newRequest, ...prev]);
      
      toast({
        title: "Yêu cầu nghỉ phép đã được tạo",
        description: `Yêu cầu nghỉ phép đã được gửi và đang chờ phê duyệt`,
      });
    } catch (error) {
      console.error("Create leave request error:", error);
    }
  };

  const updateLeaveRequest = async (id: string, updates: Partial<LeaveRequest>) => {
    try {
      const updatedRequest = await hrService.updateLeaveRequest(id, updates);
      setLeaveRequests(prev => prev.map(request => 
        request.id === id ? updatedRequest : request
      ));
      
      toast({
        title: "Yêu cầu nghỉ phép đã cập nhật",
        description: `Yêu cầu nghỉ phép đã được cập nhật thành công`,
      });
    } catch (error) {
      console.error("Update leave request error:", error);
    }
  };

  const deleteLeaveRequest = async (id: string) => {
    try {
      await hrService.deleteLeaveRequest(id);
      setLeaveRequests(prev => prev.filter(request => request.id !== id));
      
      toast({
        title: "Yêu cầu nghỉ phép đã xóa",
        description: `Yêu cầu nghỉ phép đã được xóa thành công`,
      });
    } catch (error) {
      console.error("Delete leave request error:", error);
    }
  };

  // Timesheet summary - placeholder until we have an API for this
  const getTimesheetSummary = (userId: string, period: string, startDate: string, endDate: string): TimesheetSummary | null => {
    const existingSummary = timesheetSummaries.find(
      s => s.userId === userId && s.period === period && s.startDate === startDate && s.endDate === endDate
    );
    
    if (existingSummary) {
      return existingSummary;
    }
    
    // Placeholder calculation logic
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
    
    const regularHours = userWorkLogs.reduce((sum, log) => sum + log.hours, 0);
    const overtimeHours = userOvertimeRequests.reduce((sum, req) => sum + req.totalHours, 0);
    
    const weekendOvertimeHours = 0;
    
    const leaveCount = userLeaveRequests.reduce((sum, req) => sum + req.totalDays, 0);
    
    const daysInPeriod = 30;
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
      completionRate: Math.min(completionRate, 100)
    };
    
    setTimesheetSummaries([...timesheetSummaries, newSummary]);
    
    return newSummary;
  };

  const createReview = async (reviewData: Omit<OutsourceReview, "id" | "createdAt" | "updatedAt" | "reviewerId" | "reviewerName">) => {
    try {
      const newReview = await hrService.createReview(reviewData);
      setReviews(prev => [newReview, ...prev]);
      
      toast({
        title: "Đánh giá đã được tạo",
        description: `Đánh giá cho ${newReview.revieweeName} đã được tạo thành công`,
      });
    } catch (error) {
      console.error("Create review error:", error);
    }
  };

  const updateReview = async (id: string, updates: Partial<OutsourceReview>) => {
    try {
      const updatedReview = await hrService.updateReview(id, updates);
      setReviews(prev => prev.map(review => 
        review.id === id ? updatedReview : review
      ));
      
      toast({
        title: "Đánh giá đã cập nhật",
        description: `Đánh giá đã được cập nhật thành công`,
      });
    } catch (error) {
      console.error("Update review error:", error);
    }
  };

  const deleteReview = async (id: string) => {
    try {
      await hrService.deleteReview(id);
      setReviews(prev => prev.filter(review => review.id !== id));
      
      toast({
        title: "Đánh giá đã xóa",
        description: `Đánh giá đã được xóa thành công`,
      });
    } catch (error) {
      console.error("Delete review error:", error);
    }
  };

  const createEnvironmentSetup = async (setupData: Omit<EnvironmentSetup, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newSetup = await setupService.createEnvironmentSetup(setupData);
      setEnvironmentSetups(prev => [...prev, newSetup]);
      return Promise.resolve();
    } catch (error) {
      console.error("Create environment setup error:", error);
      return Promise.reject(error);
    }
  };

  const updateEnvironmentSetup = async (updatedSetup: EnvironmentSetup) => {
    try {
      await setupService.updateEnvironmentSetup(updatedSetup.id, updatedSetup);
      setEnvironmentSetups(prev => 
        prev.map(setup => (setup.id === updatedSetup.id ? updatedSetup : setup))
      );
    } catch (error) {
      console.error("Update environment setup error:", error);
    }
  };

  const deleteEnvironmentSetup = async (id: string) => {
    try {
      await setupService.deleteEnvironmentSetup(id);
      setEnvironmentSetups(prev => prev.filter(setup => setup.id !== id));
      
      toast({
        title: "Thiết lập đã xóa",
        description: `Thiết lập môi trường đã được xóa thành công`,
      });
    } catch (error) {
      console.error("Delete environment setup error:", error);
    }
  };

  const createContract = async (contractData: Omit<Contract, "id" | "createdAt" | "updatedAt" | "documents">) => {
    try {
      const newContract = await contractService.createContract(contractData);
      setContracts(prev => [newContract, ...prev]);
      
      toast({
        title: "Hợp đồng đã được tạo",
        description: `Hợp đồng cho ${newContract.staffName} đã được tạo thành công`,
      });
      
      return newContract.id;
    } catch (error) {
      console.error("Create contract error:", error);
      return "";
    }
  };

  const updateContract = async (id: string, updates: Partial<Contract>) => {
    try {
      const updatedContract = await contractService.updateContract(id, updates);
      setContracts(prev => prev.map(contract => 
        contract.id === id ? updatedContract : contract
      ));
      
      toast({
        title: "Hợp đồng đã cập nhật",
        description: `Hợp đồng đã được cập nhật thành công`,
      });
    } catch (error) {
      console.error("Update contract error:", error);
    }
  };

  const deleteContract = async (id: string) => {
    try {
      await contractService.deleteContract(id);
      setContracts(prev => prev.filter(contract => contract.id !== id));
      
      toast({
        title: "Hợp đồng đã xóa",
        description: `Hợp đồng đã được xóa thành công`,
      });
    } catch (error) {
      console.error("Delete contract error:", error);
    }
  };

  const uploadDocument = async (
    documentData: Omit<Document, "id" | "uploadedAt" | "uploadedBy" | "uploadedByName">, 
    file: File
  ) => {
    try {
      const newDocument = await contractService.uploadDocument(
        documentData.contractId,
        documentData,
        file
      );
      
      setDocuments(prev => [newDocument, ...prev]);
      
      // Update the contract with the new document
      setContracts(prev =>
        prev.map(contract => 
          contract.id === documentData.contractId
            ? { 
                ...contract, 
                documents: [...contract.documents, newDocument]
              } 
            : contract
        )
      );
      
      toast({
        title: "Tài liệu đã tải lên",
        description: `Tài liệu ${newDocument.name} đã được tải lên thành công`,
      });
      
      return newDocument.id;
    } catch (error) {
      console.error("Upload document error:", error);
      return "";
    }
  };

  const deleteDocument = async (id: string) => {
    try {
      const document = documents.find(doc => doc.id === id);
      
      if (!document) {
        toast({
          title: "Lỗi",
          description: "Không tìm thấy tài liệu",
          variant: "destructive",
        });
        return;
      }
      
      // In a real app, we'd call an API endpoint to delete the document
      setDocuments(prev => prev.filter(doc => doc.id !== id));
      
      // Update the contract to remove the document
      setContracts(prev =>
        prev.map(contract => 
          contract.id === document.contractId
            ? { 
                ...contract, 
                documents: contract.documents.filter(doc => doc.id !== id)
              } 
            : contract
        )
      );
      
      toast({
        title: "Tài liệu đã xóa",
        description: `Tài liệu đã được xóa thành công`,
      });
    } catch (error) {
      console.error("Delete document error:", error);
    }
  };

  const createSquad = async (squadData: Omit<Squad, "id" | "createdAt">) => {
    try {
      const newSquad = await assignmentService.createSquad(squadData);
      setSquads(prev => [newSquad, ...prev]);
      
      toast({
        title: "Nhóm đã được tạo",
        description: `Nhóm ${newSquad.name} đã được tạo thành công`,
      });
      
      return newSquad.id;
    } catch (error) {
      console.error("Create squad error:", error);
      return "";
    }
  };

  const updateSquad = async (id: string, updates: Partial<Squad>) => {
    try {
      const updatedSquad = await assignmentService.updateSquad(id, updates);
      setSquads(prev => prev.map(squad => 
        squad.id === id ? updatedSquad : squad
      ));
      
      // If the name was updated, update assignments that reference this squad
      if (updates.name) {
        setAssignments(prev =>
          prev.map(assignment => 
            assignment.squadId === id 
              ? { ...assignment, squadName: updates.name } 
              : assignment
          )
        );
      }
      
      toast({
        title: "Nhóm đã cập nhật",
        description: `Thông tin nhóm đã được cập nhật thành công`,
      });
    } catch (error) {
      console.error("Update squad error:", error);
    }
  };

  const deleteSquad = async (id: string) => {
    try {
      await assignmentService.deleteSquad(id);
      setSquads(prev => prev.filter(squad => squad.id !== id));
      
      // Update assignments that reference this squad
      setAssignments(prev =>
        prev.map(assignment => 
          assignment.squadId === id 
            ? { ...assignment, squadId: undefined, squadName: undefined } 
            : assignment
        )
      );
      
      toast({
        title: "Nhóm đã xóa",
        description: `Nhóm đã được xóa thành công`,
      });
    } catch (error) {
      console.error("Delete squad error:", error);
    }
  };

  const createProject = async (projectData: Omit<Project, "id" | "createdAt">) => {
    try {
      const newProject = await assignmentService.createProject(projectData);
      setProjects(prev => [newProject, ...prev]);
      
      toast({
        title: "Dự án đã được tạo",
        description: `Dự án ${newProject.name} đã được tạo thành công`,
      });
      
      return newProject.id;
    } catch (error) {
      console.error("Create project error:", error);
      return "";
    }
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    try {
      const updatedProject = await assignmentService.updateProject(id, updates);
      setProjects(prev => prev.map(project => 
        project.id === id ? updatedProject : project
      ));
      
      // If the name was updated, update assignments that reference this project
      if (updates.name) {
        setAssignments(prev =>
          prev.map(assignment => 
            assignment.projectId === id 
              ? { ...assignment, projectName: updates.name } 
              : assignment
          )
        );
      }
      
      toast({
        title: "Dự án đã cập nhật",
        description: `Thông tin dự án đã được cập nhật thành công`,
      });
    } catch (error) {
      console.error("Update project error:", error);
    }
  };

  const deleteProject = async (id: string) => {
    try {
      await assignmentService.deleteProject(id);
      setProjects(prev => prev.filter(project => project.id !== id));
      
      // Update assignments that reference this project
      setAssignments(prev =>
        prev.map(assignment => 
          assignment.projectId === id 
            ? { ...assignment, projectId: undefined, projectName: undefined } 
            : assignment
        )
      );
      
      toast({
        title: "Dự án đã xóa",
        description: `Dự án đã được xóa thành công`,
      });
    } catch (error) {
      console.error("Delete project error:", error);
    }
  };

  const createAssignment = async (assignmentData: Omit<Assignment, "id" | "createdAt" | "updatedAt">) => {
    try {
      const newAssignment = await assignmentService.createAssignment(assignmentData);
      setAssignments(prev => [newAssignment, ...prev]);
      
      toast({
        title: "Phân công đã được tạo",
        description: `Phân công cho ${newAssignment.staffName} đã được tạo thành công`,
      });
      
      return newAssignment.id;
    } catch (error) {
      console.error("Create assignment error:", error);
      return "";
    }
  };

  const updateAssignment = async (id: string, updates: Partial<Assignment>) => {
    try {
      const updatedAssignment = await assignmentService.updateAssignment(id, updates);
      setAssignments(prev => prev.map(assignment => 
        assignment.id === id ? updatedAssignment : assignment
      ));
      
      toast({
        title: "Phân công đã cập nhật",
        description: `Thông tin phân công đã được cập nhật thành công`,
      });
    } catch (error) {
      console.error("Update assignment error:", error);
    }
  };

  const deleteAssignment = async (id: string) => {
    try {
      await assignmentService.deleteAssignment(id);
      setAssignments(prev => prev.filter(assignment => assignment.id !== id));
      
      toast({
        title: "Phân công đã xóa",
        description: `Phân công đã được xóa thành công`,
      });
    } catch (error) {
      console.error("Delete assignment error:", error);
    }
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
    isLoading,
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
    contracts,
    documents,
    squads,
    projects,
    assignments,
    createContract,
    updateContract,
    deleteContract,
    uploadDocument,
    deleteDocument,
    createSquad,
    updateSquad,
    deleteSquad,
    createProject,
    updateProject,
    deleteProject,
    createAssignment,
    updateAssignment,
    deleteAssignment,
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
