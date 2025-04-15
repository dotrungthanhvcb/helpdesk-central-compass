import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { formatDistanceToNow, format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowLeftIcon,
  ArrowUpIcon,
  CheckIcon,
  ClockIcon,
  MoreVerticalIcon,
  PaperclipIcon,
  SendIcon,
  UserIcon,
  XIcon,
} from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import StatusBadge from "@/components/StatusBadge";
import CategoryBadge from "@/components/CategoryBadge";
import PriorityBadge from "@/components/PriorityBadge";

const TicketDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { tickets, updateTicket, addComment, user } = useApp();
  const navigate = useNavigate();
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const ticket = tickets.find((t) => t.id === id);

  if (!ticket) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <h1 className="text-2xl font-bold">Ticket not found</h1>
        <p className="text-muted-foreground mb-4">
          The ticket you're looking for doesn't exist or has been deleted.
        </p>
        <Button onClick={() => navigate("/tickets")}>
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Back to Tickets
        </Button>
      </div>
    );
  }

  const handleSubmitComment = () => {
    if (!comment.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      addComment(ticket.id, comment);
      setComment("");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = (newStatus: string) => {
    updateTicket(ticket.id, { status: newStatus as any });
  };

  const canApprove = user?.role === "approver" || user?.role === "supervisor";
  const canReject = user?.role === "approver" || user?.role === "supervisor";
  const canAssign = user?.role === "agent" || user?.role === "supervisor";
  const isAssigned = !!ticket.assigneeId;
  const isCurrentUserAssigned = ticket.assigneeId === user?.id;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeftIcon className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold line-clamp-1">{ticket.title}</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Ticket #{ticket.id.split('-')[1]}</span>
            <span>•</span>
            <span>
              Tạo {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true, locale: vi })}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between">
                <div className="space-y-1">
                  <CardTitle>Chi tiết yêu cầu</CardTitle>
                  <CardDescription>
                    Tạo bởi {ticket.requester.name} vào{" "}
                    {format(new Date(ticket.createdAt), "dd/MM/yyyy HH:mm")}
                  </CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVerticalIcon className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Chỉnh sửa</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">Xóa</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <StatusBadge status={ticket.status} />
                <CategoryBadge category={ticket.category} />
                <PriorityBadge priority={ticket.priority} />
              </div>
              <div className="py-2">
                <p className="whitespace-pre-line">{ticket.description}</p>
              </div>
              {ticket.attachments && ticket.attachments.length > 0 && (
                <div className="border rounded-md p-3">
                  <h3 className="text-sm font-medium mb-2 flex items-center">
                    <PaperclipIcon className="h-4 w-4 mr-2" />
                    Tài liệu đính kèm ({ticket.attachments.length})
                  </h3>
                  <ul className="space-y-2">
                    {ticket.attachments.map((attachment) => (
                      <li key={attachment.id} className="text-sm">
                        <a
                          href={attachment.url}
                          className="text-blue-600 hover:underline flex items-center"
                        >
                          <span className="truncate">{attachment.fileName}</span>
                          <span className="text-gray-500 ml-2">
                            ({(attachment.fileSize / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Hoạt động và phản hồi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {ticket.comments && ticket.comments.length > 0 ? (
                <div className="space-y-4">
                  {ticket.comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={comment.userAvatar} alt={comment.userName} />
                        <AvatarFallback>{comment.userName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{comment.userName}</span>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(comment.createdAt), {
                              addSuffix: true,
                              locale: vi,
                            })}
                          </span>
                        </div>
                        <p className="text-sm">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  Chưa có phản hồi nào cho yêu cầu này
                </div>
              )}
              <Separator />
              <div className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <Textarea
                    placeholder="Thêm phản hồi của bạn..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={3}
                  />
                  <div className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="gap-1"
                    >
                      <PaperclipIcon className="h-4 w-4" />
                      <span>Đính kèm</span>
                    </Button>
                    <Button
                      onClick={handleSubmitComment}
                      disabled={!comment.trim() || isSubmitting}
                      size="sm"
                      className="gap-1"
                    >
                      <SendIcon className="h-4 w-4" />
                      <span>Gửi</span>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Thao tác</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {ticket.status === "pending" && (
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleStatusChange("in progress")}
                  disabled={!isCurrentUserAssigned && isAssigned}
                >
                  <ArrowUpIcon className="mr-2 h-4 w-4" />
                  <span>Start Processing</span>
                </Button>
              )}
              
              {ticket.status === "in progress" && canApprove && (
                <Button
                  variant="outline"
                  className="w-full justify-start text-green-600"
                  onClick={() => handleStatusChange("resolved")}
                >
                  <CheckIcon className="mr-2 h-4 w-4" />
                  <span>Mark as Resolved</span>
                </Button>
              )}
              
              {(ticket.status === "pending" || ticket.status === "in progress") && canReject && (
                <Button
                  variant="outline"
                  className="w-full justify-start text-red-600"
                  onClick={() => handleStatusChange("rejected")}
                >
                  <XIcon className="mr-2 h-4 w-4" />
                  <span>Reject</span>
                </Button>
              )}
              
              {!isAssigned && canAssign && (
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => updateTicket(ticket.id, { assigneeId: user?.id })}
                >
                  <UserIcon className="mr-2 h-4 w-4" />
                  <span>Assign to Me</span>
                </Button>
              )}
              
              {ticket.status === "resolved" || ticket.status === "rejected" ? (
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleStatusChange("pending")}
                >
                  <ClockIcon className="mr-2 h-4 w-4" />
                  <span>Reopen Ticket</span>
                </Button>
              ) : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Chi tiết</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Người yêu cầu</h3>
                <div className="flex items-center">
                  <Avatar className="h-6 w-6 mr-2">
                    <AvatarImage src={ticket.requester.avatar} alt={ticket.requester.name} />
                    <AvatarFallback>{ticket.requester.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{ticket.requester.name}</p>
                    <p className="text-xs text-muted-foreground">{ticket.requester.department}</p>
                  </div>
                </div>
              </div>
              
              {ticket.assignedTo && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Người xử lý</h3>
                  <div className="flex items-center">
                    <Avatar className="h-6 w-6 mr-2">
                      <AvatarImage src={ticket.assignedTo.avatar} alt={ticket.assignedTo.name} />
                      <AvatarFallback>{ticket.assignedTo.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{ticket.assignedTo.name}</p>
                      <p className="text-xs text-muted-foreground">{ticket.assignedTo.department}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {ticket.tags && ticket.tags.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Tags</h3>
                  <div className="flex flex-wrap gap-1">
                    {ticket.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Thời gian</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tạo lúc:</span>
                    <span>{format(new Date(ticket.createdAt), "dd/MM/yyyy HH:mm")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cập nhật:</span>
                    <span>{format(new Date(ticket.updatedAt), "dd/MM/yyyy HH:mm")}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TicketDetail;
