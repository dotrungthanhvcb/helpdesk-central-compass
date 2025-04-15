import { LeaveType } from './timesheet';
import { AuthUser, UserRole } from './auth';

// Re-export types
export { LeaveType, AuthUser, UserRole };

// User
export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: string;
  department?: string;
  position?: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
  permissions?: string[];
}

// OT Request
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
  approverNote?: string;
  approverId?: string;
  approverName?: string;
  createdAt: string;
  updatedAt: string;
}

// Outsource Review
export interface OutsourceReview {
  id: string;
  reviewerId: string;
  reviewerName: string;
  revieweeId: string;
  revieweeName: string;
  reviewDate: string;
  period: string;
  projectId?: string;
  projectName?: string;
  scores: {
    technical: number;
    communication: number;
    teamwork: number;
    leadership: number;
    overall: number;
  };
  strengths?: string[];
  weaknesses?: string[];
  comments?: string;
  createdAt: string;
  updatedAt: string;
}

// Environment Setup Request
export interface EnvironmentSetup {
  id: string;
  requesterId: string;
  requesterName: string;
  staffId: string;
  staffName: string;
  startDate: string;
  projectId?: string;
  projectName?: string;
  status: 'pending' | 'in_progress' | 'completed';
  items: SetupItem[];
  completedCount: number;
  totalCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface SetupItem {
  id: string;
  setupId: string;
  name: string;
  description?: string;
  category: 'hardware' | 'software' | 'access' | 'other';
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  assigneeId?: string;
  assigneeName?: string;
  dueDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Notification
export interface NotificationMessage {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  isRead: boolean;
  linkTo?: string;
  createdAt: string;
}

// Ticket
export interface Ticket {
  id: string;
  title: string;
  description: string;
  category: 'hardware' | 'software' | 'network' | 'access' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'pending' | 'resolved' | 'closed';
  requesterId: string;
  requester?: User;
  assigneeId?: string;
  assignee?: User;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  comments?: Comment[];
  attachments?: Attachment[];
}

export interface Comment {
  id: string;
  ticketId: string;
  userId: string;
  userName?: string;
  content: string;
  createdAt: string;
}

export interface Attachment {
  id: string;
  ticketId: string;
  userId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileUrl: string;
  uploadedAt: string;
}
