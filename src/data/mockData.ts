import { Ticket, User, Comment, Attachment, NotificationMessage } from "@/types";

export const users: User[] = [
  {
    id: "user-1",
    name: "Nguyễn Văn A",
    email: "nguyen.van.a@example.com",
    role: "requester",
    department: "Marketing",
    avatar: "https://i.pravatar.cc/150?img=1",
    isActive: true,
    createdAt: "2025-01-15T08:00:00Z",
    lastLogin: "2025-04-12T09:30:00Z",
  },
  {
    id: "user-2",
    name: "Trần Thị B",
    email: "tran.thi.b@example.com",
    role: "agent",
    department: "IT Support",
    avatar: "https://i.pravatar.cc/150?img=2",
    isActive: true,
    createdAt: "2025-01-20T08:00:00Z",
    lastLogin: "2025-04-11T14:15:00Z",
  },
  {
    id: "user-3",
    name: "Lê Văn C",
    email: "le.van.c@example.com",
    role: "approver",
    department: "Engineering",
    avatar: "https://i.pravatar.cc/150?img=3",
    isActive: true,
    createdAt: "2025-02-01T08:00:00Z",
    lastLogin: "2025-04-10T16:45:00Z",
  },
  {
    id: "user-4",
    name: "Phạm Thị D",
    email: "pham.thi.d@example.com",
    role: "supervisor",
    department: "HR",
    avatar: "https://i.pravatar.cc/150?img=4",
    isActive: true,
    createdAt: "2025-02-10T08:00:00Z",
    lastLogin: "2025-04-12T11:20:00Z",
  },
  {
    id: "user-5",
    name: "Hoàng Văn E",
    email: "hoang.van.e@example.com",
    role: "requester",
    department: "Sales",
    avatar: "https://i.pravatar.cc/150?img=5",
    isActive: true,
    createdAt: "2025-02-15T08:00:00Z",
    lastLogin: "2025-04-09T10:10:00Z",
  },
  {
    id: "user-6",
    name: "Trương Minh F",
    email: "truong.minh.f@example.com",
    role: "admin",
    department: "IT Management",
    avatar: "https://i.pravatar.cc/150?img=8",
    isActive: true,
    createdAt: "2025-01-05T08:00:00Z",
    lastLogin: "2025-04-12T15:30:00Z",
  },
  {
    id: "user-7",
    name: "Đỗ Thị G",
    email: "do.thi.g@example.com",
    role: "agent",
    department: "Customer Support",
    avatar: "https://i.pravatar.cc/150?img=9",
    isActive: false,
    createdAt: "2025-02-20T08:00:00Z",
    lastLogin: "2025-03-15T09:45:00Z",
  },
  {
    id: "user-8",
    name: "Võ Thanh H",
    email: "vo.thanh.h@example.com",
    role: "requester",
    department: "Finance",
    avatar: "https://i.pravatar.cc/150?img=12",
    isActive: true,
    createdAt: "2025-03-01T08:00:00Z",
    lastLogin: "2025-04-11T13:50:00Z",
  },
];

export const currentUser: User = users[5]; // Admin user for testing

export const comments: Comment[] = [
  {
    id: "comment-1",
    ticketId: "ticket-1",
    userId: "user-2",
    userName: "Trần Thị B",
    userAvatar: "https://i.pravatar.cc/150?img=2",
    content: "Đã tiếp nhận yêu cầu và đang tiến hành xử lý.",
    createdAt: "2025-04-11T08:30:00Z",
  },
  {
    id: "comment-2",
    ticketId: "ticket-1",
    userId: "user-1",
    userName: "Nguyễn Văn A",
    userAvatar: "https://i.pravatar.cc/150?img=1",
    content: "Cảm ơn bạn đã phản hồi. Tôi đang cần gấp quyền truy cập này.",
    createdAt: "2025-04-11T09:15:00Z",
  },
  {
    id: "comment-3",
    ticketId: "ticket-2",
    userId: "user-3",
    userName: "Lê Văn C",
    userAvatar: "https://i.pravatar.cc/150?img=3",
    content: "Bug này đã được ghi nhận trước đó. Đang phối hợp với team Dev để fix.",
    createdAt: "2025-04-10T14:20:00Z",
  },
];

export const attachments: Attachment[] = [
  {
    id: "attachment-1",
    ticketId: "ticket-2",
    fileName: "error_screenshot.png",
    fileSize: 1240000,
    fileType: "image/png",
    url: "/placeholder.svg",
    uploadedAt: "2025-04-10T13:45:00Z",
    uploadedBy: "user-5",
  },
  {
    id: "attachment-2",
    ticketId: "ticket-3",
    fileName: "training_request.pdf",
    fileSize: 2560000,
    fileType: "application/pdf",
    url: "/placeholder.svg",
    uploadedAt: "2025-04-09T10:30:00Z",
    uploadedBy: "user-1",
  },
];

