
import React from "react";
import { TicketStatus } from "@/types";
import { getStatusLabel, getStatusVietnamese } from "@/data/mockData";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: TicketStatus | string;
  showEnglish?: boolean;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, showEnglish = true, className }) => {
  const statusColors: Record<string, string> = {
    pending: "bg-amber-100 text-amber-800",
    in_progress: "bg-blue-100 text-blue-800",
    resolved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    approved: "bg-green-100 text-green-800",
  };

  const label = showEnglish 
    ? `${getStatusVietnamese(status)} (${getStatusLabel(status)})`
    : getStatusVietnamese(status);

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        statusColors[status] || "bg-gray-100 text-gray-800",
        className
      )}
    >
      {label}
    </span>
  );
};

export default StatusBadge;
