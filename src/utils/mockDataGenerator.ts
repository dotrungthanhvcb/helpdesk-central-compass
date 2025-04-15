
import { faker } from '@faker-js/faker';
import { User, Ticket, OvertimeRequest, LeaveRequest, OutsourceReview, EnvironmentSetup, SetupItem } from '@/types';
import { Contract, Squad, Project, Assignment } from '@/types/contracts';

// Set a seed for reproducibility
faker.seed(123);

// Helper function to get random item from array
const getRandomItem = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

// Generate a random date between two dates
const randomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Format date to ISO string
const formatDate = (date: Date) => {
  return date.toISOString().split('T')[0];
};

// Generate users with different roles
export const generateUsers = (count: number) => {
  const roles = ['admin', 'hr', 'it_support', 'supervisor', 'employee'];
  const departments = ['IT', 'HR', 'Finance', 'Operations', 'Marketing'];
  
  const users: User[] = [];
  
  // Ensure we have at least one of each role
  roles.forEach(role => {
    const user: User = {
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      email: faker.internet.email().toLowerCase(),
      password: 'password', // Default password for testing
      role,
      department: getRandomItem(departments),
      position: `${role.charAt(0).toUpperCase() + role.slice(1)}`,
      isActive: true,
      createdAt: faker.date.past().toISOString(),
      lastLogin: faker.date.recent().toISOString(),
    };
    
    users.push(user);
  });
  
  // Generate remaining users
  for (let i = users.length; i < count; i++) {
    const user: User = {
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      email: faker.internet.email().toLowerCase(),
      password: 'password', // Default password for testing
      role: getRandomItem(roles),
      department: getRandomItem(departments),
      position: faker.person.jobTitle(),
      isActive: faker.datatype.boolean(0.9), // 90% are active
      createdAt: faker.date.past().toISOString(),
      lastLogin: faker.date.recent().toISOString(),
    };
    
    users.push(user);
  }
  
  return users;
};

// Generate squads
export const generateSquads = (count: number) => {
  const squads: Squad[] = [];
  
  for (let i = 0; i < count; i++) {
    const squad: Squad = {
      id: faker.string.uuid(),
      name: `Squad ${faker.company.name().split(' ')[0]}`,
      description: faker.lorem.sentence(),
      leadId: faker.string.uuid(),
      leadName: faker.person.fullName(),
      members: faker.number.int({ min: 3, max: 10 }),
      createdAt: faker.date.past().toISOString(),
    };
    
    squads.push(squad);
  }
  
  return squads;
};

// Generate projects
export const generateProjects = (count: number) => {
  const statuses = ['planning', 'active', 'completed', 'on_hold'];
  const projects: Project[] = [];
  
  for (let i = 0; i < count; i++) {
    const startDate = faker.date.past();
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + faker.number.int({ min: 1, max: 12 }));
    
    const project: Project = {
      id: faker.string.uuid(),
      name: `Project ${faker.company.buzzNoun()}`,
      description: faker.lorem.paragraph(),
      clientId: faker.string.uuid(),
      clientName: faker.company.name(),
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
      status: getRandomItem(statuses),
      createdAt: faker.date.past().toISOString(),
    };
    
    projects.push(project);
  }
  
  return projects;
};

// Generate contracts for staff
export const generateContracts = (users: User[], count: number) => {
  const types = ['outsource', 'fulltime', 'parttime', 'contract'];
  const contracts: Contract[] = [];
  
  users.forEach(user => {
    // Generate random number of contracts per user (1-5)
    const contractCount = faker.number.int({ min: 1, max: count });
    
    for (let i = 0; i < contractCount; i++) {
      const startDate = faker.date.past();
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + faker.number.int({ min: 3, max: 24 }));
      
      const contract: Contract = {
        id: faker.string.uuid(),
        staffId: user.id,
        staffName: user.name,
        type: getRandomItem(types),
        title: faker.person.jobTitle(),
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
        rate: faker.number.float({ min: 10, max: 100, precision: 0.01 }),
        currency: 'USD',
        isActive: faker.datatype.boolean(0.8), // 80% are active
        documents: [],
        createdAt: faker.date.past().toISOString(),
        updatedAt: faker.date.recent().toISOString(),
      };
      
      contracts.push(contract);
    }
  });
  
  return contracts;
};

