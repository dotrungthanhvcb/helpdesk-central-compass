
export type UserRole = 'requester' | 'agent' | 'approver' | 'supervisor' | 'admin';

export type TicketStatus = 'pending' | 'in_progress' | 'resolved' | 'rejected' | 'approved';

export type TicketPriority = 'low' | 'medium' | 'high';

export type TicketCategory = 'tech_setup' | 'dev_issues' | 'mentoring' | 'hr_matters';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  avatar?: string;
  isActive?: boolean;
  createdAt?: string;
  lastLogin?: string;
}

export interface Comment {
  id: string;
  ticketId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: string;
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

export interface Ticket {
  id: string;
  title: string;
  description: string;
  category: TicketCategory;
  status: TicketStatus;
  priority: TicketPriority;
  requester: User;
  assignedTo?: User;
  approvers?: User[];
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  comments?: Comment[];
  attachments?: Attachment[];
}

export interface NotificationMessage {
  id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  ticketId?: string;
}

export interface TicketFilter {
  status?: TicketStatus[];
  category?: TicketCategory[];
  priority?: TicketPriority[];
  assignedTo?: string;
  requester?: string;
  dateRange?: {
    from: string;
    to: string;
  };
  searchQuery?: string;
}

export interface UserPreferences {
  language: 'en' | 'vi';
  timezone: string;
  theme: 'light' | 'dark' | 'system';
  notificationSettings: {
    email: boolean;
    browser: boolean;
    ticketUpdates: boolean;
    systemAnnouncements: boolean;
    mentions: boolean;
  };
}

// New Types for Timesheet Module
export interface TimeEntry {
  id: string;
  userId: string;
  date: string;
  hours: number;
  projectId?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
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
  status: TicketStatus;
  comment?: string;
  reviewerId?: string;
  reviewerName?: string;
  reviewerFeedback?: string;
  createdAt: string;
  updatedAt: string;
}

// New Types for Outsource Review Module
export type ReviewCriteriaScore = 1 | 2 | 3 | 4 | 5;

export interface ReviewCriteria {
  technicalQuality: ReviewCriteriaScore;
  professionalAttitude: ReviewCriteriaScore;
  communication: ReviewCriteriaScore;
  ruleCompliance: ReviewCriteriaScore;
  initiative: ReviewCriteriaScore;
}

export interface OutsourceReview {
  id: string;
  revieweeId: string;
  revieweeName: string;
  reviewerId: string;
  reviewerName: string;
  reviewDate: string;
  criteria: ReviewCriteria;
  strengths?: string;
  areasToImprove?: string;
  createdAt: string;
  updatedAt: string;
}
