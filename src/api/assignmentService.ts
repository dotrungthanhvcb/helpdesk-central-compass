
import { Assignment, Squad, Project } from '@/types/contracts';
import { get, post, put, del } from './config';

export const assignmentService = {
  // Get all assignments
  getAssignments: async (): Promise<Assignment[]> => {
    return await get<Assignment[]>('/assignments');
  },
  
  // Create a new assignment
  createAssignment: async (assignmentData: Omit<Assignment, "id" | "createdAt" | "updatedAt">): Promise<Assignment> => {
    return await post<Assignment>('/assignments', assignmentData);
  },
  
  // Update an existing assignment
  updateAssignment: async (id: string, updates: Partial<Assignment>): Promise<Assignment> => {
    return await put<Assignment>(`/assignments/${id}`, updates);
  },
  
  // Delete an assignment
  deleteAssignment: async (id: string): Promise<void> => {
    await del<void>(`/assignments/${id}`);
  },
  
  // Get all squads
  getSquads: async (): Promise<Squad[]> => {
    return await get<Squad[]>('/squads');
  },
  
  // Create a new squad
  createSquad: async (squadData: Omit<Squad, "id" | "createdAt">): Promise<Squad> => {
    return await post<Squad>('/squads', squadData);
  },
  
  // Update a squad
  updateSquad: async (id: string, updates: Partial<Squad>): Promise<Squad> => {
    return await put<Squad>(`/squads/${id}`, updates);
  },
  
  // Delete a squad
  deleteSquad: async (id: string): Promise<void> => {
    await del<void>(`/squads/${id}`);
  },
  
  // Get all projects
  getProjects: async (): Promise<Project[]> => {
    return await get<Project[]>('/projects');
  },
  
  // Create a new project
  createProject: async (projectData: Omit<Project, "id" | "createdAt">): Promise<Project> => {
    return await post<Project>('/projects', projectData);
  },
  
  // Update a project
  updateProject: async (id: string, updates: Partial<Project>): Promise<Project> => {
    return await put<Project>(`/projects/${id}`, updates);
  },
  
  // Delete a project
  deleteProject: async (id: string): Promise<void> => {
    await del<void>(`/projects/${id}`);
  },
};