// Generate assignments
export const generateAssignments = (users: User[], squads: Squad[], projects: Project[]) => {
  const roles = ['developer', 'tester', 'designer', 'analyst', 'manager'];
  const assignments: Assignment[] = [];
  
  users.forEach(user => {
    // 80% chance to have an assignment
    if (faker.datatype.boolean(0.8)) {
      const squad = getRandomItem(squads);
      const project = getRandomItem(projects);
      
      const startDate = faker.date.past();
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + faker.number.int({ min: 1, max: 12 }));
      
      const assignment: Assignment = {
        id: faker.string.uuid(),
        staffId: user.id,
        staffName: user.name,
        squadId: squad.id,
        squadName: squad.name,
        projectId: project.id,
        projectName: project.name,
        role: getRandomItem(roles),
        allocation: faker.number.int({ min: 25, max: 100 }),
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
        notes: faker.lorem.sentence(),
        createdAt: faker.date.past().toISOString(),
        updatedAt: faker.date.recent().toISOString(),
      };
      
      assignments.push(assignment);
    }
  });
  
  return assignments;
};

// Generate tickets
export const generateTickets = (users: User[], count: number) => {
  const categories = ['hardware', 'software', 'network', 'access', 'other'];
  const priorities = ['low', 'medium', 'high', 'urgent'];
  const statuses = ['open', 'in_progress', 'pending', 'resolved', 'closed'];
  
  const tickets: Ticket[] = [];
  
  for (let i = 0; i < count; i++) {
    const requesterId = getRandomItem(users).id;
    const assigneeId = faker.datatype.boolean(0.7) ? getRandomItem(users).id : undefined;
    
    const ticket: Ticket = {
      id: faker.string.uuid(),
      title: faker.lorem.sentence().slice(0, 50),
      description: faker.lorem.paragraphs(2),
      category: getRandomItem(categories) as any,
      priority: getRandomItem(priorities) as any,
      status: getRandomItem(statuses) as any,
      requesterId,
      assigneeId,
      createdAt: faker.date.past().toISOString(),
      updatedAt: faker.date.recent().toISOString(),
      dueDate: faker.datatype.boolean(0.6) ? formatDate(faker.date.future()) : undefined,
      comments: [],
      attachments: [],
    };
    
    // Add random comments
    const commentCount = faker.number.int({ min: 0, max: 5 });
    for (let j = 0; j < commentCount; j++) {
      const commentUser = getRandomItem(users);
      ticket.comments?.push({
        id: faker.string.uuid(),
        ticketId: ticket.id,
        userId: commentUser.id,
        userName: commentUser.name,
        content: faker.lorem.paragraph(),
        createdAt: faker.date.recent().toISOString(),
      });
    }
    
    tickets.push(ticket);
  }
  
  return tickets;
};

// Generate overtime requests
export const generateOvertimeRequests = (users: User[]) => {
  const overtimeRequests: OvertimeRequest[] = [];
  const now = new Date();
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(now.getDate() - 30);
  
  users.forEach(user => {
    // 60% chance to have overtime requests
    if (faker.datatype.boolean(0.6)) {
      // Generate 1-5 overtime requests per user
      const requestCount = faker.number.int({ min: 1, max: 5 });
      
      for (let i = 0; i < requestCount; i++) {
        const requestDate = randomDate(thirtyDaysAgo, now);
        const status = getRandomItem(['pending', 'approved', 'rejected']);
        
        const startTime = `${faker.number.int({ min: 17, max: 20 })}:00`;
        const endTime = `${faker.number.int({ min: 20, max: 23 })}:00`;
        const totalHours = faker.number.int({ min: 1, max: 5 });
        
        let approverId, approverName, approverNote;
        if (status !== 'pending') {
          const approver = getRandomItem(users.filter(u => u.role === 'supervisor' || u.role === 'admin'));
          approverId = approver.id;
          approverName = approver.name;
          
          if (status === 'rejected') {
            approverNote = faker.lorem.sentence();
          }
        }
        
        const overtimeRequest: OvertimeRequest = {
          id: faker.string.uuid(),
          userId: user.id,
          userName: user.name,
          date: formatDate(requestDate),
          startTime,
          endTime,
          totalHours,
          reason: faker.lorem.sentence(),
          status: status as any,
          approverNote,
          approverId,
          approverName,
          createdAt: faker.date.past().toISOString(),
          updatedAt: faker.date.recent().toISOString(),
        };
        
        overtimeRequests.push(overtimeRequest);
      }
    }
  });
  
  return overtimeRequests;
};

