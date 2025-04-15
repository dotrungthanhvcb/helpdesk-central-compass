
import { mockData } from "@/utils/mockDataGenerator";
import { getAuthToken, setAuthToken, removeAuthToken } from "./config";

// Delay helper to simulate network latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API responses
export const mockApiServer = {
  // Initialize mock server with generated data
  data: mockData,
  
  // Authentication
  async login(email: string, password: string) {
    await delay(800);
    const user = this.data.users.find(u => u.email === email);
    
    if (!user || password !== 'password') {
      throw new Error('Invalid credentials');
    }
    
    const token = `mock-token-${user.id}-${Date.now()}`;
    setAuthToken(token);
    
    return {
      token,
      user: { ...user, password: undefined } // Remove password from response
    };
  },
  
  async getCurrentUser() {
    await delay(500);
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('Not authenticated');
    }
    
    const userId = token.split('-')[1];
    const user = this.data.users.find(u => u.id === userId);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return { ...user, password: undefined };
  },
  
  async logout() {
    await delay(300);
    removeAuthToken();
    return { success: true };
  },
  
  // Tickets
  async getTickets() {
    await delay(600);
    return this.data.tickets;
  },
  
  async getTicket(id: string) {
    await delay(400);
    const ticket = this.data.tickets.find(t => t.id === id);
    
    if (!ticket) {
      throw new Error('Ticket not found');
    }
    
    return ticket;
  },
  
  async createTicket(ticketData: any) {
    await delay(800);
    
    // Get current user
    const token = getAuthToken();
    const userId = token?.split('-')[1];
    const user = this.data.users.find(u => u.id === userId);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    const newTicket = {
      ...ticketData,
      id: `ticket-${Date.now()}`,
      requester: { ...user, password: undefined },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: [],
      attachments: [],
    };
    
    this.data.tickets.unshift(newTicket);
    return newTicket;
  },
  
  async updateTicket(id: string, updates: any) {
    await delay(600);
    const ticketIndex = this.data.tickets.findIndex(t => t.id === id);
    
    if (ticketIndex === -1) {
      throw new Error('Ticket not found');
    }
    
    const updatedTicket = {
      ...this.data.tickets[ticketIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    this.data.tickets[ticketIndex] = updatedTicket;
    return updatedTicket;
  },
  
  async deleteTicket(id: string) {
    await delay(500);
    const ticketIndex = this.data.tickets.findIndex(t => t.id === id);
    
    if (ticketIndex === -1) {
      throw new Error('Ticket not found');
    }
    
    this.data.tickets.splice(ticketIndex, 1);
    return { success: true };
  },
  
  // Add other mock API endpoints for contracts, assignments, etc. as needed
  
  // Upload URLs (simulate S3 pre-signed URLs)
  async getUploadUrl(fileInfo: any) {
    await delay(400);
    return {
      uploadUrl: `https://mock-s3-upload.example.com/${fileInfo.fileName}?token=${Date.now()}`,
      fileId: `file-${Date.now()}`,
    };
  },
  
  // Simulate file upload to S3
  async uploadToS3(url: string, file: File) {
    await delay(1000); // Longer delay to simulate upload
    return true; // Always succeed in mock
  },
};

// Export mock API functions for testing
export const setupMockApi = () => {
  // Check if we're in development mode and should use mock APIs
  if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCK_API === 'true') {
    console.log('Using mock API server for development');
    
    // Intercept fetch requests
    const originalFetch = window.fetch;
    window.fetch = async function(input: RequestInfo | URL, init?: RequestInit) {
      const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
      
      // Only intercept API calls to our backend
      if (url.includes('/api/') || url.startsWith('http://localhost:8000/api/')) {
        try {
          // Parse the endpoint from the URL
          const endpoint = url.split('/api/')[1];
          
          // Handle different endpoints
          if (endpoint === 'login' && init?.method === 'POST') {
            const body = JSON.parse(init.body as string);
            const result = await mockApiServer.login(body.email, body.password);
            return createMockResponse(result);
          }
          
          if (endpoint === 'me' && (!init?.method || init.method === 'GET')) {
            const result = await mockApiServer.getCurrentUser();
            return createMockResponse(result);
          }
          
          if (endpoint === 'logout' && init?.method === 'POST') {
            const result = await mockApiServer.logout();
            return createMockResponse(result);
          }
          
          if (endpoint === 'tickets' && (!init?.method || init.method === 'GET')) {
            const result = await mockApiServer.getTickets();
            return createMockResponse(result);
          }
          
          // Add more endpoint handlers as needed
          
          // Fall through for unhandled endpoints in development
          console.warn(`Mock API endpoint not implemented: ${url}`);
        } catch (error: any) {
          // Return error response
          return createMockResponse({ message: error.message }, false, 400);
        }
      }
      
      // Pass through all other requests to real fetch
      return originalFetch(input, init);
    };
  }
};

// Helper to create mock response
function createMockResponse(data: any, success = true, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
