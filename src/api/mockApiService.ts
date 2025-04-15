
import { User, Ticket, OvertimeRequest, LeaveRequest, OutsourceReview, EnvironmentSetup } from '@/types';
import { Contract, Squad, Project, Assignment } from '@/types/contracts';
import { setAuthToken } from './config';

// Sample user data for mock login
const mockUsers = [
  {
    id: 'user-1',
    name: 'Nguyen Van A',
    email: 'nguyen.van.a@example.com',
    password: 'password',
    role: 'admin',
    department: 'IT',
    position: 'Manager',
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
    lastLogin: '2025-04-14T00:00:00Z',
    permissions: ['all'],
  },
  {
    id: 'user-2',
    name: 'Tran Thi B',
    email: 'tran.thi.b@example.com',
    password: 'password',
    role: 'agent',
    department: 'Support',
    position: 'Support Agent',
    isActive: true,
    createdAt: '2023-01-02T00:00:00Z',
    lastLogin: '2025-04-13T00:00:00Z',
  },
];

// Mock response generator with delay to simulate network
const mockResponse = <T>(data: T, delay = 500): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
};

// Mock API endpoints
const mockEndpoints = {
  '/login': async (data: { email: string; password: string }) => {
    const user = mockUsers.find(
      (u) => u.email === data.email && u.password === data.password
    );
    
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    // Generate a mock JWT token
    const token = `mock-jwt-token-${Date.now()}`;
    
    return {
      token,
      user: { ...user, password: undefined },
    };
  },
  
  '/me': async () => {
    // Just return the first user for simplicity
    const user = { ...mockUsers[0], password: undefined };
    return user;
  },
  
  '/tickets': async () => {
    return [];
  },
  
  '/contracts': async () => {
    return [];
  },
  
  '/squads': async () => {
    return [];
  },
  
  '/projects': async () => {
    return [];
  },
  
  '/assignments': async () => {
    return [];
  },
  
  '/overtime-requests': async () => {
    return [];
  },
  
  '/leave-requests': async () => {
    return [];
  },
  
  '/reviews': async () => {
    return [];
  },
  
  '/environment-setups': async () => {
    return [];
  },
};

// Setup mock API interceptor
export const setupMockApi = () => {
  // Override the global fetch function
  const originalFetch = window.fetch;
  
  window.fetch = async function(input: RequestInfo | URL, init?: RequestInit) {
    const url = input.toString();
    
    // Extract the API endpoint
    const apiEndpoint = url.replace(/^.*\/api/, '');
    
    // Check if we have a mock for this endpoint
    const endpointKeys = Object.keys(mockEndpoints);
    const matchedEndpoint = endpointKeys.find(key => apiEndpoint.startsWith(key));
    
    if (matchedEndpoint) {
      try {
        let data = {};
        
        // Parse request body if it exists
        if (init?.body) {
          try {
            data = JSON.parse(init.body.toString());
          } catch (e) {
            console.error('Failed to parse request body:', e);
          }
        }
        
        // Call the mock endpoint handler
        const responseData = await mockEndpoints[matchedEndpoint as keyof typeof mockEndpoints](data);
        
        // Create a mock Response object
        return new Response(JSON.stringify(responseData), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        });
      } catch (error: any) {
        // Return error response
        return new Response(JSON.stringify({ message: error.message }), {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }
    }
    
    // For any endpoints not mocked, use the original fetch
    console.log('No mock for', apiEndpoint, '- using original fetch');
    return originalFetch(input, init);
  };
  
  console.log('Mock API service initialized');
};