export const tickets: Ticket[] = [
  {
    id: "ticket-1",
    title: "Cấu hình VPN cho nhân viên mới",
    description: "Cần setup VPN access cho nhân viên mới vào team Marketing từ ngày 15/04/2025",
    category: "tech_setup",
    status: "in_progress",
    priority: "medium",
    requester: users[0],
    assignedTo: users[1],
    approvers: [users[3]],
    tags: ["VPN", "Onboarding"],
    createdAt: "2025-04-11T08:00:00Z",
    updatedAt: "2025-04-11T09:30:00Z",
    comments: [comments[0], comments[1]],
  },
  {
    id: "ticket-2",
    title: "Bug trong module thanh toán",
    description: "Khi thực hiện thanh toán bằng thẻ Visa, hệ thống báo lỗi 'Invalid transaction'",
    category: "dev_issues",
    status: "pending",
    priority: "high",
    requester: users[4],
    assignedTo: users[2],
    tags: ["Bug", "Payment", "Critical"],
    createdAt: "2025-04-10T13:20:00Z",
    updatedAt: "2025-04-10T14:30:00Z",
    comments: [comments[2]],
    attachments: [attachments[0]],
  },
  {
    id: "ticket-3",
    title: "Đề xuất training về React Hooks",
    description: "Team chúng tôi cần được đào tạo thêm về React Hooks để áp dụng vào dự án mới",
    category: "mentoring",
    status: "approved",
    priority: "low",
    requester: users[0],
    assignedTo: users[3],
    approvers: [users[3]],
    tags: ["Training", "React", "Frontend"],
    createdAt: "2025-04-09T10:00:00Z",
    updatedAt: "2025-04-09T15:00:00Z",
    attachments: [attachments[1]],
  },
  {
    id: "ticket-4",
    title: "Yêu cầu xác nhận giờ làm thêm tháng 3/2025",
    description: "Cần phê duyệt 15 giờ làm thêm trong tháng 3/2025 cho dự án Alpha",
    category: "hr_matters",
    status: "resolved",
    priority: "medium",
    requester: users[4],
    assignedTo: users[3],
    approvers: [users[3]],
    tags: ["Overtime", "Approval"],
    createdAt: "2025-04-08T09:00:00Z",
    updatedAt: "2025-04-08T17:00:00Z",
  },
  {
    id: "ticket-5",
    title: "Cấp quyền truy cập GitHub repository",
    description: "Cần quyền Contributor cho repo 'frontend-main' để thực hiện công việc",
    category: "dev_issues",
    status: "pending",
    priority: "medium",
    requester: users[0],
    tags: ["Access Rights", "GitHub"],
    createdAt: "2025-04-12T10:30:00Z",
    updatedAt: "2025-04-12T10:30:00Z",
  },
];

export const notifications: NotificationMessage[] = [
  {
    id: "notif-1",
    userId: "user-1",
    title: "Ticket đã được phản hồi",
    message: "Trần Thị B đã phản hồi ticket 'Cấu hình VPN cho nhân viên mới'",
    isRead: false,
    createdAt: "2025-04-11T08:35:00Z",
    ticketId: "ticket-1",
  },
  {
    id: "notif-2",
    userId: "user-1",
    title: "Ticket được phê duyệt",
    message: "Phạm Thị D đã phê duyệt ticket 'Đề xuất training về React Hooks'",
    isRead: true,
    createdAt: "2025-04-09T15:10:00Z",
    ticketId: "ticket-3",
  },
  {
    id: "notif-3",
    userId: "user-2",
    title: "Ticket mới được giao",
    message: "Bạn được giao xử lý ticket 'Cấu hình VPN cho nhân viên mới'",
    isRead: false,
    createdAt: "2025-04-11T08:10:00Z",
    ticketId: "ticket-1",
  },
];

export const getCategoryLabel = (category: string): string => {
  switch (category) {
    case "tech_setup":
      return "Technical Setup";
    case "dev_issues":
      return "Development Issues";
    case "mentoring":
      return "Mentoring";
    case "hr_matters":
      return "HR Matters";
    default:
      return "Unknown";
  }
};

export const getCategoryVietnamese = (category: string): string => {
  switch (category) {
    case "tech_setup":
      return "Cài đặt kỹ thuật";
    case "dev_issues":
      return "Vấn đề phát triển";
    case "mentoring":
      return "Hỗ trợ / Đào tạo";
    case "hr_matters":
      return "Vấn đề nhân sự";
    default:
      return "Không xác định";
  }
};

export const getStatusLabel = (status: string): string => {
  switch (status) {
    case "pending":
      return "Pending";
    case "in_progress":
      return "In Progress";
    case "resolved":
      return "Resolved";
    case "rejected":
      return "Rejected";
    case "approved":
      return "Approved";
    default:
      return "Unknown";
  }
};

export const getStatusVietnamese = (status: string): string => {
  switch (status) {
    case "pending":
      return "Chờ xử lý";
    case "in_progress":
      return "Đang xử lý";
    case "resolved":
      return "Đã giải quyết";
    case "rejected":
      return "Từ chối";
    case "approved":
      return "Đã duyệt";
    default:
      return "Không xác định";
  }
};

export const getPriorityLabel = (priority: string): string => {
  switch (priority) {
    case "low":
      return "Low";
    case "medium":
      return "Medium";
    case "high":
      return "High";
    default:
      return "Unknown";
  }
};

export const getPriorityVietnamese = (priority: string): string => {
  switch (priority) {
    case "low":
      return "Thấp";
    case "medium":
      return "Trung bình";
    case "high":
      return "Cao";
    default:
      return "Không xác định";
  }
};
