
import { EnvironmentSetup, SetupItem } from '@/types';
import { get, post, put, del } from './config';

export const setupService = {
  // Get all environment setups
  getEnvironmentSetups: async (): Promise<EnvironmentSetup[]> => {
    return await get<EnvironmentSetup[]>('/setup-requests');
  },
  
  // Get a specific environment setup
  getEnvironmentSetup: async (id: string): Promise<EnvironmentSetup> => {
    return await get<EnvironmentSetup>(`/setup-requests/${id}`);
  },
  
  // Create a new environment setup
  createEnvironmentSetup: async (setupData: Omit<EnvironmentSetup, 'id' | 'createdAt' | 'updatedAt'>): Promise<EnvironmentSetup> => {
    return await post<EnvironmentSetup>('/setup-requests', setupData);
  },
  
  // Update an environment setup
  updateEnvironmentSetup: async (id: string, updates: Partial<EnvironmentSetup>): Promise<EnvironmentSetup> => {
    return await put<EnvironmentSetup>(`/setup-requests/${id}`, updates);
  },
  
  // Delete an environment setup
  deleteEnvironmentSetup: async (id: string): Promise<void> => {
    await del<void>(`/setup-requests/${id}`);
  },
  
  // Create a setup item
  createSetupItem: async (setupId: string, itemData: Omit<SetupItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<SetupItem> => {
    return await post<SetupItem>(`/setup-requests/${setupId}/items`, itemData);
  },
  
  // Update a setup item
  updateSetupItem: async (setupId: string, itemId: string, updates: Partial<SetupItem>): Promise<SetupItem> => {
    return await put<SetupItem>(`/setup-requests/${setupId}/items/${itemId}`, updates);
  },
  
  // Delete a setup item
  deleteSetupItem: async (setupId: string, itemId: string): Promise<void> => {
    await del<void>(`/setup-requests/${setupId}/items/${itemId}`);
  },
};
