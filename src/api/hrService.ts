
import { OvertimeRequest, OutsourceReview, LeaveRequest } from '@/types';
import { get, post, put, del } from './config';

export const hrService = {
  // ====== Overtime Requests ======
  // Get all overtime requests
  getOvertimeRequests: async (): Promise<OvertimeRequest[]> => {
    return await get<OvertimeRequest[]>('/ot-requests');
  },
  
  // Create a new overtime request
  createOvertimeRequest: async (requestData: Omit<OvertimeRequest, "id" | "createdAt" | "updatedAt" | "status" | "userId" | "userName">): Promise<OvertimeRequest> => {
    return await post<OvertimeRequest>('/ot-requests', requestData);
  },
  
  // Update an overtime request
  updateOvertimeRequest: async (id: string, updates: Partial<OvertimeRequest>): Promise<OvertimeRequest> => {
    return await put<OvertimeRequest>(`/ot-requests/${id}`, updates);
  },
  
  // Delete an overtime request
  deleteOvertimeRequest: async (id: string): Promise<void> => {
    await del<void>(`/ot-requests/${id}`);
  },
  
  // ====== Leave Requests ======
  // Get all leave requests
  getLeaveRequests: async (): Promise<LeaveRequest[]> => {
    return await get<LeaveRequest[]>('/leave-requests');
  },
  
  // Create a new leave request
  createLeaveRequest: async (requestData: Omit<LeaveRequest, "id" | "createdAt" | "updatedAt" | "status" | "userId" | "userName">): Promise<LeaveRequest> => {
    return await post<LeaveRequest>('/leave-requests', requestData);
  },
  
  // Update a leave request
  updateLeaveRequest: async (id: string, updates: Partial<LeaveRequest>): Promise<LeaveRequest> => {
    return await put<LeaveRequest>(`/leave-requests/${id}`, updates);
  },
  
  // Delete a leave request
  deleteLeaveRequest: async (id: string): Promise<void> => {
    await del<void>(`/leave-requests/${id}`);
  },
  
  // ====== Reviews ======
  // Get all reviews
  getReviews: async (): Promise<OutsourceReview[]> => {
    return await get<OutsourceReview[]>('/reviews');
  },
  
  // Get a specific review
  getReview: async (id: string): Promise<OutsourceReview> => {
    return await get<OutsourceReview>(`/reviews/${id}`);
  },
  
  // Create a new review
  createReview: async (reviewData: Omit<OutsourceReview, "id" | "createdAt" | "updatedAt" | "reviewerId" | "reviewerName">): Promise<OutsourceReview> => {
    return await post<OutsourceReview>('/reviews', reviewData);
  },
  
  // Update a review
  updateReview: async (id: string, updates: Partial<OutsourceReview>): Promise<OutsourceReview> => {
    return await put<OutsourceReview>(`/reviews/${id}`, updates);
  },
  
  // Delete a review
  deleteReview: async (id: string): Promise<void> => {
    await del<void>(`/reviews/${id}`);
  },
};
