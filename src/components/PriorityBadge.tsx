
import React from "react";
import { TicketPriority } from "@/types";
import { getPriorityLabel, getPriorityVietnamese } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { AlertCircleIcon, AlertTriangleIcon, InfoIcon } from "lucide-react";

interface PriorityBadgeProps {
  priority: TicketPriority | string;
  showEnglish?: boolean;
  className?: string;
}

const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, showEnglish = true, className }) => {
  const priorityConfig: Record<string, { color: string; icon: React.FC<{ className?: string }> }> = {
    low: {
      color: "bg-blue-100 text-blue-800",
      icon: InfoIcon,
    },
    medium: {
      color: "bg-yellow-100 text-yellow-800",
      icon: AlertTriangleIcon,
    },
    high: {
      color: "bg-red-100 text-red-800",
      icon: AlertCircleIcon,
    },
  };

  const label = showEnglish 
    ? `${getPriorityVietnamese(priority)} (${getPriorityLabel(priority)})`
    : getPriorityVietnamese(priority);
  
  const config = priorityConfig[priority] || { color: "bg-gray-100 text-gray-800", icon: InfoIcon };
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        config.color,
        className
      )}
    >
      <Icon className="mr-1 h-3 w-3" />
      {label}
    </span>
  );
};

export default PriorityBadge;
