import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  TicketIcon, 
  PlusIcon, 
  SearchIcon, 
  FilterIcon,
  SortAscIcon,
  SortDescIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApp } from "@/contexts/AppContext";
import TicketCard from "@/components/TicketCard";
import { TicketCategory, TicketPriority, TicketStatus, Ticket } from "@/types";

const TicketList = () => {
  const { tickets } = useApp();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<TicketStatus[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<TicketCategory[]>([]);
  const [priorityFilter, setPriorityFilter] = useState<TicketPriority[]>([]);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const filteredTickets = tickets.filter((ticket) => {
    // Text search
    const matchesSearch = 
      searchQuery === "" || 
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Status filter
    const matchesStatus = 
      statusFilter.length === 0 || 
      statusFilter.includes(ticket.status);
    
    // Category filter
    const matchesCategory = 
      categoryFilter.length === 0 || 
      categoryFilter.includes(ticket.category);
    
    // Priority filter
    const matchesPriority = 
      priorityFilter.length === 0 || 
      priorityFilter.includes(ticket.priority);
    
    return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
  });

  // Sort tickets by creation date
  const sortedTickets = [...filteredTickets].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  const pendingTickets = sortedTickets.filter((ticket) => ticket.status === "pending");
  const inProgressTickets = sortedTickets.filter((ticket) => ticket.status === "in progress");
  const resolvedTickets = sortedTickets.filter((ticket) => 
    ticket.status === "resolved" || ticket.status === "approved"
  );
  const rejectedTickets = sortedTickets.filter((ticket) => ticket.status === "rejected");

  const handleCreateTicket = () => {
    navigate("/tickets/new");
  };

  const handleTicketClick = (id: string) => {
    navigate(`/tickets/${id}`);
  };

  const toggleStatusFilter = (status: TicketStatus) => {
    setStatusFilter((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const toggleCategoryFilter = (category: TicketCategory) => {
    setCategoryFilter((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const togglePriorityFilter = (priority: TicketPriority) => {
    setPriorityFilter((prev) =>
      prev.includes(priority)
        ? prev.filter((p) => p !== priority)
        : [...prev, priority]
    );
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter([]);
    setCategoryFilter([]);
    setPriorityFilter([]);
  };

  const TabHeader: React.FC<{ title: string; count: number; icon: React.ReactNode }> = ({ 
    title, 
    count, 
    icon 
  }) => (
    <div className="flex items-center">
      {icon}
      <span className="ml-2">{title}</span>
      <span className="ml-2 bg-gray-200 text-gray-700 text-xs font-medium rounded-full py-0.5 px-2">
        {count}
      </span>
    </div>
  );

  const renderTicketGrid = (tickets: Ticket[]) => {
    if (tickets.length === 0) {
      return (
        <div className="text-center py-10">
          <TicketIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">Không tìm thấy yêu cầu nào</h3>
          <p className="mt-1 text-sm text-gray-500">
            Thử thay đổi tìm kiếm hoặc bộ lọc của bạn
          </p>
          <div className="mt-6">
            <Button onClick={clearFilters} variant="outline" className="mr-2">
              Xóa bộ lọc
            </Button>
            <Button onClick={handleCreateTicket}>
              Tạo yêu cầu mới
            </Button>
          </div>
        </div>
      );
    }
    
    return (
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {tickets.map((ticket) => (
          <TicketCard
            key={ticket.id}
            ticket={ticket}
            onClick={() => handleTicketClick(ticket.id)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Danh sách yêu cầu hỗ trợ</h1>
          <p className="text-muted-foreground">
            Quản lý và theo dõi tất cả các yêu cầu hỗ trợ
          </p>
        </div>
        <Button onClick={handleCreateTicket} className="bg-app-purple hover:bg-app-purple-dark">
          <PlusIcon className="mr-2 h-4 w-4" />
          Tạo yêu cầu mới
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tìm kiếm và lọc</CardTitle>
          <CardDescription>
            Tìm kiếm và lọc yêu cầu theo trạng thái, phân loại, và mức độ ưu tiên
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm theo tiêu đề hoặc mô tả..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <FilterIcon className="h-4 w-4" />
                    <span>Lọc</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <div className="px-2 py-1.5 text-sm font-semibold">Trạng thái</div>
                  <DropdownMenuCheckboxItem
                    checked={statusFilter.includes("pending")}
                    onCheckedChange={() => toggleStatusFilter("pending")}
                  >
                    Chờ xử lý
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={statusFilter.includes("in progress")}
                    onCheckedChange={() => toggleStatusFilter("in progress")}
                  >
                    Đang xử lý
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={statusFilter.includes("resolved")}
                    onCheckedChange={() => toggleStatusFilter("resolved")}
                  >
                    Đã giải quyết
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={statusFilter.includes("rejected")}
                    onCheckedChange={() => toggleStatusFilter("rejected")}
                  >
                    Từ chối
                  </DropdownMenuCheckboxItem>
                  
                  <DropdownMenuSeparator />
                  <div className="px-2 py-1.5 text-sm font-semibold">Phân loại</div>
                  <DropdownMenuCheckboxItem
                    checked={categoryFilter.includes("tech_setup")}
                    onCheckedChange={() => toggleCategoryFilter("tech_setup")}
                  >
                    Technical Setup
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={categoryFilter.includes("dev_issues")}
                    onCheckedChange={() => toggleCategoryFilter("dev_issues")}
                  >
                    Development Issues
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={categoryFilter.includes("mentoring")}
                    onCheckedChange={() => toggleCategoryFilter("mentoring")}
                  >
                    Mentoring
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={categoryFilter.includes("hr_matters")}
                    onCheckedChange={() => toggleCategoryFilter("hr_matters")}
                  >
                    HR Matters
                  </DropdownMenuCheckboxItem>
                  
                  <DropdownMenuSeparator />
                  <div className="px-2 py-1.5 text-sm font-semibold">Mức độ ưu tiên</div>
                  <DropdownMenuCheckboxItem
                    checked={priorityFilter.includes("low")}
                    onCheckedChange={() => togglePriorityFilter("low")}
                  >
                    Thấp
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={priorityFilter.includes("medium")}
                    onCheckedChange={() => togglePriorityFilter("medium")}
                  >
                    Trung bình
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={priorityFilter.includes("high")}
                    onCheckedChange={() => togglePriorityFilter("high")}
                  >
                    Cao
                  </DropdownMenuCheckboxItem>
                  
                  <DropdownMenuSeparator />
                  <div className="px-2 py-1.5">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={clearFilters}
                    >
                      Xóa tất cả bộ lọc
                    </Button>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button variant="outline" size="icon" onClick={toggleSortOrder}>
                {sortOrder === "asc" ? <SortAscIcon className="h-4 w-4" /> : <SortDescIcon className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="w-full bg-gray-100 p-1 grid grid-cols-5">
          <TabsTrigger value="all">
            <TabHeader 
              title="Tất cả" 
              count={sortedTickets.length} 
              icon={<TicketIcon className="h-4 w-4" />} 
            />
          </TabsTrigger>
          <TabsTrigger value="pending">
            <TabHeader 
              title="Chờ xử lý" 
              count={pendingTickets.length}
              icon={<ClockIcon className="h-4 w-4 text-amber-500" />}
            />
          </TabsTrigger>
          <TabsTrigger value="in-progress">
            <TabHeader 
              title="Đang xử lý" 
              count={inProgressTickets.length}
              icon={<TicketIcon className="h-4 w-4 text-blue-500" />}
            />
          </TabsTrigger>
          <TabsTrigger value="resolved">
            <TabHeader 
              title="Đã giải quyết" 
              count={resolvedTickets.length}
              icon={<CheckCircleIcon className="h-4 w-4 text-green-500" />}
            />
          </TabsTrigger>
          <TabsTrigger value="rejected">
            <TabHeader 
              title="Từ chối" 
              count={rejectedTickets.length}
              icon={<XCircleIcon className="h-4 w-4 text-red-500" />}
            />
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          {renderTicketGrid(sortedTickets)}
        </TabsContent>
        
        <TabsContent value="pending" className="space-y-4">
          {renderTicketGrid(pendingTickets)}
        </TabsContent>
        
        <TabsContent value="in-progress" className="space-y-4">
          {renderTicketGrid(inProgressTickets)}
        </TabsContent>
        
        <TabsContent value="resolved" className="space-y-4">
          {renderTicketGrid(resolvedTickets)}
        </TabsContent>
        
        <TabsContent value="rejected" className="space-y-4">
          {renderTicketGrid(rejectedTickets)}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TicketList;
