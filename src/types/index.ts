// Re-export contract types
export * from './contracts';
export * from './timesheet';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'supervisor' | 'agent' | 'approver' | 'requester';
  department?: string;
  position?: string;
  avatar?: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
  permissions?: string[];
  managerId?: string;
  phone?: string;
  address?: string;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  requester: User;
  assigneeId?: string;
  assigneeName?: string;
  comments?: Comment[];
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  ticketId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  createdAt: string;
}

export interface NotificationMessage {
  id: string;
  userId: string;
  type: 'ticket' | 'request' | 'announcement';
  message: string;
  link: string;
  isRead: boolean;
  createdAt: string;
}

export interface OvertimeRequest {
  id: string;
  userId: string;
  userName: string;
  date: string;
  startTime: string;
  endTime: string;
  totalHours: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface WorkLogEntry {
  id: string;
  userId: string;
  date: string;
  hours: number;
  description: string;
  projectId?: string;
  projectName?: string;
  taskId?: string;
  taskName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeaveRequest {
  id: string;
  userId: string;
  userName: string;
  type: 'annual' | 'sick' | 'other';
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface TimesheetSummary {
  userId: string;
  period: string;
  startDate: string;
  endDate: string;
  regularHours: number;
  overtimeHours: number;
  weekendOvertimeHours: number;
  leaveCount: number;
  completionRate: number;
}

export interface OutsourceReview {
  id: string;
  revieweeId: string;
  revieweeName: string;
  reviewerId: string;
  reviewerName: string;
  projectId?: string;
  projectName?: string;
  qualityRating: number;
  communicationRating: number;
  timelinessRating: number;
  comments?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EnvironmentSetup {
  id: string;
  name: string;
  description?: string;
  steps: string;
  link?: string;
  createdAt: string;
  updatedAt: string;
}
