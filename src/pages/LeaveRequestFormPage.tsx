
import React from 'react';
import LeaveRequestForm from '@/components/timesheet/LeaveRequestForm';
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";

const LeaveRequestFormPage = () => {
  return (
    <div className="container py-6">
      <div className="flex items-center mb-6">
        <Link to="/timesheets">
          <Button variant="outline" size="sm">
            <ChevronLeft className="h-4 w-4 mr-1" /> Quay lại
          </Button>
        </Link>
        <h1 className="text-3xl font-bold ml-4">Tạo yêu cầu nghỉ phép</h1>
      </div>
      
      <div className="max-w-3xl mx-auto">
        <LeaveRequestForm />
      </div>
    </div>
  );
};

export default LeaveRequestFormPage;
