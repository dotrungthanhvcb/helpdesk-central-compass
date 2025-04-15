
import { User, Ticket, TicketStatus, TicketCategory, TicketPriority, OvertimeRequest, OutsourceReview, EnvironmentSetup, LeaveRequest } from "@/types";
import { Contract, Squad, Project, Assignment } from "@/types/contracts";
import { format, addDays, subDays, differenceInDays } from "date-fns";

// Helper functions
const randomElement = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const randomDate = (start: Date, end: Date): Date => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const formatDate = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

const formatTime = (hours: number, minutes: number): string => {
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

const generateName = (): { firstName: string, lastName: string, fullName: string } => {
  const firstNames = [
    'Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Huỳnh', 'Phan', 'Vũ', 'Võ', 'Đặng',
    'Bùi', 'Đỗ', 'Hồ', 'Ngô', 'Dương', 'Lý'
  ];
  
  const lastNames = [
    'An', 'Bình', 'Cường', 'Dũng', 'Đạt', 'Hùng', 'Huy', 'Khoa', 'Minh', 'Nam', 
    'Phong', 'Quân', 'Tâm', 'Thành', 'Tuấn', 'Việt', 'Vũ', 'Anh', 'Hương', 'Lan', 
    'Mai', 'Ngọc', 'Nhung', 'Thảo', 'Trang', 'Trinh', 'Uyên', 'Xuân', 'Yến'
  ];
  
  const firstName = randomElement(firstNames);
  const lastName = randomElement(lastNames);
  const fullName = `${firstName} Văn ${lastName}`;
  
  return { firstName, lastName, fullName };
};

const generateEmail = (name: string): string => {
  const cleanedName = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, '.');
  
  const domains = ['vietcombank.com.vn', 'vcb.com.vn', 'example.com', 'mail.com'];
  return `${cleanedName}@${randomElement(domains)}`;
};

