
export type UserRole = 'requester' | 'agent' | 'approver' | 'supervisor';

export type TicketStatus = 'pending' | 'in_progress' | 'resolved' | 'rejected';

export type TicketPriority = 'low' | 'medium' | 'high';

export type TicketCategory = 'tech_setup' | 'dev_issues' | 'mentoring' | 'hr_matters';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  avatar?: string;
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