// Generate leave requests
export const generateLeaveRequests = (users: User[]) => {
  const leaveTypes: LeaveType[] = ['annual', 'sick', 'other', 'paid', 'unpaid', 'wfh'];
  const leaveRequests: LeaveRequest[] = [];
  
  users.forEach(user => {
    // 70% chance to have leave requests
    if (faker.datatype.boolean(0.7)) {
      // Generate 1-3 leave requests per user
      const requestCount = faker.number.int({ min: 1, max: 3 });
      
      for (let i = 0; i < requestCount; i++) {
        const status = getRandomItem(['pending', 'approved', 'rejected']) as 'pending' | 'approved' | 'rejected';
        const startDate = faker.date.soon();
        const totalDays = faker.number.int({ min: 1, max: 5 });
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + totalDays - 1);
        
        let approverId, approverName, approverNote;
        if (status !== 'pending') {
          const approver = getRandomItem(users.filter(u => u.role === 'supervisor' || u.role === 'admin'));
          approverId = approver.id;
          approverName = approver.name;
          
          if (status === 'rejected') {
            approverNote = faker.lorem.sentence();
          }
        }
        
        const leaveRequest: LeaveRequest = {
          id: faker.string.uuid(),
          userId: user.id,
          userName: user.name,
          type: getRandomItem(leaveTypes),
          startDate: formatDate(startDate),
          endDate: formatDate(endDate),
          totalDays,
          reason: faker.lorem.sentence(),
          status,
          approverNote,
          approverId,
          approverName,
          createdAt: faker.date.past().toISOString(),
          updatedAt: faker.date.recent().toISOString(),
        };
        
        leaveRequests.push(leaveRequest);
      }
    }
  });
  
  return leaveRequests;
};

// Generate reviews
export const generateReviews = (users: User[]) => {
  const reviews: OutsourceReview[] = [];
  
  // Get supervisors and admin users
  const reviewers = users.filter(user => user.role === 'supervisor' || user.role === 'admin');
  
  // Get employees to review
  const employees = users.filter(user => user.role === 'employee');
  
  employees.forEach(employee => {
    // 80% chance to have a review
    if (faker.datatype.boolean(0.8)) {
      const reviewer = getRandomItem(reviewers);
      
      const review: OutsourceReview = {
        id: faker.string.uuid(),
        reviewerId: reviewer.id,
        reviewerName: reviewer.name,
        revieweeId: employee.id,
        revieweeName: employee.name,
        reviewDate: formatDate(faker.date.recent()),
        period: `${faker.date.month()} - ${faker.date.month()}`,
        projectId: faker.string.uuid(),
        projectName: faker.company.buzzPhrase(),
        scores: {
          technical: faker.number.int({ min: 1, max: 5 }),
          communication: faker.number.int({ min: 1, max: 5 }),
          teamwork: faker.number.int({ min: 1, max: 5 }),
          leadership: faker.number.int({ min: 1, max: 5 }),
          overall: faker.number.int({ min: 1, max: 5 }),
        },
        strengths: Array(faker.number.int({ min: 1, max: 4 }))
          .fill('')
          .map(() => faker.lorem.sentence()),
        weaknesses: Array(faker.number.int({ min: 0, max: 3 }))
          .fill('')
          .map(() => faker.lorem.sentence()),
        comments: faker.lorem.paragraph(),
        createdAt: faker.date.past().toISOString(),
        updatedAt: faker.date.recent().toISOString(),
      };
      
      reviews.push(review);
    }
  });
  
  return reviews;
};

