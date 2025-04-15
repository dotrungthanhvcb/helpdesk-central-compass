
export type ContractType = 'main' | 'nda' | 'compliance' | 'other';
export type ContractStatus = 'active' | 'expired' | 'pending' | 'terminated';
export type DocumentType = 'pdf' | 'docx' | 'image' | 'other';

export interface Document {
  id: string;
  contractId: string;
  name: string;
  type: DocumentType;
  url: string;
  uploadedAt: string;
  uploadedBy: string;
  uploadedByName: string;
  size: number;
}

export interface Contract {
  id: string;
  contractType: ContractType;
  staffName: string;
  staffId: string;
  company?: string;
  effectiveDate: string;
  expiryDate: string;
  signedBy: string;
  signedById: string;
  status: ContractStatus;
  notes?: string;
  documents: Document[];
  createdAt: string;
  updatedAt: string;
}

export type SquadRole = 'developer' | 'designer' | 'qa' | 'manager' | 'consultant' | 'other';

export interface Squad {
  id: string;
  name: string;
  description?: string;
  managerId?: string;
  managerName?: string;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  status: 'active' | 'completed' | 'on-hold' | 'upcoming';
  squadId?: string;
  squadName?: string;
  createdAt: string;
}

export interface Assignment {
  id: string;
  staffId: string;
  staffName: string;
  role: SquadRole;
  squadId?: string;
  squadName?: string;
  projectId?: string;
  projectName?: string;
  startDate: string;
  endDate?: string;
  status: 'active' | 'completed' | 'upcoming';
  utilization: number; // percentage
  createdAt: string;
  updatedAt: string;
}
