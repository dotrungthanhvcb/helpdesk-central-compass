
import { Ticket, Comment, Attachment } from '@/types';
import { get, post, put, del, uploadFileToS3 } from './config';

// Request for pre-signed URL
interface UploadUrlRequest {
  fileName: string;
  fileType: string;
  fileSize: number;
  ticketId: string;
}

// Response with pre-signed URL
interface UploadUrlResponse {
  uploadUrl: string;
  fileId: string;
}

export const ticketService = {
  // Get all tickets
  getTickets: async (): Promise<Ticket[]> => {
    return await get<Ticket[]>('/tickets');
  },
  
  // Get a specific ticket by ID
  getTicket: async (id: string): Promise<Ticket> => {
    return await get<Ticket>(`/tickets/${id}`);
  },
  
  // Create a new ticket
  createTicket: async (ticketData: Omit<Ticket, "id" | "createdAt" | "updatedAt" | "requester">): Promise<Ticket> => {
    return await post<Ticket>('/tickets', ticketData);
  },
  
  // Update an existing ticket
  updateTicket: async (id: string, updates: Partial<Ticket>): Promise<Ticket> => {
    return await put<Ticket>(`/tickets/${id}`, updates);
  },
  
  // Delete a ticket
  deleteTicket: async (id: string): Promise<void> => {
    await del<void>(`/tickets/${id}`);
  },
  
  // Add a comment to a ticket
  addComment: async (ticketId: string, content: string): Promise<Comment> => {
    return await post<Comment>(`/tickets/${ticketId}/comments`, { content });
  },
  
  // Request a pre-signed URL for file upload
  getUploadUrl: async (fileInfo: UploadUrlRequest): Promise<UploadUrlResponse> => {
    return await post<UploadUrlResponse>('/tickets/attachments/upload-url', fileInfo);
  },
  
  // Upload a file and save metadata
  uploadAttachment: async (
    ticketId: string,
    file: File
  ): Promise<Attachment> => {
    // Step 1: Get pre-signed URL
    const uploadUrlResponse = await ticketService.getUploadUrl({
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      ticketId,
    });
    
    // Step 2: Upload file to S3
    const uploadSuccess = await uploadFileToS3(uploadUrlResponse.uploadUrl, file);
    
    if (!uploadSuccess) {
      throw new Error('File upload failed');
    }
    
    // Step 3: Save file metadata in the database
    return await post<Attachment>(`/tickets/${ticketId}/attachments`, {
      fileId: uploadUrlResponse.fileId,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
    });
  },
};