// Generate environment setups
export const generateEnvironmentSetups = (users: User[]) => {
  const environmentSetups: EnvironmentSetup[] = [];
  
  // Get IT support and admin users
  const requesters = users.filter(user => user.role === 'it_support' || user.role === 'admin');
  
  // Get employees for setups
  const employees = users.filter(user => user.role === 'employee');
  
  employees.forEach(employee => {
    // 60% chance to have an environment setup
    if (faker.datatype.boolean(0.6)) {
      const requester = getRandomItem(requesters);
      
      const items: SetupItem[] = [];
      const itemCount = faker.number.int({ min: 3, max: 10 });
      const categories = ['hardware', 'software', 'access', 'other'];
      const statuses = ['pending', 'in_progress', 'completed', 'blocked'];
      
      for (let i = 0; i < itemCount; i++) {
        const item: SetupItem = {
          id: faker.string.uuid(),
          setupId: '', // Will be filled after setup is created
          name: faker.lorem.words(3),
          description: faker.lorem.sentence(),
          category: getRandomItem(categories) as any,
          status: getRandomItem(statuses) as any,
          assigneeId: faker.datatype.boolean(0.7) ? getRandomItem(requesters).id : undefined,
          assigneeName: faker.datatype.boolean(0.7) ? getRandomItem(requesters).name : undefined,
          dueDate: faker.datatype.boolean(0.6) ? formatDate(faker.date.soon()) : undefined,
          notes: faker.datatype.boolean(0.5) ? faker.lorem.sentence() : undefined,
          createdAt: faker.date.past().toISOString(),
          updatedAt: faker.date.recent().toISOString(),
        };
        
        items.push(item);
      }
      
      const completedCount = items.filter(item => item.status === 'completed').length;
      
      const setup: EnvironmentSetup = {
        id: faker.string.uuid(),
        requesterId: requester.id,
        requesterName: requester.name,
        staffId: employee.id,
        staffName: employee.name,
        startDate: formatDate(faker.date.recent()),
        projectId: faker.string.uuid(),
        projectName: faker.company.buzzPhrase(),
        status: completedCount === items.length ? 'completed' : completedCount > 0 ? 'in_progress' : 'pending',
        items,
        completedCount,
        totalCount: items.length,
        createdAt: faker.date.past().toISOString(),
        updatedAt: faker.date.recent().toISOString(),
      };
      
      // Set setupId for each item
      setup.items = items.map(item => ({
        ...item,
        setupId: setup.id,
      }));
      
      environmentSetups.push(setup);
    }
  });
  
  return environmentSetups;
};

// Generate all mock data
export const generateAllMockData = () => {
  // Generate 30 users (including at least one of each role)
  const users = generateUsers(30);
  
  // Generate 8 squads
  const squads = generateSquads(8);
  
  // Generate 12 projects
  const projects = generateProjects(12);
  
  // Generate contracts (up to 5 per user)
  const contracts = generateContracts(users, 5);
  
  // Generate assignments
  const assignments = generateAssignments(users, squads, projects);
  
  // Generate 50 tickets
  const tickets = generateTickets(users, 50);
  
  // Generate overtime requests (last 30 days)
  const overtimeRequests = generateOvertimeRequests(users);
  
  // Generate leave requests
  const leaveRequests = generateLeaveRequests(users);
  
  // Generate reviews
  const reviews = generateReviews(users);
  
  // Generate environment setups
  const environmentSetups = generateEnvironmentSetups(users);
  
  return {
    users,
    squads,
    projects,
    contracts,
    assignments,
    tickets,
    overtimeRequests,
    leaveRequests,
    reviews,
    environmentSetups,
  };
};

// Function to initialize mock data in an API
export const initializeMockData = async () => {
  console.log('Generating mock data...');
  const mockData = generateAllMockData();
  console.log('Mock data generated:', {
    users: mockData.users.length,
    squads: mockData.squads.length,
    projects: mockData.projects.length,
    contracts: mockData.contracts.length,
    assignments: mockData.assignments.length,
    tickets: mockData.tickets.length,
    overtimeRequests: mockData.overtimeRequests.length,
    leaveRequests: mockData.leaveRequests.length,
    reviews: mockData.reviews.length,
    environmentSetups: mockData.environmentSetups.length,
  });
  
  return mockData;
};
