
import React from "react";
import { TicketCategory } from "@/types";
import { getCategoryLabel, getCategoryVietnamese } from "@/data/mockData";
import { cn } from "@/lib/utils";

interface CategoryBadgeProps {
  category: TicketCategory | string;
  showEnglish?: boolean;
  className?: string;
}

const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category, showEnglish = true, className }) => {
  const categoryColors: Record<string, string> = {
    tech_setup: "bg-blue-100 text-blue-800",
    dev_issues: "bg-purple-100 text-purple-800",
    mentoring: "bg-orange-100 text-orange-800",
    hr_matters: "bg-yellow-100 text-yellow-800",
  };

  const label = showEnglish 
    ? `${getCategoryVietnamese(category)} (${getCategoryLabel(category)})`
    : getCategoryVietnamese(category);

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        categoryColors[category] || "bg-gray-100 text-gray-800",
        className
      )}
    >
      {label}
    </span>
  );
};

export default CategoryBadge;
