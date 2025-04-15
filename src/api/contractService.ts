
import { Contract, Document } from '@/types/contracts';
import { get, post, put, del, uploadFileToS3 } from './config';

// Request for pre-signed URL
interface UploadUrlRequest {
  fileName: string;
  fileType: string;
  fileSize: number;
  contractId: string;
}

// Response with pre-signed URL
interface UploadUrlResponse {
  uploadUrl: string;
  fileId: string;
}

export const contractService = {
  // Get all contracts
  getContracts: async (): Promise<Contract[]> => {
    return await get<Contract[]>('/contracts');
  },
  
  // Get a specific contract by ID
  getContract: async (id: string): Promise<Contract> => {
    return await get<Contract>(`/contracts/${id}`);
  },
  
  // Create a new contract
  createContract: async (contractData: Omit<Contract, "id" | "createdAt" | "updatedAt" | "documents">): Promise<Contract> => {
    return await post<Contract>('/contracts', contractData);
  },
  
  // Update an existing contract
  updateContract: async (id: string, updates: Partial<Contract>): Promise<Contract> => {
    return await put<Contract>(`/contracts/${id}`, updates);
  },
  
  // Delete a contract
  deleteContract: async (id: string): Promise<void> => {
    await del<void>(`/contracts/${id}`);
  },
  
  // Get download URL for a document
  getDocumentDownloadUrl: async (contractId: string, documentId: string): Promise<{ downloadUrl: string }> => {
    return await get<{ downloadUrl: string }>(`/contracts/${contractId}/documents/${documentId}/download`);
  },
  
  // Request a pre-signed URL for document upload
  getUploadUrl: async (fileInfo: UploadUrlRequest): Promise<UploadUrlResponse> => {
    return await post<UploadUrlResponse>('/contracts/upload', fileInfo);
  },
  
  // Upload a document and save metadata
  uploadDocument: async (
    contractId: string,
    documentData: Omit<Document, "id" | "uploadedAt" | "uploadedBy" | "uploadedByName">,
    file: File
  ): Promise<Document> => {
    // Step 1: Get pre-signed URL
    const uploadUrlResponse = await contractService.getUploadUrl({
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      contractId,
    });
    
    // Step 2: Upload file to S3
    const uploadSuccess = await uploadFileToS3(uploadUrlResponse.uploadUrl, file);
    
    if (!uploadSuccess) {
      throw new Error('Document upload failed');
    }
    
    // Step 3: Save document metadata in the database
    return await post<Document>(`/contracts/${contractId}/documents`, {
      ...documentData,
      fileId: uploadUrlResponse.fileId,
      name: documentData.name,
      type: documentData.type,
      size: file.size,
    });
  },
};
