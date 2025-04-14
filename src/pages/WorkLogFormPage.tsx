
import React from 'react';
import WorkLogForm from '@/components/timesheet/WorkLogForm';
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";

const WorkLogFormPage = () => {
  return (
    <div className="container py-6">
      <div className="flex items-center mb-6">
        <Link to="/timesheets">
          <Button variant="outline" size="sm">
            <ChevronLeft className="h-4 w-4 mr-1" /> Quay lại
          </Button>
        </Link>
        <h1 className="text-3xl font-bold ml-4">Thêm nhật ký làm việc</h1>
      </div>
      
      <div className="max-w-3xl mx-auto">
        <WorkLogForm />
      </div>
    </div>
  );
};

export default WorkLogFormPage;
