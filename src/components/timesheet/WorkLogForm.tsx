
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from 'date-fns';

const WorkLogForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const navigate = useNavigate();
  const { createWorkLog } = useApp();
  const { toast } = useToast();
  
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [projectName, setProjectName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Calculate hours from start and end time
  const calculateHours = () => {
    if (!startTime || !endTime) return 0;
    
    const start = new Date(`1970-01-01T${startTime}:00`);
    const end = new Date(`1970-01-01T${endTime}:00`);
    const diffMs = end.getTime() - start.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    
    return Math.max(0, diffHours);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const hours = calculateHours();
      
      createWorkLog({
        date,
        startTime,
        endTime,
        hours,
        projectName,
        taskDescription,
      });
      
      toast({
        title: "Nhật ký làm việc đã được tạo",
        description: "Thông tin thời gian làm việc đã được ghi nhận thành công",
      });
      
      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/timesheets');
      }
    } catch (error: any) {
      toast({
        title: "Có lỗi xảy ra",
        description: error.message || "Không thể tạo nhật ký làm việc",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ghi nhận thời gian làm việc</CardTitle>
        <CardDescription>
          Thêm chi tiết thời gian làm việc của bạn
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="worklog-form" onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Ngày</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                max={format(new Date(), 'yyyy-MM-dd')}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="startTime">Thời gian bắt đầu</Label>
              <Input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">Thời gian kết thúc</Label>
              <Input
                id="endTime"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="projectName">Dự án / Phòng ban</Label>
            <Input
              id="projectName"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Nhập tên dự án hoặc phòng ban"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="taskDescription">Mô tả công việc</Label>
            <Textarea
              id="taskDescription"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              placeholder="Mô tả ngắn gọn công việc bạn đã làm"
              rows={3}
            />
          </div>
          
          <div className="bg-muted p-3 rounded-md">
            <div className="flex justify-between items-center">
              <span className="font-medium">Tổng số giờ:</span>
              <span className="text-lg font-bold">{calculateHours()} giờ</span>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={() => navigate('/timesheets')}
          disabled={isSubmitting}
        >
          Hủy
        </Button>
        <Button 
          type="submit" 
          form="worklog-form"
          disabled={isSubmitting || calculateHours() <= 0}
        >
          {isSubmitting ? 'Đang lưu...' : 'Lưu nhật ký'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default WorkLogForm;
