
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

export type TicketStatus = 'open' | 'in progress' | 'resolved' | 'closed' | 'pending' | 'approved' | 'rejected';
export type TicketCategory = 'tech_setup' | 'dev_issues' | 'mentoring' | 'hr_matters';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';
export type UserRole = 'admin' | 'supervisor' | 'agent' | 'approver' | 'requester';
export type DeviceType = 'laptop' | 'pc' | 'vm' | 'byod';
export type SetupLocation = 'onsite' | 'remote';
export type SetupItemStatus = 'pending' | 'in_progress' | 'done' | 'blocked';
export type ReviewCriteriaScore = 1 | 2 | 3 | 4 | 5;

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: TicketCategory;
  requester: User;
  assigneeId?: string;
  assigneeName?: string;
  comments?: Comment[];
  attachments?: Attachment[];
  approvers?: User[];
  tags?: string[];
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
  ticketId?: string;
}

export interface Attachment {
  id: string;
  ticketId: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  url: string;
  uploadedAt: string;
  uploadedBy: string;
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
  startTime: string;
  endTime: string;
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
  reviewDate: string;
  criteria: {
    technicalQuality: ReviewCriteriaScore;
    professionalAttitude: ReviewCriteriaScore;
    communication: ReviewCriteriaScore;
    ruleCompliance: ReviewCriteriaScore;
    initiative: ReviewCriteriaScore;
  };
  strengths?: string;
  areasToImprove?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SetupItem {
  id: string;
  title: string;
  description?: string;
  category: 'device' | 'mdm' | 'os' | 'software' | 'account';
  status: SetupItemStatus;
  notes?: string;
  ticketId?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EnvironmentSetup {
  id: string;
  employeeId: string;
  employeeName: string;
  deviceType: DeviceType;
  setupLocation: SetupLocation;
  requestDate: string;
  responsibleId?: string;
  responsibleName?: string;
  status: TicketStatus;
  notes?: string;
  items: SetupItem[];
  completionDate?: string;
  verifiedById?: string;
  verifiedByName?: string;
  verificationNotes?: string;
  createdAt: string;
  updatedAt: string;
}