// Generate user data
const generateUsers = (count: number): User[] => {
  const roles: Array<'admin' | 'supervisor' | 'agent' | 'approver' | 'requester'> = [
    'admin', 'supervisor', 'agent', 'approver', 'requester'
  ];
  
  const departments = [
    'IT', 'HR', 'Finance', 'Operations', 'Marketing', 'Development', 'Testing',
    'DevOps', 'Support', 'Security'
  ];
  
  const positions = [
    'Manager', 'Team Lead', 'Senior Developer', 'Developer', 'Junior Developer',
    'Analyst', 'Specialist', 'Administrator', 'Coordinator', 'Consultant'
  ];
  
  const users: User[] = [];
  
  for (let i = 0; i < count; i++) {
    const { fullName } = generateName();
    const email = generateEmail(fullName);
    
    const user: User = {
      id: `user-${i + 1}`,
      name: fullName,
      email,
      password: 'password',
      role: randomElement(roles),
      department: randomElement(departments),
      position: randomElement(positions),
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=random`,
      isActive: Math.random() > 0.1, // 90% active
      createdAt: formatDate(subDays(new Date(), randomInt(30, 600))),
      lastLogin: formatDate(subDays(new Date(), randomInt(0, 30))),
      phone: `+84${randomInt(9000000, 9999999)}`,
      address: `${randomInt(1, 100)} ${randomElement(['Nguyễn Huệ', 'Lê Lợi', 'Trần Hưng Đạo', 'Điện Biên Phủ', 'Lê Duẩn', 'Phạm Ngọc Thạch'])} Street, ${randomElement(['Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng', 'Cần Thơ', 'Hải Phòng'])}`,
    };
    
    users.push(user);
  }
  
  return users;
};

// Generate ticket data
const generateTickets = (users: User[], count: number): Ticket[] => {
  const statuses: TicketStatus[] = ['open', 'in progress', 'resolved', 'closed', 'pending', 'approved', 'rejected'];
  const categories: TicketCategory[] = ['tech_setup', 'dev_issues', 'mentoring', 'hr_matters'];
  const priorities: TicketPriority[] = ['low', 'medium', 'high', 'urgent'];
  
  const ticketTitles = [
    'Cần hỗ trợ cài đặt môi trường DEV',
    'Yêu cầu cấp tài khoản truy cập hệ thống',
    'Lỗi kết nối VPN', 
    'Không thể truy cập Jenkins',
    'Cần góp ý về thiết kế API',
    'Vấn đề hiệu suất React app',
    'Yêu cầu mở quyền truy cập DB',
    'Lỗi xác thực 2FA',
    'Cần mentor về unit testing',
    'Đề xuất cải tiến quy trình CI/CD',
    'Phản ánh lỗi hiển thị trang dashboard',
    'Yêu cầu xem xét code frontend',
    'Lỗi tích hợp với API thanh toán',
    'Vấn đề hiệu suất query Database',
    'Yêu cầu khóa tài khoản outsource'
  ];
  
  const tickets: Ticket[] = [];
  
  for (let i = 0; i < count; i++) {
    const requester = randomElement(users);
    const assignee = randomElement(users);
    const createdAt = formatDate(subDays(new Date(), randomInt(0, 90)));
    
    const ticket: Ticket = {
      id: `ticket-${i + 1}`,
      title: randomElement(ticketTitles),
      description: `Mô tả chi tiết về vấn đề: ${randomElement(ticketTitles)} cần được giải quyết gấp.`,
      status: randomElement(statuses),
      priority: randomElement(priorities),
      category: randomElement(categories),
      requester,
      assigneeId: assignee.id,
      assigneeName: assignee.name,
      createdAt,
      updatedAt: formatDate(randomDate(new Date(createdAt), new Date())),
      comments: [],
      attachments: [],
      tags: ['outsource', 'support', 'technical'],
    };
    
    // Add random comments
    if (Math.random() > 0.5) {
      const commentCount = randomInt(1, 5);
      for (let j = 0; j < commentCount; j++) {
        const commentUser = randomElement(users);
        ticket.comments?.push({
          id: `comment-${i}-${j}`,
          ticketId: ticket.id,
          userId: commentUser.id,
          userName: commentUser.name,
          userAvatar: commentUser.avatar || '',
          content: `Comment về ticket này: ${Math.random() > 0.5 ? 'Đã xử lý theo yêu cầu.' : 'Cần thêm thông tin để xử lý.'}`,
          createdAt: formatDate(randomDate(new Date(createdAt), new Date())),
        });
      }
    }
    
    tickets.push(ticket);
  }
  
  return tickets;
};

// Generate contract data
const generateContracts = (users: User[], count: number): Contract[] => {
  const contractTypes = ['outsource', 'service', 'project', 'maintenance'];
  const contractStatuses = ['draft', 'active', 'expired', 'terminated'];
  const paymentTerms = ['monthly', 'quarterly', 'milestone', 'completion'];
  
  const contracts: Contract[] = [];
  
  for (let i = 0; i < count; i++) {
    const staff = randomElement(users);
    const startDate = formatDate(subDays(new Date(), randomInt(10, 365)));
    const endDate = formatDate(addDays(new Date(startDate), randomInt(90, 730)));
    
    const contract: Contract = {
      id: `contract-${i + 1}`,
      contractNumber: `VCB-OS-${2023 + randomInt(0, 2)}-${(i + 1).toString().padStart(4, '0')}`,
      staffId: staff.id,
      staffName: staff.name,
      contractType: randomElement(contractTypes),
      startDate,
      endDate,
      status: randomElement(contractStatuses),
      value: randomInt(100, 500) * 1000000,
      currency: 'VND',
      paymentTerms: randomElement(paymentTerms),
      createdAt: formatDate(subDays(new Date(startDate), randomInt(1, 30))),
      updatedAt: formatDate(subDays(new Date(), randomInt(0, 30))),
      documents: [],
    };
    
    contracts.push(contract);
  }
  
  return contracts;
};

// Generate squads data
const generateSquads = (count: number): Squad[] => {
  const squadNames = [
    'Core Banking', 'Digital Banking', 'Payment Gateway', 'Mobile Banking', 
    'Internet Banking', 'API Integration', 'Security', 'Data Analytics',
    'Frontend', 'Backend', 'DevOps', 'QA'
  ];
  
  const squads: Squad[] = [];
  
  for (let i = 0; i < count; i++) {
    const squad: Squad = {
      id: `squad-${i + 1}`,
      name: i < squadNames.length ? squadNames[i] : `Squad ${i + 1}`,
      description: `Đội nhóm phát triển và hỗ trợ cho hệ thống ${i < squadNames.length ? squadNames[i] : `Squad ${i + 1}`}`,
      createdAt: formatDate(subDays(new Date(), randomInt(30, 365))),
    };
    
    squads.push(squad);
  }
  
  return squads;
};

// Generate projects data
const generateProjects = (count: number): Project[] => {
  const projectNames = [
    'Nâng cấp Core Banking', 'VCB Digibank 2.0', 'VCB Pay Gateway', 
    'Ứng dụng Mobile Banking mới', 'Hệ thống quản lý tài khoản',
    'API Ngân hàng mở', 'Bảo mật đa lớp', 'Hệ thống dashboard phân tích',
    'Cổng thanh toán liên ngân hàng', 'Hệ thống xác thực sinh trắc học'
  ];
  
  const projectStatuses = ['planning', 'development', 'testing', 'deployed', 'maintenance'];
  
  const projects: Project[] = [];
  
  for (let i = 0; i < count; i++) {
    const startDate = formatDate(subDays(new Date(), randomInt(10, 365)));
    const endDate = formatDate(addDays(new Date(startDate), randomInt(90, 730)));
    
    const project: Project = {
      id: `project-${i + 1}`,
      name: i < projectNames.length ? projectNames[i] : `Project ${i + 1}`,
      description: `Dự án ${i < projectNames.length ? projectNames[i] : `Project ${i + 1}`} của ngân hàng số VCB`,
      startDate,
      endDate,
      status: randomElement(projectStatuses),
      createdAt: formatDate(subDays(new Date(startDate), randomInt(1, 30))),
    };
    
    projects.push(project);
  }
  
  return projects;
};

// Generate assignments data
const generateAssignments = (users: User[], squads: Squad[], projects: Project[], count: number): Assignment[] => {
  const assignments: Assignment[] = [];
  
  for (let i = 0; i < count; i++) {
    const staff = randomElement(users);
    const squad = Math.random() > 0.2 ? randomElement(squads) : undefined; // 80% have squad
    const project = Math.random() > 0.2 ? randomElement(projects) : undefined; // 80% have project
    
    const startDate = formatDate(subDays(new Date(), randomInt(10, 180)));
    const endDate = formatDate(addDays(new Date(startDate), randomInt(30, 365)));
    
    const assignment: Assignment = {
      id: `assignment-${i + 1}`,
      staffId: staff.id,
      staffName: staff.name,
      role: randomElement(['developer', 'tester', 'analyst', 'designer', 'devops']),
      startDate,
      endDate,
      squadId: squad?.id,
      squadName: squad?.name,
      projectId: project?.id,
      projectName: project?.name,
      allocation: randomInt(25, 100),
      status: randomElement(['active', 'completed', 'planned']),
      createdAt: formatDate(subDays(new Date(startDate), randomInt(1, 30))),
      updatedAt: formatDate(subDays(new Date(), randomInt(0, 30))),
    };
    
    assignments.push(assignment);
  }
  
  return assignments;
};

// Generate overtime requests
const generateOvertimeRequests = (users: User[], count: number): OvertimeRequest[] => {
  const overtimeRequests: OvertimeRequest[] = [];
  
  for (let i = 0; i < count; i++) {
    const user = randomElement(users);
    const date = formatDate(subDays(new Date(), randomInt(1, 30)));
    const startHour = randomInt(17, 19);
    const endHour = randomInt(startHour + 2, 23);
    const totalHours = endHour - startHour;
    
    const overtimeRequest: OvertimeRequest = {
      id: `ot-${i + 1}`,
      userId: user.id,
      userName: user.name,
      date,
      startTime: formatTime(startHour, 0),
      endTime: formatTime(endHour, 0),
      totalHours,
      reason: `Công việc khẩn cấp: ${randomElement(['Chuẩn bị triển khai', 'Xử lý sự cố', 'Hỗ trợ release', 'Testing gấp', 'Họp với client'])}`,
      status: randomElement(['pending', 'approved', 'rejected']),
      createdAt: formatDate(subDays(new Date(date), randomInt(1, 5))),
      updatedAt: formatDate(subDays(new Date(date), randomInt(0, 5))),
      reviewerFeedback: Math.random() > 0.7 ? 'Đồng ý với yêu cầu OT này.' : undefined,
      comment: Math.random() > 0.7 ? 'Ghi chú thêm về yêu cầu OT.' : undefined,
    };
    
    overtimeRequests.push(overtimeRequest);
  }
  
  return overtimeRequests;
};

// Generate leave requests
const generateLeaveRequests = (users: User[], count: number): LeaveRequest[] => {
  const leaveRequests: LeaveRequest[] = [];
  
  for (let i = 0; i < count; i++) {
    const user = randomElement(users);
    const startDate = formatDate(subDays(new Date(), randomInt(1, 60)));
    const totalDays = randomInt(1, 5);
    const endDate = formatDate(addDays(new Date(startDate), totalDays - 1));
    
    const leaveRequest: LeaveRequest = {
      id: `leave-${i + 1}`,
      userId: user.id,
      userName: user.name,
      type: randomElement(['annual', 'sick', 'other']),
      startDate,
      endDate,
      totalDays,
      reason: `${randomElement(['Nghỉ phép năm', 'Bị ốm cần nghỉ ngơi', 'Việc gia đình', 'Khám sức khỏe', 'Đi công tác'])}`,
      status: randomElement(['pending', 'approved', 'rejected']),
      createdAt: formatDate(subDays(new Date(startDate), randomInt(1, 10))),
      updatedAt: formatDate(subDays(new Date(startDate), randomInt(0, 10))),
      approverNote: Math.random() > 0.7 ? 'Ghi chú từ người phê duyệt.' : undefined,
    };
    
    leaveRequests.push(leaveRequest);
  }
  
  return leaveRequests;
};

// Generate reviews
const generateReviews = (users: User[], count: number): OutsourceReview[] => {
  const reviews: OutsourceReview[] = [];
  
  for (let i = 0; i < count; i++) {
    const reviewer = randomElement(users.filter(u => u.role === 'supervisor' || u.role === 'admin'));
    const reviewee = randomElement(users.filter(u => u.id !== reviewer.id));
    const reviewDate = formatDate(subDays(new Date(), randomInt(1, 90)));
    
    const getRandomScore = (): 1 | 2 | 3 | 4 | 5 => {
      return randomInt(1, 5) as 1 | 2 | 3 | 4 | 5;
    };
    
    const review: OutsourceReview = {
      id: `review-${i + 1}`,
      revieweeId: reviewee.id,
      revieweeName: reviewee.name,
      reviewerId: reviewer.id,
      reviewerName: reviewer.name,
      projectId: `project-${randomInt(1, 10)}`,
      projectName: `Project ${randomInt(1, 10)}`,
      reviewDate,
      criteria: {
        technicalQuality: getRandomScore(),
        professionalAttitude: getRandomScore(),
        communication: getRandomScore(),
        ruleCompliance: getRandomScore(),
        initiative: getRandomScore(),
      },
      strengths: 'Điểm mạnh: Kỹ năng kỹ thuật tốt, giải quyết vấn đề hiệu quả, làm việc nhóm tốt.',
      areasToImprove: 'Cần cải thiện: Kỹ năng giao tiếp, tuân thủ deadline chặt chẽ hơn.',
      createdAt: reviewDate,
      updatedAt: reviewDate,
    };
    
    reviews.push(review);
  }
  
  return reviews;
};

// Generate environment setups
const generateEnvironmentSetups = (users: User[], count: number): EnvironmentSetup[] => {
  const environmentSetups: EnvironmentSetup[] = [];
  
  for (let i = 0; i < count; i++) {
    const employee = randomElement(users);
    const responsible = randomElement(users.filter(u => u.role === 'agent' || u.role === 'admin'));
    const requestDate = formatDate(subDays(new Date(), randomInt(1, 90)));
    
    const setup: EnvironmentSetup = {
      id: `setup-${i + 1}`,
      employeeId: employee.id,
      employeeName: employee.name,
      deviceType: randomElement(['laptop', 'pc', 'vm', 'byod']),
      setupLocation: randomElement(['onsite', 'remote']),
      requestDate,
      responsibleId: responsible.id,
      responsibleName: responsible.name,
      status: randomElement(['open', 'in progress', 'resolved', 'closed']),
      notes: 'Ghi chú về thiết lập môi trường làm việc cho nhân viên.',
      items: [],
      completionDate: Math.random() > 0.5 ? formatDate(addDays(new Date(requestDate), randomInt(1, 10))) : undefined,
      createdAt: requestDate,
      updatedAt: formatDate(subDays(new Date(), randomInt(0, 30))),
    };
    
    // Generate setup items
    const itemCount = randomInt(3, 8);
    for (let j = 0; j < itemCount; j++) {
      setup.items.push({
        id: `item-${i}-${j}`,
        title: randomElement([
          'Cấp laptop', 'Cài đặt VPN', 'Thiết lập email', 'Cài đặt IDE',
          'Cấu hình Git', 'Cấp SSH key', 'Cài đặt Docker', 'Thiết lập môi trường dev',
          'Cài đặt Antivirus', 'Thiết lập tài khoản NDO'
        ]),
        category: randomElement(['device', 'mdm', 'os', 'software', 'account']),
        status: randomElement(['pending', 'in_progress', 'done', 'blocked']),
        createdAt: requestDate,
        updatedAt: formatDate(subDays(new Date(), randomInt(0, 30))),
      });
    }
    
    environmentSetups.push(setup);
  }
  
  return environmentSetups;
};

// Main generator function
export const generateMockData = () => {
  // Generate users (20+)
  const users = generateUsers(25);
  
  // Generate tickets (random per user)
  const tickets = generateTickets(users, 50);
  
  // Generate contracts (5 per person)
  const contracts = generateContracts(users, users.length * 5);
  
  // Generate squads and projects
  const squads = generateSquads(10);
  const projects = generateProjects(10);
  
  // Generate assignments
  const assignments = generateAssignments(users, squads, projects, users.length * 2);
  
  // Generate overtime requests
  const overtimeRequests = generateOvertimeRequests(users, 30);
  
  // Generate leave requests
  const leaveRequests = generateLeaveRequests(users, 30);
  
  // Generate reviews
  const reviews = generateReviews(users, 40);
  
  // Generate environment setups
  const environmentSetups = generateEnvironmentSetups(users, 15);
  
  return {
    users,
    tickets,
    contracts,
    squads,
    projects,
    assignments,
    overtimeRequests,
    leaveRequests,
    reviews,
    environmentSetups
  };
};

// Generate and export mock data for testing 
export const mockData = generateMockData();
