
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageSquareIcon, PaperclipIcon, ClockIcon, UserIcon } from "lucide-react";
import { Ticket } from "@/types";
import StatusBadge from "./StatusBadge";
import CategoryBadge from "./CategoryBadge";
import PriorityBadge from "./PriorityBadge";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

interface TicketCardProps {
  ticket: Ticket;
  onClick?: () => void;
}

const TicketCard: React.FC<TicketCardProps> = ({ ticket, onClick }) => {
  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer border border-gray-100 bg-white" onClick={onClick}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base font-medium text-vcb-text line-clamp-1">{ticket.title}</CardTitle>
          <StatusBadge status={ticket.status} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            <CategoryBadge category={ticket.category} />
            <PriorityBadge priority={ticket.priority} />
          </div>
          <p className="text-sm text-vcb-muted line-clamp-2">{ticket.description}</p>
          <div className="flex items-center text-xs text-gray-500 space-x-4">
            <div className="flex items-center">
              <ClockIcon className="h-3 w-3 mr-1 text-vcb-primary" />
              <span>
                {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true, locale: vi })}
              </span>
            </div>
            {ticket.comments && (
              <div className="flex items-center">
                <MessageSquareIcon className="h-3 w-3 mr-1 text-vcb-primary" />
                <span>{ticket.comments.length}</span>
              </div>
            )}
            {ticket.attachments && (
              <div className="flex items-center">
                <PaperclipIcon className="h-3 w-3 mr-1 text-vcb-primary" />
                <span>{ticket.attachments.length}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0 border-t border-gray-100">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            <Avatar className="h-6 w-6">
              <AvatarImage src={ticket.requester.avatar} alt={ticket.requester.name} />
              <AvatarFallback className="bg-vcb-light text-vcb-primary">{ticket.requester.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-xs text-vcb-muted ml-2">{ticket.requester.name}</span>
          </div>
          {ticket.assigneeId ? (
            <div className="flex items-center">
              <span className="text-xs text-vcb-muted mr-2">Đã giao cho</span>
              <Avatar className="h-6 w-6">
                <AvatarFallback className="bg-vcb-light text-vcb-primary">{ticket.assigneeName ? ticket.assigneeName.charAt(0) : "?"}</AvatarFallback>
              </Avatar>
            </div>
          ) : (
            <Button variant="outline" size="sm" className="text-xs h-7 border-vcb-primary text-vcb-primary hover:bg-vcb-light hover:text-vcb-primary">
              <UserIcon className="h-3 w-3 mr-1" />
              Giao việc
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default TicketCard;
