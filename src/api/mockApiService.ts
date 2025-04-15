
import { User, Ticket, OvertimeRequest, LeaveRequest, OutsourceReview, EnvironmentSetup } from '@/types';
import { Contract, Squad, Project, Assignment } from '@/types/contracts';
import { setAuthToken } from './config';
import { initializeMockData } from '@/utils/mockDataGenerator';

// Initialize mock data
let mockData: {
  users: User[];
  squads: Squad[];
  projects: Project[];
  contracts: Contract[];
  assignments: Assignment[];
  tickets: Ticket[];
  overtimeRequests: OvertimeRequest[];
  leaveRequests: LeaveRequest[];
  reviews: OutsourceReview[];
  environmentSetups: EnvironmentSetup[];
} | null = null;

// Mock response generator with delay to simulate network
const mockResponse = <T>(data: T, delay = 500): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
};

// Helper function to handle authentication
const authenticate = (email: string, password: string) => {
  if (!mockData) throw new Error('Mock data not initialized');
  
  const user = mockData.users.find(
    (u) => u.email === email && u.password === password
  );
  
  if (!user) {
    throw new Error('Invalid credentials');
  }
  
  return user;
};

// Mock API endpoints
const mockEndpoints: Record<string, Function> = {
  // Authentication endpoints
  '/login': async (data: { email: string; password: string }) => {
    if (!mockData) await loadMockData();
    
    const user = authenticate(data.email, data.password);
    
    // Generate a mock JWT token
    const token = `mock-jwt-token-${Date.now()}`;
    
    return {
      token,
      user: { ...user, password: undefined },
    };
  },
  
  '/me': async () => {
    if (!mockData) await loadMockData();
    
    // Just return the first user for simplicity in mock mode
    const user = { ...mockData!.users[0], password: undefined };
    return user;
  },
  
  '/logout': async () => {
    return { success: true };
  },
  
  // Ticket endpoints
  '/tickets': async (data?: any, method?: string, id?: string) => {
    if (!mockData) await loadMockData();
    
    switch (method) {
      case 'GET':
        if (id) {
          const ticket = mockData!.tickets.find(t => t.id === id);
          if (!ticket) throw new Error('Ticket not found');
          return ticket;
        }
        return mockData!.tickets;
        
      case 'POST':
        const newTicket: Ticket = {
          ...data,
          id: `ticket-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          comments: [],
          attachments: [],
        };
        mockData!.tickets.unshift(newTicket);
        return newTicket;
        
      case 'PUT':
        if (!id) throw new Error('Ticket ID is required');
        
        const ticketIndex = mockData!.tickets.findIndex(t => t.id === id);
        if (ticketIndex === -1) throw new Error('Ticket not found');
        
        const updatedTicket = {
          ...mockData!.tickets[ticketIndex],
          ...data,
          updatedAt: new Date().toISOString(),
        };
        
        mockData!.tickets[ticketIndex] = updatedTicket;
        return updatedTicket;
        
      case 'DELETE':
        if (!id) throw new Error('Ticket ID is required');
        
        const ticketToDeleteIndex = mockData!.tickets.findIndex(t => t.id === id);
        if (ticketToDeleteIndex === -1) throw new Error('Ticket not found');
        
        const deletedTicket = mockData!.tickets.splice(ticketToDeleteIndex, 1)[0];
        return { success: true, id: deletedTicket.id };
        
      default:
        throw new Error(`Method ${method} not supported for /tickets`);
    }
  },
  
  // Ticket comments endpoint
  '/tickets/:id/comments': async (data: any, method: string, id: string) => {
    if (!mockData) await loadMockData();
    
    const ticketIndex = mockData!.tickets.findIndex(t => t.id === id);
    if (ticketIndex === -1) throw new Error('Ticket not found');
    
    switch (method) {
      case 'POST':
        const newComment = {
          id: `comment-${Date.now()}`,
          ticketId: id,
          userId: mockData!.users[0].id,
          userName: mockData!.users[0].name,
          content: data.content,
          createdAt: new Date().toISOString(),
        };
        
        if (!mockData!.tickets[ticketIndex].comments) {
          mockData!.tickets[ticketIndex].comments = [];
        }
        
        mockData!.tickets[ticketIndex].comments!.push(newComment);
        return newComment;
        
      default:
        throw new Error(`Method ${method} not supported for /tickets/:id/comments`);
    }
  },
  
  // Contract endpoints
  '/contracts': async (data?: any, method?: string, id?: string) => {
    if (!mockData) await loadMockData();
    
    switch (method) {
      case 'GET':
        if (id) {
          const contract = mockData!.contracts.find(c => c.id === id);
          if (!contract) throw new Error('Contract not found');
          return contract;
        }
        return mockData!.contracts;
        
      case 'POST':
        const newContract: Contract = {
          ...data,
          id: `contract-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          documents: [],
        };
        mockData!.contracts.unshift(newContract);
        return newContract;
        
      case 'PUT':
        if (!id) throw new Error('Contract ID is required');
        
        const contractIndex = mockData!.contracts.findIndex(c => c.id === id);
        if (contractIndex === -1) throw new Error('Contract not found');
        
        const updatedContract = {
          ...mockData!.contracts[contractIndex],
          ...data,
          updatedAt: new Date().toISOString(),
        };
        
        mockData!.contracts[contractIndex] = updatedContract;
        return updatedContract;
        
      case 'DELETE':
        if (!id) throw new Error('Contract ID is required');
        
        const contractToDeleteIndex = mockData!.contracts.findIndex(c => c.id === id);
        if (contractToDeleteIndex === -1) throw new Error('Contract not found');
        
        const deletedContract = mockData!.contracts.splice(contractToDeleteIndex, 1)[0];
        return { success: true, id: deletedContract.id };
        
      default:
        throw new Error(`Method ${method} not supported for /contracts`);
    }
  },
  
  // Contract upload endpoint
  '/contracts/upload': async (data: any) => {
    // Mock pre-signed URL generation
    const fileId = `file-${Date.now()}`;
    const uploadUrl = `https://mock-s3.example.com/upload/${fileId}`;
    
    return {
      uploadUrl,
      fileId,
    };
  },
  
  // Contract document download endpoint
  '/contracts/:id/documents/:documentId/download': async (data: any, method: string, id: string, documentId: string) => {
    return {
      downloadUrl: `https://mock-s3.example.com/download/${documentId}`,
    };
  },
  
  // Assignment endpoints
  '/assignments': async (data?: any, method?: string, id?: string) => {
    if (!mockData) await loadMockData();
    
    switch (method) {
      case 'GET':
        return mockData!.assignments;
        
      case 'POST':
        const newAssignment: Assignment = {
          ...data,
          id: `assignment-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        mockData!.assignments.unshift(newAssignment);
        return newAssignment;
        
      case 'PUT':
        if (!id) throw new Error('Assignment ID is required');
        
        const assignmentIndex = mockData!.assignments.findIndex(a => a.id === id);
        if (assignmentIndex === -1) throw new Error('Assignment not found');
        
        const updatedAssignment = {
          ...mockData!.assignments[assignmentIndex],
          ...data,
          updatedAt: new Date().toISOString(),
        };
        
        mockData!.assignments[assignmentIndex] = updatedAssignment;
        return updatedAssignment;
        
      case 'DELETE':
        if (!id) throw new Error('Assignment ID is required');
        
        const assignmentToDeleteIndex = mockData!.assignments.findIndex(a => a.id === id);
        if (assignmentToDeleteIndex === -1) throw new Error('Assignment not found');
        
        const deletedAssignment = mockData!.assignments.splice(assignmentToDeleteIndex, 1)[0];
        return { success: true, id: deletedAssignment.id };
        
      default:
        throw new Error(`Method ${method} not supported for /assignments`);
    }
  },
  
  // Squad endpoints
  '/squads': async (data?: any, method?: string, id?: string) => {
    if (!mockData) await loadMockData();
    
    switch (method) {
      case 'GET':
        return mockData!.squads;
        
      case 'POST':
        const newSquad: Squad = {
          ...data,
          id: `squad-${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        mockData!.squads.unshift(newSquad);
        return newSquad;
        
      case 'PUT':
        if (!id) throw new Error('Squad ID is required');
        
        const squadIndex = mockData!.squads.findIndex(s => s.id === id);
        if (squadIndex === -1) throw new Error('Squad not found');
        
        const updatedSquad = {
          ...mockData!.squads[squadIndex],
          ...data,
        };
        
        mockData!.squads[squadIndex] = updatedSquad;
        return updatedSquad;
        
      case 'DELETE':
        if (!id) throw new Error('Squad ID is required');
        
        const squadToDeleteIndex = mockData!.squads.findIndex(s => s.id === id);
        if (squadToDeleteIndex === -1) throw new Error('Squad not found');
        
        const deletedSquad = mockData!.squads.splice(squadToDeleteIndex, 1)[0];
        return { success: true, id: deletedSquad.id };
        
      default:
        throw new Error(`Method ${method} not supported for /squads`);
    }
  },
  
  // Project endpoints
  '/projects': async (data?: any, method?: string, id?: string) => {
    if (!mockData) await loadMockData();
    
    switch (method) {
      case 'GET':
        return mockData!.projects;
        
      case 'POST':
        const newProject: Project = {
          ...data,
          id: `project-${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        mockData!.projects.unshift(newProject);
        return newProject;
        
      case 'PUT':
        if (!id) throw new Error('Project ID is required');
        
        const projectIndex = mockData!.projects.findIndex(p => p.id === id);
        if (projectIndex === -1) throw new Error('Project not found');
        
        const updatedProject = {
          ...mockData!.projects[projectIndex],
          ...data,
        };
        
        mockData!.projects[projectIndex] = updatedProject;
        return updatedProject;
        
      case 'DELETE':
        if (!id) throw new Error('Project ID is required');
        
        const projectToDeleteIndex = mockData!.projects.findIndex(p => p.id === id);
        if (projectToDeleteIndex === -1) throw new Error('Project not found');
        
        const deletedProject = mockData!.projects.splice(projectToDeleteIndex, 1)[0];
        return { success: true, id: deletedProject.id };
        
      default:
        throw new Error(`Method ${method} not supported for /projects`);
    }
  },
  
  // Overtime request endpoints
  '/ot-requests': async (data?: any, method?: string, id?: string) => {
    if (!mockData) await loadMockData();
    
    switch (method) {
      case 'GET':
        return mockData!.overtimeRequests;
        
      case 'POST':
        const newOTRequest: OvertimeRequest = {
          ...data,
          id: `ot-${Date.now()}`,
          userId: mockData!.users[0].id,
          userName: mockData!.users[0].name,
          status: 'pending',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        mockData!.overtimeRequests.unshift(newOTRequest);
        return newOTRequest;
        
      case 'PUT':
        if (!id) throw new Error('Overtime Request ID is required');
        
        const otRequestIndex = mockData!.overtimeRequests.findIndex(o => o.id === id);
        if (otRequestIndex === -1) throw new Error('Overtime Request not found');
        
        const updatedOTRequest = {
          ...mockData!.overtimeRequests[otRequestIndex],
          ...data,
          updatedAt: new Date().toISOString(),
        };
        
        mockData!.overtimeRequests[otRequestIndex] = updatedOTRequest;
        return updatedOTRequest;
        
      case 'DELETE':
        if (!id) throw new Error('Overtime Request ID is required');
        
        const otRequestToDeleteIndex = mockData!.overtimeRequests.findIndex(o => o.id === id);
        if (otRequestToDeleteIndex === -1) throw new Error('Overtime Request not found');
        
        const deletedOTRequest = mockData!.overtimeRequests.splice(otRequestToDeleteIndex, 1)[0];
        return { success: true, id: deletedOTRequest.id };
        
      default:
        throw new Error(`Method ${method} not supported for /ot-requests`);
    }
  },
  
  // Leave request endpoints
  '/leave-requests': async (data?: any, method?: string, id?: string) => {
    if (!mockData) await loadMockData();
    
    switch (method) {
      case 'GET':
        return mockData!.leaveRequests;
        
      case 'POST':
        const newLeaveRequest: LeaveRequest = {
          ...data,
          id: `leave-${Date.now()}`,
          userId: mockData!.users[0].id,
          userName: mockData!.users[0].name,
          status: 'pending',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        mockData!.leaveRequests.unshift(newLeaveRequest);
        return newLeaveRequest;
        
      case 'PUT':
        if (!id) throw new Error('Leave Request ID is required');
        
        const leaveRequestIndex = mockData!.leaveRequests.findIndex(l => l.id === id);
        if (leaveRequestIndex === -1) throw new Error('Leave Request not found');
        
        const updatedLeaveRequest = {
          ...mockData!.leaveRequests[leaveRequestIndex],
          ...data,
          updatedAt: new Date().toISOString(),
        };
        
        mockData!.leaveRequests[leaveRequestIndex] = updatedLeaveRequest;
        return updatedLeaveRequest;
        
      case 'DELETE':
        if (!id) throw new Error('Leave Request ID is required');
        
        const leaveRequestToDeleteIndex = mockData!.leaveRequests.findIndex(l => l.id === id);
        if (leaveRequestToDeleteIndex === -1) throw new Error('Leave Request not found');
        
        const deletedLeaveRequest = mockData!.leaveRequests.splice(leaveRequestToDeleteIndex, 1)[0];
        return { success: true, id: deletedLeaveRequest.id };
        
      default:
        throw new Error(`Method ${method} not supported for /leave-requests`);
    }
  },
  
  // Review endpoints
  '/reviews': async (data?: any, method?: string, id?: string) => {
    if (!mockData) await loadMockData();
    
    switch (method) {
      case 'GET':
        if (id) {
          const review = mockData!.reviews.find(r => r.id === id);
          if (!review) throw new Error('Review not found');
          return review;
        }
        return mockData!.reviews;
        
      case 'POST':
        const newReview: OutsourceReview = {
          ...data,
          id: `review-${Date.now()}`,
          reviewerId: mockData!.users[0].id,
          reviewerName: mockData!.users[0].name,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        mockData!.reviews.unshift(newReview);
        return newReview;
        
      case 'PUT':
        if (!id) throw new Error('Review ID is required');
        
        const reviewIndex = mockData!.reviews.findIndex(r => r.id === id);
        if (reviewIndex === -1) throw new Error('Review not found');
        
        const updatedReview = {
          ...mockData!.reviews[reviewIndex],
          ...data,
          updatedAt: new Date().toISOString(),
        };
        
        mockData!.reviews[reviewIndex] = updatedReview;
        return updatedReview;
        
      case 'DELETE':
        if (!id) throw new Error('Review ID is required');
        
        const reviewToDeleteIndex = mockData!.reviews.findIndex(r => r.id === id);
        if (reviewToDeleteIndex === -1) throw new Error('Review not found');
        
        const deletedReview = mockData!.reviews.splice(reviewToDeleteIndex, 1)[0];
        return { success: true, id: deletedReview.id };
        
      default:
        throw new Error(`Method ${method} not supported for /reviews`);
    }
  },
  
  // Environment setup endpoints
  '/setup-requests': async (data?: any, method?: string, id?: string) => {
    if (!mockData) await loadMockData();
    
    switch (method) {
      case 'GET':
        if (id) {
          const setup = mockData!.environmentSetups.find(s => s.id === id);
          if (!setup) throw new Error('Environment Setup not found');
          return setup;
        }
        return mockData!.environmentSetups;
        
      case 'POST':
        const newSetup: EnvironmentSetup = {
          ...data,
          id: `setup-${Date.now()}`,
          items: data.items || [],
          completedCount: 0,
          totalCount: data.items?.length || 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        mockData!.environmentSetups.unshift(newSetup);
        return newSetup;
        
      case 'PUT':
        if (!id) throw new Error('Environment Setup ID is required');
        
        const setupIndex = mockData!.environmentSetups.findIndex(s => s.id === id);
        if (setupIndex === -1) throw new Error('Environment Setup not found');
        
        const updatedSetup = {
          ...mockData!.environmentSetups[setupIndex],
          ...data,
          updatedAt: new Date().toISOString(),
        };
        
        // Update completed count if items were updated
        if (data.items) {
          updatedSetup.completedCount = data.items.filter((item: any) => item.status === 'completed').length;
          updatedSetup.totalCount = data.items.length;
        }
        
        mockData!.environmentSetups[setupIndex] = updatedSetup;
        return updatedSetup;
        
      case 'DELETE':
        if (!id) throw new Error('Environment Setup ID is required');
        
        const setupToDeleteIndex = mockData!.environmentSetups.findIndex(s => s.id === id);
        if (setupToDeleteIndex === -1) throw new Error('Environment Setup not found');
        
        const deletedSetup = mockData!.environmentSetups.splice(setupToDeleteIndex, 1)[0];
        return { success: true, id: deletedSetup.id };
        
      default:
        throw new Error(`Method ${method} not supported for /setup-requests`);
    }
  },
};

// Helper function to load mock data
const loadMockData = async () => {
  if (!mockData) {
    mockData = await initializeMockData();
  }
  return mockData;
};

// Extract endpoint path and IDs from a URL
const parseUrl = (url: string) => {
  const parts = url.split('/');
  const baseEndpoint = `/${parts[parts.length - 1]}`;
  
  // Special case handling for nested routes
  if (parts.includes('tickets') && parts.includes('comments')) {
    return { 
      endpoint: '/tickets/:id/comments',
      id: parts[parts.indexOf('tickets') + 1],
    };
  }
  
  if (parts.includes('contracts') && parts.includes('documents') && parts.includes('download')) {
    return { 
      endpoint: '/contracts/:id/documents/:documentId/download',
      id: parts[parts.indexOf('contracts') + 1],
      documentId: parts[parts.indexOf('documents') + 1],
    };
  }
  
  // Handle basic collection endpoints with IDs
  if (parts.length > 2) {
    const collectionEndpoint = `/${parts[parts.length - 2]}`;
    const collectionEndpoints = [
      '/tickets', '/contracts', '/assignments', 
      '/squads', '/projects', '/ot-requests',
      '/leave-requests', '/reviews', '/setup-requests'
    ];
    
    if (collectionEndpoints.includes(collectionEndpoint)) {
      return { 
        endpoint: collectionEndpoint,
        id: parts[parts.length - 1],
      };
    }
  }
  
  return { endpoint: baseEndpoint, id: undefined };
};

// Setup mock API interceptor
export const setupMockApi = () => {
  // Initialize mock data
  loadMockData();
  
  // Override the global fetch function
  const originalFetch = window.fetch;
  
  window.fetch = async function(input: RequestInfo | URL, init?: RequestInit) {
    const url = input.toString();
    const method = init?.method || 'GET';
    
    // Only intercept API requests
    if (!url.includes('/api')) {
      return originalFetch(input, init);
    }
    
    try {
      // Extract the API endpoint and IDs
      const apiEndpoint = url.replace(/^.*\/api/, '');
      const { endpoint, id, documentId } = parseUrl(apiEndpoint);
      
      // Find the matching endpoint handler
      const endpointKeys = Object.keys(mockEndpoints);
      const matchedEndpoint = endpointKeys.find(key => key === endpoint);
      
      if (matchedEndpoint) {
        let data = {};
        
        // Parse request body if it exists
        if (init?.body) {
          try {
            data = JSON.parse(init.body.toString());
          } catch (e) {
            console.error('Failed to parse request body:', e);
          }
        }
        
        // Call the mock endpoint handler with the parsed data
        const handler = mockEndpoints[matchedEndpoint];
        const responseData = await mockResponse(await handler(data, method, id, documentId), 300);
        
        // Create a mock Response object
        return new Response(JSON.stringify(responseData), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }
      
      // For any endpoints not mocked, log a warning
      console.warn('No mock implemented for', apiEndpoint, '- returning empty array or object');
      
      // Return empty data for non-implemented endpoints
      if (apiEndpoint.split('/').length <= 2) {
        // Collection endpoint
        return new Response(JSON.stringify([]), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        });
      } else {
        // Single resource endpoint
        return new Response(JSON.stringify({}), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (error: any) {
      console.error('Mock API Error:', error);
      
      // Return error response
      return new Response(JSON.stringify({ message: error.message }), {
        status: error.message.includes('not found') ? 404 : 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
  };
  
  console.log('Mock API service initialized');
};

// Export helper to reset mock data (useful for testing)
export const resetMockData = async () => {
  mockData = null;
  await loadMockData();
  console.log('Mock data reset');
};
