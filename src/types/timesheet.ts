
// Timesheet related types
export type LeaveType = 'annual' | 'sick' | 'other' | 'paid' | 'unpaid' | 'wfh';

export interface WorkLogEntry {
  id: string;
  userId: string;
  date: string;
  startTime: string;
  endTime: string;
  hours: number;
  projectId?: string;
  projectName?: string;
  taskDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeaveRequest {
  id: string;
  userId: string;
  userName: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason?: string;
  status: 'pending' | 'approved' | 'rejected';
  approverNote?: string;
  approverId?: string;
  approverName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TimesheetSummary {
  userId: string;
  period: string; // 'week' or 'month'
  startDate: string;
  endDate: string;
  regularHours: number;
  overtimeHours: number;
  weekendOvertimeHours: number;
  leaveCount: number;
  completionRate: number; // percentage of filled days
}
